"use client";

import Image from "next/image";
import { useState } from "react";
import type { Locale } from "./login-screen";

interface LanguageSelectorProps {
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
}

const LOCALE_LABEL: Record<Locale, string> = { vi: "VN", en: "EN" };
const LOCALE_OPTIONS: Locale[] = ["vi", "en"];

/**
 * Header language selector — VN flag + code + chevron, opens a VN/EN
 * dropdown on click. Only local UI state (open/closed) is owned here;
 * actually switching the app's locale is deferred (Track B / i18n later).
 */
export default function LanguageSelector({
  locale,
  onLocaleChange,
}: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  function selectLocale(next: Locale) {
    onLocaleChange(next);
    setIsOpen(false);
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="flex h-14 w-[108px] cursor-pointer items-center justify-between gap-[2px] rounded p-4 text-white transition-colors hover:bg-white/10"
      >
        <span className="flex items-center gap-1">
          <Image src="/login/flag-vn.svg" alt="" width={24} height={24} />
          <span className="[font-family:var(--font-montserrat)] text-base font-bold leading-6 tracking-[0.15px]">
            {LOCALE_LABEL[locale]}
          </span>
        </span>
        <Image
          src="/login/chevron-down.svg"
          alt=""
          width={24}
          height={24}
          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <ul
          role="listbox"
          className="absolute right-0 top-full z-10 mt-2 w-[108px] overflow-hidden rounded bg-[#0B0F12] shadow-lg"
        >
          {LOCALE_OPTIONS.map((code) => (
            <li key={code}>
              <button
                type="button"
                role="option"
                aria-selected={locale === code}
                onClick={() => selectLocale(code)}
                className={`w-full cursor-pointer px-4 py-2 text-left text-sm font-bold text-white transition-colors hover:bg-white/10 ${
                  locale === code ? "bg-white/5" : ""
                }`}
              >
                {LOCALE_LABEL[code]}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
