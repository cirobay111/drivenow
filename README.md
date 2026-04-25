# Car Rental Website Template

A plug-and-play car rental website template. Duplicate this project and edit **3 files** to launch a fully branded site for a new client.

**Tech Stack:** React 18 + Vite + TailwindCSS · Node.js + Express · JWT Auth · File-based JSON DB

---

## Quick Start — New Client in 5 Minutes

```bash
# 1. Copy the project
cp -r drivenow my-new-client

# 2. Install dependencies
cd my-new-client/client && npm install
cd ../server && npm install

# 3. Edit the 3 config files (see below)

# 4. Start the app
cd client && npm run dev   # frontend  → http://localhost:5173
cd server && npm start     # backend   → http://localhost:5000
```

---

## File 1 — Company Info (`client/src/config/config.js`)

This is the **master config**. Every page reads from here — change it once and the whole site updates.

```js
const config = {
  company: {
    name: 'ATLAS',           // Company name (shown in navbar & footer)
    tagline: 'Luxury Cars',  // Tagline shown under the logo
    description: '...',      // Footer description
    logo: '/logo.png',       // Place client logo at client/public/logo.png
  },
  contact: {
    phone: '+212 600 000 000',
    email: 'hello@atlas.ma',
    supportEmail: 'support@atlas.ma',
    address: 'Marrakech, Maroc',
    whatsapp: '212600000000', // Digits only — used for wa.me link
    hours: {
      weekdays: 'Mon – Fri: 8AM – 10PM',
      weekends: 'Sat – Sun: 9AM – 8PM',
    },
  },
  social: {
    instagram: 'https://instagram.com/yourpage',
    facebook:  '',
    twitter:   '',
  },
  maps: {
    // Generate: Google Maps → Share → Embed a map → copy the src="..." value
    embedUrl: 'https://www.google.com/maps/embed?...',
  },
  currency: '$', // Change to '€', 'MAD ', etc.
};
```

**What updates automatically:** navbar logo/name, footer, contact page, homepage contact section, all price displays.

---

## File 2 — Page Content (`client/src/data/content.json`)

All visible text on the homepage. No need to touch any `.jsx` files.

| Key | What it controls |
|-----|-----------------|
| `hero` | Banner title, subtitle, badge, background image, stats |
| `fleet` | "Browse Our Cars" section heading |
| `benefits` | The 4 feature cards (icon, title, description) |
| `testimonials` | Customer review cards |
| `contact` | Contact section heading |
| `booking.guarantees` | Bullet points shown in the booking sidebar |

**Example — change the hero:**
```json
"hero": {
  "badge": "FastRide · Casablanca · Est. 2015",
  "title": "Rent a Car in",
  "titleHighlight": "Casablanca",
  "titleSuffix": "Today",
  "subtitle": "Affordable, reliable car rentals with free delivery.",
  ...
}
```

---

## File 3 — Brand Colors (`client/tailwind.config.js`)

```js
colors: {
  primary:   '#0D0D0D',  // Dark background
  secondary: '#141414',  // Slightly lighter (cards, sections)
  accent:    '#C9A441',  // ← Brand color — change this for each client
},
```

After changing `accent`, restart the dev server (`npm run dev`) so Tailwind rebuilds.

---

## Managing Cars

Cars are managed through the **Admin Panel**, not by editing files.

1. Open `http://localhost:5173/admin/login`
2. Default credentials: `admin@drivenow.com` / `Admin@123`
3. Go to **Manage Cars** → add, edit, delete cars
4. Changes are saved automatically to `server/data.json`

**To seed a fresh fleet for a new client**, edit the `"cars"` array in `server/data.json`. Each car needs:

```json
{
  "id": 1,
  "brand": "Toyota",
  "model": "Corolla",
  "year": 2023,
  "price_per_day": 40,
  "fuel_type": "Gasoline",
  "seats": 5,
  "transmission": "Automatic",
  "image_url": "https://...",
  "description": "Reliable and comfortable.",
  "available": true
}
```

