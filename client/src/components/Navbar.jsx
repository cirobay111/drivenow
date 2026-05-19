import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import config from '../config/config';
import { useLanguage } from '../context/LanguageContext';
import LanguageToggle from './LanguageToggle';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => { setIsOpen(false); }, [location]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const { t } = useLanguage();

  const navLinks = [
    { to: '/',        label: t('nav.home')    },
    { to: '/cars',    label: t('nav.cars')    },
    { to: '/contact', label: t('nav.contact') },
  ];

  return (
    <nav className={`sticky top-0 z-50 border-b transition-all duration-300 ${scrolled ? 'bg-[#0D0D0D]/95 backdrop-blur-md border-[#C9A441]/20 shadow-gold' : 'bg-[#0D0D0D] border-[#2A2A2A]'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo — edit company name/logo in src/config/config.js */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src={config.company.logo}
              alt={config.company.name}
              className="h-10 w-10 object-contain transition-transform duration-200 group-hover:scale-105"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div className="leading-none">
              <span className="text-xl font-bold tracking-widest text-white">{config.company.name}</span>
              <p className="text-[10px] tracking-[0.2em] text-accent font-medium uppercase">{config.company.tagline}</p>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(({ to, label }) => (
              <NavLink key={to} to={to} end={to === '/'}
                className={({ isActive }) =>
                  `relative text-sm font-medium transition-colors duration-150 ${isActive ? 'text-accent' : 'text-gray-400 hover:text-white'}`
                }>
                {label}
              </NavLink>
            ))}
            <LanguageToggle />
            <Link to="/cars" className="btn-primary text-sm py-2 px-5">{t('car.book')}</Link>
          </div>

          <button className="md:hidden text-gray-400 hover:text-white transition-colors" onClick={() => setIsOpen(!isOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>

        <div className="md:hidden overflow-hidden transition-all duration-250"
          style={{ maxHeight: isOpen ? '300px' : '0px', opacity: isOpen ? 1 : 0 }}>
          <div className="pb-4 space-y-1">
            {navLinks.map(({ to, label }) => (
              <NavLink key={to} to={to} end={to === '/'}
                className={({ isActive }) =>
                  `block w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive ? 'text-accent bg-accent/10' : 'text-gray-400 hover:text-white hover:bg-white/5'}`
                }>
                {label}
              </NavLink>
            ))}
            <div className="flex items-center gap-3 mt-2">
              <LanguageToggle />
              <Link to="/cars" className="flex-1 btn-primary text-center text-sm">{t('car.book')}</Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
