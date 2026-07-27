import Image from "next/image";
import LanguageSelector from "./language-selector";
import type { Locale } from "./login-screen";

interface LoginHeaderProps {
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
}

/**
 * Sticky top header: Sun* Annual Awards 2025 brand logo (static, not
 * interactive) + language selector. Stays visible while the hero scrolls.
 */
export default function LoginHeader({
  locale,
  onLocaleChange,
}: LoginHeaderProps) {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between bg-[rgba(11,15,18,0.8)] px-6 py-3 backdrop-blur-sm sm:px-16 lg:px-36">
      <Image
        src="/login/logo.png"
        alt="Sun* Annual Awards 2025"
        width={52}
        height={48}
        priority
      />
      <LanguageSelector locale={locale} onLocaleChange={onLocaleChange} />
    </header>
  );
}
