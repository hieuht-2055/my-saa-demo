"use client";

import { useT } from "@/lib/i18n/locale-provider";

/**
 * Fixed-at-bottom footer with the copyright line. Sits at the bottom of the
 * flex column layout so it stays pinned even on short viewports.
 */
export default function LoginFooter() {
  const t = useT("common");

  return (
    <footer className="flex items-center justify-center border-t border-[#2E3940] px-6 py-10 sm:px-24">
      <p className="[font-family:var(--font-montserrat-alternates)] text-base font-bold leading-6 text-white">
        {t("footer.copyright")}
      </p>
    </footer>
  );
}
