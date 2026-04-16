"use client";

import Link from "next/link";
import { useI18n } from "@/components/I18nProvider";

export default function Header() {
  const { lang, setLang, t } = useI18n();

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-40 shadow-sm">
      <div className="max-w-screen-2xl mx-auto px-5 py-3 flex items-center justify-between">
        {/* Logo / title */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm
                          group-hover:bg-blue-700 transition-colors duration-200">
            <svg
              className="w-4.5 h-4.5 text-white"
              width="18" height="18"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <span className="font-bold text-gray-900 text-base tracking-tight group-hover:text-blue-600 transition-colors duration-200">
            {t.siteTitle}
          </span>
        </Link>

        {/* Language toggle */}
        <button
          onClick={() => setLang(lang === "tr" ? "en" : "tr")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-blue-200
                     text-sm font-semibold text-blue-600 bg-blue-50
                     hover:bg-blue-100 hover:border-blue-300
                     active:scale-95 transition-all duration-150"
          aria-label="Toggle language"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
          </svg>
          {t.langLabel}
        </button>
      </div>
    </header>
  );
}
