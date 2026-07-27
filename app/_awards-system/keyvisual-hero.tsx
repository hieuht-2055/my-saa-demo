"use client";

import Image from "next/image";
import { useT } from "@/lib/i18n/locale-provider";

// mm:313:8437 (mms_3_Keyvisual) + mm:313:8439 (Cover gradient) + mm:313:8450
// (KV) — same full-bleed "Root Further" artwork as the homepage hero,
// reused here at a smaller scale with just the wordmark logo, no countdown.
export default function KeyvisualHero() {
  const t = useT("awards");

  return (
    <section
      className="relative w-full overflow-hidden bg-cover bg-top"
      style={{ backgroundImage: "url('/home/keyvisual-bg.png')" }}
    >
      {/* mm:313:8439 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: "linear-gradient(0deg, #00101A -4.23%, rgba(0, 19, 32, 0) 52.79%)",
        }}
      />

      {/* mm:313:8450 (KV) */}
      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] items-start px-6 pt-24 pb-10 sm:px-16 lg:px-36">
        {/* mm:2789:12915 */}
        <div className="relative aspect-[169/75] w-full max-w-[338px]">
          <Image
            src="/home/root-further-logo.png"
            alt={t("keyvisualHero.alt")}
            fill
            priority
            sizes="(max-width: 1024px) 60vw, 338px"
            className="object-contain object-left"
          />
        </div>
      </div>
    </section>
  );
}
