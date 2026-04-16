"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useI18n } from "@/components/I18nProvider";

export default function HomePage() {
  const { t } = useI18n();
  const [days, setDays] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const parsed = parseInt(days, 10);
    if (isNaN(parsed) || parsed < 1 || parsed > 30) {
      setError(t.homeValidationError);
      return;
    }
    router.push(`/calendar/${parsed}`);
  };

  return (
    <div className="min-h-full flex items-center justify-center py-16 px-4 bg-gradient-to-b from-blue-50/60 to-white dark:from-gray-900 dark:to-gray-900">
      <div className="w-full max-w-sm">
        {/* Icon + heading */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl
                          bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg shadow-blue-200 dark:shadow-blue-900/40 mb-6">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.8}
            >
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight">
            {t.siteTitle}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-3 text-base leading-relaxed max-w-xs mx-auto">
            {t.homeTagline}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl shadow-blue-100/60 dark:shadow-none border border-blue-100 dark:border-gray-700 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="days-input"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
              >
                {t.homeInputLabel}
              </label>
              <input
                id="days-input"
                type="number"
                min={1}
                max={30}
                value={days}
                onChange={(e) => {
                  setDays(e.target.value);
                  setError("");
                }}
                placeholder={t.homeInputPlaceholder}
                className={`
                  w-full border-2 rounded-xl px-4 py-3 text-gray-900 dark:text-white text-lg font-medium
                  placeholder:text-gray-300 dark:placeholder:text-gray-600 placeholder:font-normal
                  focus:outline-none focus:ring-0 transition-colors duration-150
                  ${error
                    ? "border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20 focus:border-red-400 dark:focus:border-red-600"
                    : "border-blue-200 dark:border-gray-600 bg-blue-50/40 dark:bg-gray-700 focus:border-blue-400 dark:focus:border-blue-500 focus:bg-white dark:focus:bg-gray-700"
                  }
                `}
              />
              {error && (
                <p className="mt-2 text-sm text-red-500 flex items-center gap-1.5">
                  <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600
                         hover:from-blue-600 hover:to-blue-700
                         active:scale-[0.98] text-white font-bold rounded-xl
                         py-3.5 text-base shadow-md shadow-blue-200 dark:shadow-blue-900/40
                         transition-all duration-150
                         focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              {t.homeSubmitBtn}
            </button>
          </form>

          <p className="mt-5 text-xs text-center text-gray-400 dark:text-gray-500">
            {t.homeDisclaimer}
          </p>
        </div>

        {/* Decorative stat pills */}
        <div className="mt-8 flex justify-center gap-3 flex-wrap">
          {[
            { num: "17", label: "Tatil Günü / Holiday Days" },
            { num: "3", label: "Bayram / Celebrations" },
            { num: "10x", label: "Max Verimlilik / Max Efficiency" },
          ].map(({ num, label }) => (
            <div key={num}
              className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-full px-4 py-2
                         border border-blue-100 dark:border-gray-700 shadow-sm text-sm">
              <span className="font-bold text-blue-600 dark:text-blue-400">{num}</span>
              <span className="text-gray-500 dark:text-gray-400">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
