"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { translations, Lang, TranslationMap } from "@/lib/translations";

interface I18nContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: TranslationMap;
}

const I18nContext = createContext<I18nContextType>({
  lang: "en",
  setLang: () => {},
  t: translations.en,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");

  // Restore from localStorage after mount
  useEffect(() => {
    const saved = localStorage.getItem("hp_lang") as Lang | null;
    if (saved === "tr" || saved === "en") setLang(saved);
  }, []);

  const handleSetLang = (l: Lang) => {
    setLang(l);
    localStorage.setItem("hp_lang", l);
  };

  return (
    <I18nContext.Provider value={{ lang, setLang: handleSetLang, t: translations[lang] }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextType {
  return useContext(I18nContext);
}
