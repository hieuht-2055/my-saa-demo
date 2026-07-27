"use client";

import { useT } from "@/lib/i18n/locale-provider";

// mm:313:8453 (mms_A_Title hệ thống giải thưởng) — small centered label,
// divider, then the large centered gold heading for the whole screen.
export default function SectionTitle() {
  const t = useT("awards");

  return (
    <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center gap-4 px-6 sm:px-16 lg:px-36">
      {/* mm:313:8454 */}
      <p className="text-center [font-family:var(--font-montserrat)] text-2xl font-bold leading-8 text-white">
        {t("sectionTitle.subtitle")}
      </p>
      {/* mm:313:8455 */}
      <div className="h-px w-full bg-[#2E3940]" />
      {/* mm:313:8457 */}
      <h1 className="text-center [font-family:var(--font-montserrat)] text-[clamp(32px,5vw,57px)] font-bold leading-tight tracking-[-0.25px] text-[#FFEA9E]">
        {t("sectionTitle.heading")}
      </h1>
    </div>
  );
}
