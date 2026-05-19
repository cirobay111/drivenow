import { createContext, useContext, useState, useCallback } from 'react';
import fr from '../translations/fr';
import en from '../translations/en';

const translations = { fr, en };
const STORAGE_KEY = 'lang';

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [lang, setLangState] = useState(() => localStorage.getItem(STORAGE_KEY) || 'fr');

  const setLang = useCallback((code) => {
    setLangState(code);
    localStorage.setItem(STORAGE_KEY, code);
  }, []);

  const t = useCallback(
    (key) => {
      const keys = key.split('.');
      let val = translations[lang];
      for (const k of keys) {
        val = val?.[k];
        if (val === undefined) return key; // fallback: show the key
      }
      return val;
    },
    [lang],
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
};
