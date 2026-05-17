import { useState, useMemo } from 'react';
import SearchBar from '../components/SearchBar';
import CarCard from '../components/CarCard';
import config from '../config/config';
import content from '../data/content.json';
import { useCars } from '../hooks';
import { DollarSign, MessageSquare, MapPin, Clock, Phone, Mail, Shield, Zap } from 'lucide-react';

const iconMap = {
  DollarSign, Shield, Clock, Zap,
  Phone, Mail, MapPin, MessageSquare,
};

const getIcon = (iconName) => {
  const IconComponent = iconMap[iconName];
  return IconComponent ? <IconComponent className="w-8 h-8" /> : null;
};

const INITIAL_COUNT = 3;

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAll, setShowAll] = useState(false);
  const { cars: allCars, isLoading: isLoadingCars } = useCars();
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
  }, [searchQuery, allCars]);

  const visibleCars = showAll ? cars : cars.slice(0, INITIAL_COUNT);

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));
  const handleSubmit = (e) => { e.preventDefault(); setSubmitted(true); };

  return (
    <div>
      {/* Hero - edit text in src/data/content.json */}
      <section id="home" className="relative min-h-[92vh] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 blur-[3px]"
          style={{ backgroundImage: `url('${hero.backgroundImage}')` }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-[#050505]/45" aria-hidden="true" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_22%,rgba(201,164,65,0.22),transparent_45%),radial-gradient(circle_at_88%_12%,rgba(255,255,255,0.12),transparent_34%),linear-gradient(115deg,rgba(43, 43, 43, 0.98)_12%,rgba(63, 63, 63, 0.86)_48%,rgba(13,13,13,0.7)_100%)]" aria-hidden="true" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 text-center lg:text-left">
              <p className="inline-flex items-center gap-2 text-accent font-semibold text-xs sm:text-sm tracking-[0.22em] uppercase mb-5 rounded-full border border-accent/25 bg-black/25 backdrop-blur-sm px-4 py-2">
                <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                {hero.badge}
              </p>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.05] mb-6">
                {hero.title}{' '}
                <span className="text-gradient">{hero.titleHighlight}</span>{' '}
                {hero.titleSuffix}
              </h1>

              <p className="text-gray-200/90 text-base sm:text-lg md:text-xl max-w-2xl mx-auto lg:mx-0 mb-8 leading-relaxed">
                {hero.subtitle}
              </p>

              <div className="flex flex-wrap gap-3 sm:gap-4 justify-center lg:justify-start mb-10">
                <a href="#cars" className="btn-primary px-8 sm:px-10 py-3.5 text-sm sm:text-base">
                  Explore Fleet
                </a>
                <a href="#contact" className="btn-outline px-8 sm:px-10 py-3.5 text-sm sm:text-base bg-black/20 backdrop-blur-sm">
                  Talk to an Expert
                </a>
              </div>

              <div className="px-0 sm:px-1 lg:pr-8">
                <SearchBar onSearch={setSearchQuery} />
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-3xl border border-white/15 bg-white/8 backdrop-blur-xl p-6 sm:p-7 shadow-[0_30px_80px_rgba(0,0,0,0.5)]">
                <p className="text-xs tracking-[0.22em] uppercase text-gray-300 font-semibold mb-6">Performance Snapshot</p>
                <div className="grid grid-cols-2 gap-4 sm:gap-5">
                  {hero.stats.map(({ value, label }) => (
                    <div key={label} className="rounded-2xl border border-white/10 bg-black/30 px-4 py-5 text-center">
                      <p className="text-2xl sm:text-3xl font-bold text-accent leading-none mb-2">{value}</p>
                      <p className="text-xs sm:text-sm text-gray-300">{label}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t border-white/10 text-sm text-gray-300 leading-relaxed">
                  Premium vehicles, instant confirmations, and support that stays available from pickup to return.
                </div>
              </div>
            </div>
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
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12M8 12h12m-12 5h12M3 7l1.293-1.293a1 1 0 011.414 0L9 7m0 0l1.293-1.293a1 1 0 011.414 0L15 7" />
              </svg>
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
                <div className="flex justify-center mb-4 group-hover:scale-110 transition-transform duration-200 text-accent">
                  {getIcon(icon)}
                </div>
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
                  <Mail className="w-16 h-16 mx-auto mb-4 text-accent" />
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
                  { icon: Phone, title: 'Phone',  lines: [config.contact.phone, 'Available 24/7']                        },
                  { icon: Mail, title: 'Email',  lines: [config.contact.email, config.contact.supportEmail]             },
                  { icon: MapPin, title: 'Office', lines: [config.contact.address]                                        },
                  { icon: Clock, title: 'Hours',  lines: [config.contact.hours.weekdays, config.contact.hours.weekends]  },
                ].map(({ icon: Icon, title, lines }) => (
                  <div key={title} className="flex gap-4 mb-5 last:mb-0">
                    <div className="w-12 h-12 bg-accent/10 border border-accent/20 rounded-xl flex items-center justify-center text-accent shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
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
