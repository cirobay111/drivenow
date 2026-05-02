import { useEffect, useMemo, useState } from 'react';
import SearchBar from '../components/SearchBar';
import CarCard from '../components/CarCard';
import config from '../config/config';
import content from '../data/content.json';
import { getAllCars } from '../services/carStore';

const INITIAL_COUNT = 3;

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [allCars, setAllCars] = useState(() => getAllCars());
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const { hero, fleet, benefits, testimonials, contact: contactContent } = content;

  useEffect(() => {
    const syncCars = () => setAllCars(getAllCars());
    window.addEventListener('focus', syncCars);
    window.addEventListener('drivenow-cars-updated', syncCars);
    window.addEventListener('storage', syncCars);
    return () => {
      window.removeEventListener('focus', syncCars);
      window.removeEventListener('drivenow-cars-updated', syncCars);
      window.removeEventListener('storage', syncCars);
    };
  }, []);

  // Filter only available cars; apply search if the user typed in the SearchBar
  const cars = useMemo(() => {
    const available = allCars.filter(c => c.available);
    if (!searchQuery.trim()) return available;
    const q = searchQuery.toLowerCase();
    return available.filter(c =>
      c.brand.toLowerCase().includes(q) ||
      c.model.toLowerCase().includes(q) ||
      c.fuel_type.toLowerCase().includes(q) ||
      c.transmission.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const visibleCars = showAll ? cars : cars.slice(0, INITIAL_COUNT);
  const heroCar = useMemo(
    () => [...allCars].sort((a, b) => b.price_per_day - a.price_per_day)[0],
    [allCars]
  );

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));
  const handleSubmit = (e) => { e.preventDefault(); setSubmitted(true); };

  return (
    <div>
      {/* ── Hero ── edit text in src/data/content.json */}
      <section id="home" className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-[#050505]">
        <div className="absolute inset-0">
          <img
            src={heroCar?.image_url || hero.backgroundImage}
            alt={heroCar ? `${heroCar.brand} ${heroCar.model}` : config.company.name}
            className="h-full w-full object-cover object-center brightness-[0.92] contrast-[1.14] saturate-[1.08]"
            onError={(e) => { e.currentTarget.src = hero.backgroundImage; }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/86 to-[#050505]/32" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-black/12 to-black/62" />
          <div className="absolute inset-0 noise-overlay opacity-80" />
        </div>

        <div className="absolute -right-24 top-24 hidden h-[30rem] w-[30rem] rounded-full border border-accent/20 opacity-60 lg:block hero-orbit" />
        <div className="absolute right-10 top-36 hidden h-44 w-44 rounded-full border border-white/10 lg:block" />

        <div className="relative z-10 flex min-h-[calc(100vh-4rem)] flex-col justify-between px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto flex w-full max-w-7xl flex-1 items-center pt-5 md:pt-12">
            <div className="max-w-4xl">
              <div className="mb-5 flex flex-wrap items-center gap-3">
                <span className="eyebrow rounded-full border border-accent/25 bg-accent/10 px-4 py-2">{hero.badge}</span>
                {heroCar && (
                  <span className="hidden rounded-full border border-white/10 bg-black/35 px-4 py-2 text-xs font-semibold text-gray-300 backdrop-blur sm:inline-flex">
                    Featured today: {heroCar.brand} {heroCar.model}
                  </span>
                )}
              </div>

              <h1 className="max-w-5xl text-5xl font-black leading-[0.9] text-[#FFF9EC] drop-shadow-[0_4px_30px_rgba(0,0,0,0.78)] sm:text-6xl md:text-7xl lg:text-8xl">
                Drive the city<br />
                in <span className="text-gradient">first-class</span> style.
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-7 text-gray-200 md:text-xl md:leading-8">
                {hero.subtitle}
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <button onClick={() => document.getElementById('cars')?.scrollIntoView({ behavior: 'smooth' })} className="btn-primary text-sm">
                  Explore Fleet
                </button>
                <button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="btn-outline bg-black/20 text-sm backdrop-blur">
                  Speak to an Advisor
                </button>
              </div>
            </div>
          </div>

          <div className="mx-auto grid w-full max-w-7xl gap-4 pb-1 lg:grid-cols-[1fr_2fr] lg:items-end">
            <div className="hidden grid-cols-2 gap-3 lg:grid">
              {hero.stats.map(({ value, label }) => (
                <div key={label} className="rounded-lg border border-white/10 bg-black/38 px-4 py-4 backdrop-blur-md">
                  <p className="text-2xl font-bold text-accent md:text-3xl">{value}</p>
                  <p className="mt-1 text-xs text-gray-500 md:text-sm">{label}</p>
                </div>
              ))}
            </div>

            <SearchBar onSearch={setSearchQuery} />
          </div>
        </div>
      </section>

      {/* ── Fleet ── cars are seeded from src/data/cars.json and persisted locally */}
      <section id="cars" className="py-20 bg-[#080808]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <p className="eyebrow">{fleet.badge}</p>
              <h2 className="section-title mt-2">{fleet.title}</h2>
              <p className="text-gray-500 mt-3 max-w-xl">{fleet.subtitle}</p>
            </div>
            <div className="hidden md:block w-48 gold-divider" />
          </div>

          {cars.length === 0 ? (
              <div className="text-center py-16 text-gray-600 surface">
              <p className="text-5xl mb-4">No Results</p>
              <p className="text-lg font-medium text-gray-400">No cars match your search</p>
              <button onClick={() => setSearchQuery('')} className="btn-outline mt-4 text-sm">
                Clear Search
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {visibleCars.map((car, i) => <CarCard key={car.id} car={car} index={i} />)}
              </div>
              {cars.length > INITIAL_COUNT && (
                <div className="text-center mt-10">
                  <button onClick={() => setShowAll(p => !p)} className="btn-outline px-10 py-3">
                    {showAll ? 'Show Less' : `Show All (${cars.length - INITIAL_COUNT} more)`}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ── Benefits ── edit items in src/data/content.json */}
      <section className="py-20 bg-[#0D0D0D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="eyebrow">{benefits.badge}</p>
            <h2 className="section-title mt-2">{benefits.title}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.items.map(({ title, desc }, i) => (
              <div key={title} className="surface p-6 group fade-up"
                style={{ animationDelay: `${i * 0.08}s`, willChange: 'transform, opacity' }}>
                <div className="text-accent text-sm font-bold mb-8">0{i + 1}</div>
                <h3 className="font-bold text-white text-lg mb-2">{title}</h3>
                <p className="text-gray-500 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── edit items in src/data/content.json */}
      <section className="py-20 bg-[#080808]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="eyebrow">{testimonials.badge}</p>
            <h2 className="section-title mt-2">{testimonials.title}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.items.map(({ name, role, text, avatar }, i) => (
              <div key={name} className="surface p-6 fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-accent text-black rounded-full flex items-center justify-center font-bold text-sm">{avatar}</div>
                  <div>
                    <p className="font-semibold text-white">{name}</p>
                    <p className="text-xs text-gray-500">{role}</p>
                  </div>
                </div>
                <div className="text-accent text-sm mb-3 tracking-[0.18em]">★★★★★</div>
                <p className="text-gray-400 text-sm leading-relaxed">"{text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact ── edit info in src/config/config.js */}
      <section id="contact" className="py-20 bg-[#0D0D0D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="eyebrow">{contactContent.badge}</p>
            <h2 className="section-title mt-2">{contactContent.title}</h2>
            <p className="text-gray-500 mt-3">{contactContent.subtitle}</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="card p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Send Us a Message</h3>
              {submitted ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📬</div>
                  <h4 className="text-xl font-bold text-white mb-2">Message Sent!</h4>
                  <p className="text-gray-500">We'll get back to you within 24 hours.</p>
                  <button onClick={() => setSubmitted(false)} className="btn-outline mt-6 text-sm">Send Another</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Full Name" name="name" type="text" placeholder="John Doe" value={form.name} onChange={handleChange} required />
                    <Field label="Email" name="email" type="email" placeholder="john@example.com" value={form.email} onChange={handleChange} required />
                  </div>
                  <Field label="Phone (optional)" name="phone" type="tel" placeholder={config.contact.phone} value={form.phone} onChange={handleChange} />
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Message</label>
                    <textarea name="message" value={form.message} onChange={handleChange} required rows={5}
                      placeholder="How can we help you?" className="input-dark resize-none" />
                  </div>
                  <button type="submit" className="btn-primary w-full py-3">Send Message</button>
                </form>
              )}
            </div>
            <div className="space-y-6">
              <div className="card p-6">
                <h3 className="text-xl font-bold text-white mb-5">Get in Touch</h3>
                {[
                  { icon: '📞', title: 'Phone',  lines: [config.contact.phone, 'Available 24/7']                        },
                  { icon: '✉️', title: 'Email',  lines: [config.contact.email, config.contact.supportEmail]             },
                  { icon: '📍', title: 'Office', lines: [config.contact.address]                                        },
                  { icon: '🕐', title: 'Hours',  lines: [config.contact.hours.weekdays, config.contact.hours.weekends]  },
                ].map(({ icon, title, lines }) => (
                  <div key={title} className="flex gap-4 mb-5 last:mb-0">
                    <div className="w-12 h-12 bg-accent/10 border border-accent/20 rounded-xl flex items-center justify-center text-xl shrink-0">{icon}</div>
                    <div>
                      <p className="font-semibold text-white">{title}</p>
                      {lines.map(l => <p key={l} className="text-gray-500 text-sm">{l}</p>)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="card overflow-hidden h-64">
                {config.maps.embedUrl ? (
                  <iframe
                    title={`${config.company.name} Location`}
                    src={config.maps.embedUrl}
                    width="100%" height="100%"
                    style={{ border: 0, filter: 'invert(1) hue-rotate(180deg)' }}
                    allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                  />
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center px-6 bg-[#0A0A0A]">
                    <p className="text-accent font-semibold">Map location</p>
                    <p className="text-gray-500 text-sm mt-2">{config.contact.address}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Field({ label, name, type, placeholder, value, onChange, required }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
      <input type={type} name={name} placeholder={placeholder} value={value} onChange={onChange} required={required}
        className="input-dark" />
    </div>
  );
}
