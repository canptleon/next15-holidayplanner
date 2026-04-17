"use client";

import Link from "next/link";
import { useI18n } from "@/components/I18nProvider";
import { useTheme } from "@/components/ThemeProvider";
import { Lang } from "@/lib/translations";

const LANGUAGES: { code: Lang; flag: string; label: string }[] = [
  { code: "en", flag: "🇬🇧", label: "EN" },
  { code: "tr", flag: "🇹🇷", label: "TR" },
];

export default function Header() {
  const { lang, setLang, t } = useI18n();
  const { theme, toggleTheme } = useTheme();

  const activeIndex = LANGUAGES.findIndex((l) => l.code === lang);

  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-blue-100 dark:border-gray-700 sticky top-0 z-40 shadow-sm">
      <div className="max-w-screen-2xl mx-auto px-5 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm
                          group-hover:bg-blue-700 transition-colors duration-200">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" strokeWidth={2.2} className="text-white">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="font-bold text-gray-900 dark:text-white text-base tracking-tight
                           group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
            {t.siteTitle}
          </span>
        </Link>

        {/* Right controls */}
        <div className="flex items-center gap-2">

          {/* Dark mode toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 dark:border-gray-600
                       text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800
                       hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500
                       active:scale-95 transition-all duration-150"
          >
            {theme === "dark" ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          {/* Language segmented control */}
          <div className="relative flex items-center p-0.5 rounded-lg
                          bg-gray-100 dark:bg-gray-800
                          border border-gray-200 dark:border-gray-700">

            {/* Sliding pill indicator */}
            <div
              aria-hidden
              className="absolute top-0.5 bottom-0.5 w-[calc(50%-2px)] rounded-md
                         bg-white dark:bg-gray-600
                         shadow-sm border border-gray-200 dark:border-gray-500
                         transition-transform duration-200 ease-in-out"
              style={{ transform: `translateX(calc(${activeIndex * 100}% + ${activeIndex * 4}px))` }}
            />

            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                className={`relative z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold
                            transition-colors duration-200 select-none
                            ${lang === l.code
                              ? "text-gray-900 dark:text-white"
                              : "text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                            }`}
              >
                <span className="text-sm leading-none">{l.flag}</span>
                {l.label}
              </button>
            ))}
          </div>

        </div>
      </div>
    </header>
  );
}
