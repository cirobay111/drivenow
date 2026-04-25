import { useState, useMemo } from 'react';
import SearchBar from '../components/SearchBar';
import CarCard from '../components/CarCard';
import config from '../config/config';
import content from '../data/content.json';
// Edit cars here → src/data/cars.json
import allCars from '../data/cars.json';

const INITIAL_COUNT = 3;

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const { hero, fleet, benefits, testimonials, contact: contactContent } = content;

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

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));
  const handleSubmit = (e) => { e.preventDefault(); setSubmitted(true); };

  return (
    <div>
      {/* ── Hero ── edit text in src/data/content.json */}
      <section id="home" className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('${hero.backgroundImage}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D0D0D]/98 via-[#0D0D0D]/85 to-[#0D0D0D]/50" />
        <div className="relative z-10 text-center px-4 w-full max-w-7xl mx-auto">
          <p className="text-accent font-semibold text-sm tracking-[0.3em] uppercase mb-4">{hero.badge}</p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
            {hero.title}<br />
            <span className="text-gradient">{hero.titleHighlight}</span>{' '}
            {hero.titleSuffix}
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">{hero.subtitle}</p>
          <div className="px-2">
            <SearchBar onSearch={setSearchQuery} />
          </div>
          <div className="flex justify-center gap-8 mt-10">
            {hero.stats.map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-accent">{value}</p>
                <p className="text-xs md:text-sm text-gray-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Fleet ── cars loaded from src/data/cars.json */}
      <section id="cars" className="py-20 bg-[#080808]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-accent font-semibold text-sm tracking-[0.3em] uppercase">{fleet.badge}</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">{fleet.title}</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">{fleet.subtitle}</p>
          </div>

          {cars.length === 0 ? (
            <div className="text-center py-16 text-gray-600">
              <p className="text-5xl mb-4">🚗</p>
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
            <p className="text-accent font-semibold text-sm tracking-[0.3em] uppercase">{benefits.badge}</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">{benefits.title}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.items.map(({ icon, title, desc }, i) => (
              <div key={title} className="card p-6 text-center group fade-up"
                style={{ animationDelay: `${i * 0.08}s`, willChange: 'transform, opacity' }}>
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-200">{icon}</div>
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
            <p className="text-accent font-semibold text-sm tracking-[0.3em] uppercase">{testimonials.badge}</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">{testimonials.title}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.items.map(({ name, role, text, avatar }, i) => (
              <div key={name} className="card p-6 fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-accent text-black rounded-full flex items-center justify-center font-bold text-sm">{avatar}</div>
                  <div>
                    <p className="font-semibold text-white">{name}</p>
                    <p className="text-xs text-gray-500">{role}</p>
                  </div>
                </div>
                <div className="text-accent text-lg mb-2">★★★★★</div>
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
            <p className="text-accent font-semibold text-sm tracking-[0.3em] uppercase">{contactContent.badge}</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">{contactContent.title}</h2>
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
                <iframe
                  title={`${config.company.name} Location`}
                  src={config.maps.embedUrl}
                  width="100%" height="100%"
                  style={{ border: 0, filter: 'invert(1) hue-rotate(180deg)' }}
                  allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                />
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
