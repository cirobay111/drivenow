import { Link } from 'react-router-dom';
import config from '../config/config';

export default function Footer() {
  const { company, contact, social } = config;
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#080808] border-t border-[#2A2A2A] text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Brand — edit in src/config/config.js */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-3 group w-fit">
              <img
                src={company.logo}
                alt={company.name}
                className="h-12 w-12 object-contain"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <div className="leading-none">
                <span className="text-xl font-bold tracking-widest text-white">{company.name}</span>
                <p className="text-[10px] tracking-[0.2em] text-accent font-medium uppercase">{company.tagline}</p>
              </div>
            </Link>
            <p className="mt-4 text-sm leading-relaxed max-w-xs text-gray-500">{company.description}</p>
            {/* Social links — add URLs in src/config/config.js */}
            {(social.instagram || social.facebook || social.twitter) && (
              <div className="flex gap-4 mt-4">
                {social.instagram && (
                  <a href={social.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-accent transition-colors text-sm">Instagram</a>
                )}
                {social.facebook && (
                  <a href={social.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-accent transition-colors text-sm">Facebook</a>
                )}
                {social.twitter && (
                  <a href={social.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-accent transition-colors text-sm">Twitter</a>
                )}
              </div>
            )}
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 tracking-wide">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {[['/', 'Home'], ['/cars', 'Browse Cars'], ['/contact', 'Contact']].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="hover:text-accent transition-colors duration-150">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info — edit in src/config/config.js */}
          <div>
            <h4 className="text-white font-semibold mb-4 tracking-wide">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>{contact.phone}</li>
              <li>{contact.email}</li>
              <li>{contact.address}</li>
              {contact.whatsapp && (
                <li>
                  <a
                    href={`https://wa.me/${contact.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-500 hover:text-green-400 transition-colors"
                  >
                    WhatsApp
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-[#2A2A2A] mt-10 pt-6 flex flex-col md:flex-row justify-between items-center text-sm gap-4">
          <p className="text-gray-600">© {year} {company.name} {company.tagline}. All rights reserved.</p>
          <Link to="/admin/login" className="text-gray-700 hover:text-gray-500 text-xs transition-colors">Admin</Link>
        </div>
      </div>
    </footer>
  );
}
