import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import config from '../config/config';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => { setIsOpen(false); }, [location]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navLinks = [
    { id: 'home',    label: 'Home'    },
    { id: 'cars',    label: 'Cars'    },
    { id: 'contact', label: 'Contact' },
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
            {navLinks.map(({ id, label }) => (
              <button key={id} onClick={() => scrollTo(id)}
                className="relative text-sm font-medium text-gray-400 hover:text-white transition-colors duration-150">
                {label}
              </button>
            ))}
            <button onClick={() => scrollTo('cars')} className="btn-primary text-sm py-2 px-5">Book Now</button>
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
            {navLinks.map(({ id, label }) => (
              <button key={id} onClick={() => scrollTo(id)}
                className="block w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all">
                {label}
              </button>
            ))}
            <button onClick={() => scrollTo('cars')} className="block w-full btn-primary text-center text-sm mt-2">Book Now</button>
          </div>
        </div>
      </div>
    </nav>
  );
}
