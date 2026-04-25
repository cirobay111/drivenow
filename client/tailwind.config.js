// ── TEMPLATE COLORS — Edit here to change the brand color scheme ──────────────
// primary   → dark background
// secondary → slightly lighter dark (cards, sections)
// accent    → brand color (gold by default — change for each client)
// ──────────────────────────────────────────────────────────────────────────────
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary:   '#0D0D0D',
        secondary: '#141414',
        accent:    '#C9A441', // ← Change this to match the client's brand color
      },
      fontFamily: {
        sans: ['Poppins', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 24px rgba(0,0,0,0.5)',
        hover: '0 8px 32px rgba(201,164,65,0.18)',
        gold: '0 0 24px rgba(201,164,65,0.25)',
      },
    },
  },
  safelist: ['shadow-gold', 'shadow-hover', 'shadow-card'],
  plugins: [],
};
