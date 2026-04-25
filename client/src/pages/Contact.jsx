import { useState } from 'react';
import config from '../config/config';
import content from '../data/content.json';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));
  const handleSubmit = (e) => { e.preventDefault(); setSubmitted(true); };

  // Edit contact info in src/config/config.js
  const { contact: contactContent } = content;
  const { contact, maps, company } = config;

  const contactItems = [
    { icon: '📞', title: 'Phone',  lines: [contact.phone, 'Available 24/7']                       },
    { icon: '✉️', title: 'Email',  lines: [contact.email, contact.supportEmail]                   },
    { icon: '📍', title: 'Office', lines: [contact.address]                                       },
    { icon: '🕐', title: 'Hours',  lines: [contact.hours.weekdays, contact.hours.weekends]        },
  ];

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      <div className="bg-[#080808] border-b border-[#2A2A2A] py-16 text-center">
        <p className="text-accent font-semibold text-sm tracking-[0.3em] uppercase mb-2">{contactContent.badge}</p>
        <h1 className="text-4xl font-bold text-white">{contactContent.title}</h1>
        <p className="text-gray-500 mt-2">{contactContent.subtitle}</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="card p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Send Us a Message</h2>
            {submitted ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📬</div>
                <h3 className="text-xl font-bold text-white mb-2">Message Sent!</h3>
                <p className="text-gray-500">We'll get back to you within 24 hours.</p>
                <button onClick={() => setSubmitted(false)} className="btn-outline mt-6 text-sm">Send Another</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Full Name" name="name" type="text" placeholder="John Doe" value={form.name} onChange={handleChange} required />
                  <Field label="Email" name="email" type="email" placeholder="john@example.com" value={form.email} onChange={handleChange} required />
                </div>
                <Field label="Phone (optional)" name="phone" type="tel" placeholder={contact.phone} value={form.phone} onChange={handleChange} />
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Message</label>
                  <textarea name="message" value={form.message} onChange={handleChange} required rows={5}
                    placeholder="How can we help you?"
                    className="input-dark resize-none" />
                </div>
                <button type="submit" className="btn-primary w-full py-3">Send Message</button>
              </form>
            )}
          </div>

          <div className="space-y-6">
            <div className="card p-6">
              <h2 className="text-xl font-bold text-white mb-5">Get in Touch</h2>
              {contactItems.map(({ icon, title, lines }) => (
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
                title={`${company.name} Location`}
                src={maps.embedUrl}
                width="100%" height="100%"
                style={{ border: 0, filter: 'invert(1) hue-rotate(180deg)' }}
                allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
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
