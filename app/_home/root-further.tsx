"use client";

import Image from "next/image";
import { useT } from "@/lib/i18n/locale-provider";

// mm:3204:10152 — "Root Further" theme copy: decorative wordmark, two
// justified paragraphs, and a centered quote. White on dark, per spec.
export default function RootFurther() {
  const t = useT("home");

  return (
    <section className="mx-auto flex w-full max-w-[1152px] flex-col items-center gap-8 px-6 py-20 sm:px-16 lg:px-[104px] lg:py-[120px]">
      {/* mm:3204:10153 — decorative "ROOT" / "FURTHER" wordmark */}
      <div className="relative h-[134px] w-[290px]">
        {/* mm:3204:10155 */}
        <div className="absolute left-0 top-0 h-[67px] w-[189px]">
          <Image src="/home/root-text.png" alt="" fill sizes="189px" className="object-contain object-left" />
        </div>
        {/* mm:3204:10154 */}
        <div className="absolute left-0 top-[67px] h-[67px] w-[290px]">
          <Image src="/home/further-text.png" alt="ROOT FURTHER" fill sizes="290px" className="object-contain object-left" />
        </div>
      </div>

      {/* mm:3204:10156 */}
      <p className="[font-family:var(--font-montserrat)] text-justify text-2xl font-bold leading-8 text-white">
        {t("rootFurther.para1")}
        <br />
        {t("rootFurther.para2")}
        <br />
        {t("rootFurther.para3")}
      </p>

      {/* mm:3204:10161 */}
      <p className="[font-family:var(--font-montserrat)] text-center text-xl font-bold leading-8 text-white">
        {t("rootFurther.quoteEn")}
        <br />
        {t("rootFurther.quoteVi")}
      </p>

      {/* mm:3204:10162 */}
      <p className="[font-family:var(--font-montserrat)] text-justify text-2xl font-bold leading-8 text-white">
        {t("rootFurther.para4a")}
        <br />
        {t("rootFurther.para4b")}
      </p>
    </section>
  );
}
