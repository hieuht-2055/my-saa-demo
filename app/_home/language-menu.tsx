"use client";

import Image from "next/image";
import { IconChevronDown } from "./icons";
import { useDismissableMenu } from "./use-dismissable-menu";
import type { Locale } from "./home-screen";

interface LanguageMenuProps {
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
}

const LOCALE_LABEL: Record<Locale, string> = { vi: "VN", en: "EN" };
const LOCALE_OPTIONS: Locale[] = ["vi", "en"];

// mm:I2167:9091;186:1696 — header language selector. Opens on click, closes
// on outside click / Escape (useDismissableMenu), keyboard-operable.
export default function LanguageMenu({ locale, onLocaleChange }: LanguageMenuProps) {
  const { isOpen, setIsOpen, containerRef } = useDismissableMenu<HTMLDivElement>();

  function selectLocale(next: Locale) {
    onLocaleChange(next);
    setIsOpen(false);
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="flex h-14 w-[108px] cursor-pointer items-center justify-between gap-[2px] rounded p-4 text-white transition-colors hover:bg-white/10"
      >
        <span className="flex items-center gap-1">
          <Image src="/home/flag-vn.svg" alt="" width={20} height={15} />
          <span className="[font-family:var(--font-montserrat)] text-base font-bold leading-6 tracking-[0.15px]">
            {LOCALE_LABEL[locale]}
          </span>
        </span>
        <IconChevronDown
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
