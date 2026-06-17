"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { Language } from "@/lib/i18n/translations";

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const stored = localStorage.getItem("km_language") as Language | null;
    const allowedLanguages: Language[] = [
      "en", "te", "hi", "ta", "kn", "ml", "mr", "bn", "gu", "pa", "or", "as"
    ];
    if (stored && allowedLanguages.includes(stored)) {
      setLanguageState(stored);
    }
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("km_language", lang);
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguage(language === "en" ? "te" : "en");
  }, [language, setLanguage]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
