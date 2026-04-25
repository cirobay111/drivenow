// ============================================================
// ✏️  STEP 1 — Edit this file for every new client
// ============================================================
// This is the ONLY place you need to change company info.
// Every page (navbar, footer, contact, booking) reads from here.
// ============================================================

const config = {
  company: {
    // Shown in the navbar and footer logo area
    name: 'YOUR COMPANY',
    tagline: 'Car Rental',
    // Shown in the footer description
    description: 'Your premium car rental service. Affordable rates, full insurance, and 24/7 support.',
    foundedYear: '2020',
    // Place the client logo at /public/logo.png
    logo: '/logo.png',
  },

  contact: {
    phone: '+1 000 000 0000',
    email: 'info@yourcompany.com',
    supportEmail: 'support@yourcompany.com',
    address: 'Your City, Your Country',
    // Digits only — used for the wa.me WhatsApp link in the footer
    // Example: '212600000000'  →  Leave empty '' to hide the WhatsApp button
    whatsapp: '',
    hours: {
      weekdays: 'Mon – Fri: 8AM – 8PM',
      weekends: 'Sat – Sun: 9AM – 6PM',
    },
  },

  social: {
    // Leave empty '' to hide the link
    instagram: '',
    facebook: '',
    twitter: '',
  },

  // Google Maps embed URL
  // How to get yours: Google Maps → your location → Share → Embed a map → copy src="..."
  maps: {
    embedUrl: '',
  },

  // Currency symbol shown next to all prices
  // Examples: '$'  '€'  'MAD '  '£'
  currency: '$',

  // ── Admin credentials — CHANGE BEFORE DEPLOYMENT ──────────────────────────
  // These are used to log in to /admin/login
  // Never commit real passwords to version control
  admin: {
    email: 'admin@yourcompany.com',
    password: 'Admin@123',
  },
};

export default config;
