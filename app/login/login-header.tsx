"use client";

import Image from "next/image";
import LanguageSelector from "./language-selector";
import { useT } from "@/lib/i18n/locale-provider";

/**
 * Sticky top header: Sun* Annual Awards 2025 brand logo (static) + language
 * selector. Stays visible while the hero scrolls.
 */
export default function LoginHeader() {
  const t = useT("login");

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between bg-[rgba(11,15,18,0.8)] px-6 py-3 backdrop-blur-sm sm:px-16 lg:px-36">
      <Image
        src="/login/logo.png"
        alt={t("logoAlt")}
        width={52}
        height={48}
        priority
      />
      <LanguageSelector />
    </header>
  );
}
