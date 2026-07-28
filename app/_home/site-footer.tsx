"use client";

import Image from "next/image";
import Link from "next/link";
import NavLink from "./nav-link";
import { useT } from "@/lib/i18n/locale-provider";

const FOOTER_LINKS = [
  { href: "/", key: "nav.aboutSaa" },
  { href: "/he-thong-giai", key: "nav.awardInfo" },
  { href: "/kudos", key: "nav.kudos" },
  { href: "/standards", key: "nav.standards" },
];

interface SiteFooterProps {
  /** Current route — the matching footer nav item renders in its active state. */
  activeHref?: string;
}

// mm:5001:14800 — footer: logo (home link), nav links, copyright.
export default function SiteFooter({ activeHref }: SiteFooterProps = {}) {
  const t = useT("common");

  return (
    <footer className="flex flex-col items-center gap-6 border-t border-[#2E3940] px-6 py-10 sm:px-16 lg:flex-row lg:justify-between lg:px-[90px]">
      <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-center lg:gap-20">
        {/* mm:I5001:14800;342:1408 */}
        <Link href="/" aria-label="Sun* Annual Awards 2025 — về đầu trang">
          <Image src="/home/logo-footer.png" alt="SAA 2025" width={69} height={64} />
        </Link>

        {/* mm:I5001:14800;342:1409 */}
        <nav className="flex flex-wrap items-center justify-center gap-4 lg:gap-12">
          {FOOTER_LINKS.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              label={t(link.key)}
              active={link.href === activeHref}
            />
          ))}
        </nav>
      </div>

      {/* mm:I5001:14800;342:1413 */}
      <p className="[font-family:var(--font-montserrat-alternates)] text-base font-bold leading-6 text-white">
        {t("footer.copyright")}
      </p>
    </footer>
  );
}
