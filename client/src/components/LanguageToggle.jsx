import { useLanguage } from '../context/LanguageContext';

export default function LanguageToggle() {
  const { lang, setLang } = useLanguage();

  return (
    <button
      onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}
      className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-full border border-[#2A2A2A] text-gray-400 hover:border-accent hover:text-accent transition-all duration-150"
      title={lang === 'fr' ? 'Switch to English' : 'Passer en Français'}
    >
      <span className={lang === 'fr' ? 'text-accent' : ''}>FR</span>
      <span className="text-gray-600">/</span>
      <span className={lang === 'en' ? 'text-accent' : ''}>EN</span>
    </button>
  );
}