**To change the admin password:**
```bash
# Run from the server/ directory
node -e "const b=require('bcryptjs'); b.hash('NewPass123', 10).then(h=>console.log(h))"
# Paste the output hash into server/data.json → users[0].password
```

---

## Adding a Logo

Place the client's logo at `client/public/logo.png`.
Recommended: **120×120px**, PNG with transparent background.

If the image fails to load it hides itself gracefully (no broken-image icon).

---

## WhatsApp Booking (Optional)

Set `contact.whatsapp` in `config.js` to the client's number (digits only, e.g. `"212600000000"`).  
The footer will show a clickable WhatsApp link automatically.

To redirect bookings to WhatsApp instead of the backend, replace `handleSubmit` in `client/src/pages/Booking.jsx`:

```js
const handleSubmit = (e) => {
  e.preventDefault();
  const msg = encodeURIComponent(
    `New booking:\nCar: ${car.brand} ${car.model}\nPickup: ${form.pickup_date}\nReturn: ${form.return_date}\nName: ${form.customer_name}\nPhone: ${form.customer_phone}`
  );
  window.open(`https://wa.me/${config.contact.whatsapp}?text=${msg}`, '_blank');
};
```

---

## Project Structure

```
drivenow/
├── client/                        # React frontend (Vite + TailwindCSS)
│   ├── public/
│   │   └── logo.png               # ← Replace with client logo
│   └── src/
│       ├── config/
│       │   └── config.js          # ← EDIT 1: company info, contact, colors ref
│       ├── data/
│       │   └── content.json       # ← EDIT 2: all page text
│       ├── components/
│       │   ├── Navbar.jsx         # Uses config.js
│       │   ├── Footer.jsx         # Uses config.js
│       │   ├── CarCard.jsx        # Uses config.currency
│       │   ├── SearchBar.jsx
│       │   └── AdminLayout.jsx
│       ├── pages/
│       │   ├── Home.jsx           # Uses config.js + content.json
│       │   ├── Cars.jsx
│       │   ├── CarDetail.jsx
│       │   ├── Booking.jsx        # Uses config.currency + content.json
│       │   ├── Contact.jsx        # Uses config.js + content.json
│       │   └── Login.jsx
│       └── pages/admin/
│           ├── Dashboard.jsx
│           ├── ManageCars.jsx
│           └── ManageBookings.jsx
│
└── server/                        # Node.js + Express backend
    ├── data.json                  # ← EDIT 3 (optional): seed cars for new client
    ├── .env                       # JWT_SECRET, PORT
    └── src/
        ├── config/database.js     # File-based JSON DB helpers
        ├── controllers/           # Auth, cars, bookings logic
        ├── middleware/            # JWT auth, rate limiting
        └── routes/                # API route definitions
```

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/cars | — | List cars (with filters) |
| GET | /api/cars/:id | — | Get car by ID |
| POST | /api/cars | Admin | Create car |
| PUT | /api/cars/:id | Admin | Update car |
| DELETE | /api/cars/:id | Admin | Delete car |
| POST | /api/bookings | — | Create booking |
| GET | /api/bookings | Admin | List all bookings |
| GET | /api/bookings/stats | Admin | Dashboard stats |
| PUT | /api/bookings/:id/status | Admin | Update status |
| POST | /api/auth/login | — | Admin login |
| GET | /api/auth/me | Auth | Get current user |

---

## Checklist for Each New Client

- [ ] Copy project folder
- [ ] `config.js` — name, phone, email, address, WhatsApp, maps URL
- [ ] `content.json` — hero text, benefits, testimonials
- [ ] `tailwind.config.js` → `accent` color
- [ ] Replace `client/public/logo.png`
- [ ] Seed cars in `server/data.json`
- [ ] Change admin password in `server/data.json`
- [ ] Set unique `JWT_SECRET` in `server/.env`
- [ ] Deploy and test
