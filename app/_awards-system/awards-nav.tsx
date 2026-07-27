"use client";

import { useEffect, useRef, useState } from "react";
import { IconTarget } from "./icons";
import { AWARD_NAV_SLUGS } from "./awards-system-data";
import { useT } from "@/lib/i18n/locale-provider";

// mm:313:8459 (mms_C_Menu list) — sticky scroll-spy sidebar. The first item
// (mm:313:8460, componentId 186:1501) carries the gold/underline "active"
// treatment by default in the design; every other item uses the plain
// variant (componentId 186:1433). Here "active" tracks whichever award
// section currently sits in the viewport instead of always being item 1.
export default function AwardsNav() {
  const t = useT("awards");
  const [activeSlug, setActiveSlug] = useState<string>(AWARD_NAV_SLUGS[0] ?? "");
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const sections = AWARD_NAV_SLUGS.map((slug) => document.getElementById(slug)).filter(
      (el): el is HTMLElement => el !== null,
    );

    // Guard: no matching sections in the DOM (bad/renamed slugs) — skip
    // wiring the observer instead of throwing (test ID-13).
    if (sections.length === 0) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible[0]?.target.id) {
          setActiveSlug(visible[0].target.id);
        }
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 },
    );

    sections.forEach((section) => observerRef.current?.observe(section));

    return () => observerRef.current?.disconnect();
  }, []);

  function handleNavClick(slug: string) {
    const target = document.getElementById(slug);
    // Guard: clicking an item whose section doesn't exist is a no-op, not
    // a crash (test ID-13).
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveSlug(slug);
  }

  return (
    <nav
      aria-label={t("nav.ariaLabel")}
      className="sticky top-24 flex w-full shrink-0 flex-col items-start gap-4 self-start lg:w-[178px]"
    >
      {AWARD_NAV_SLUGS.map((slug) => {
        const isActive = slug === activeSlug;
        return (
          <button
            key={slug}
            type="button"
            onClick={() => handleNavClick(slug)}
            aria-current={isActive ? "true" : undefined}
            className={`flex items-center gap-1 whitespace-pre-line p-4 text-left [font-family:var(--font-montserrat)] text-sm font-bold leading-5 tracking-[0.25px] transition-colors duration-200 ${
              isActive
                ? "border-b border-[#FFEA9E] text-[#FFEA9E] [text-shadow:0_4px_4px_rgba(0,0,0,0.25),0_0_6px_#FAE287]"
                : "text-white hover:text-[#FFEA9E]"
            }`}
          >
            <IconTarget width={24} height={24} className="shrink-0" />
            {t(`nav.${slug}`)}
          </button>
        );
      })}
    </nav>
  );
}
