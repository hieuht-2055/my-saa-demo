"use client";

import Image from "next/image";
import { Fragment } from "react";
import { IconDiamond, IconLicense, IconTarget } from "./icons";
import { useT } from "@/lib/i18n/locale-provider";
import type { AwardDetailData } from "./awards-system-data";

// mm:313:8467 / 313:8468 / 313:8469 / 313:8470 / 313:8471 / 313:8510
// (mms_D.1 .. mms_D.6) — one full award section: glowing-ring photo +
// wordmark on one side, title/description/quantity/value content on the
// other. `imageSide` drives which side the photo sits on, matching the
// left/right alternation the design uses row over row.
export default function AwardDetailCard({
  slug,
  nameImage,
  nameImageWidth,
  nameImageHeight,
  quantityValue,
  quantityUnitKey,
  prizes,
  imageSide,
}: AwardDetailData) {
  const t = useT("awards");
  const title = t(`card.${slug}.title`);
  const description = t(`card.${slug}.description`);
  const quantityUnit = t(`unit.${quantityUnitKey}`);

  return (
    <section id={slug} className="w-full scroll-mt-28">
      <div
        className={`flex w-full flex-col items-center gap-10 border-b border-[#2E3940] pb-10 lg:flex-row lg:items-start lg:gap-10 ${
          imageSide === "right" ? "lg:flex-row-reverse" : ""
        }`}
      >
        {/* mm:I...214:2525 / 214:2617 (Picture-Award) — shared glowing-ring
            photo, per-award wordmark overlay */}
        <div
          className="relative aspect-square w-full max-w-[336px] shrink-0 overflow-hidden rounded-3xl mix-blend-screen"
          style={{ boxShadow: "0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287" }}
        >
          <Image
            src="/home/award-bg.png"
            alt=""
            fill
            sizes="336px"
            className="rounded-3xl border-[0.955px] border-[#FFEA9E] object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <Image
              src={nameImage}
              alt={title}
              width={nameImageWidth}
              height={nameImageHeight}
              className="h-auto max-w-[75%] object-contain"
            />
          </div>
        </div>

        {/* mm:I...214:2526 / 214:2618 (Content) */}
        <div className="flex w-full min-w-0 flex-1 flex-col gap-6 rounded-2xl lg:max-w-[480px]">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <IconTarget width={24} height={24} className="shrink-0 text-[#FFEA9E]" />
              <h2 className="[font-family:var(--font-montserrat)] text-2xl font-bold leading-8 text-[#FFEA9E]">
                {title}
              </h2>
            </div>
            <p className="text-justify [font-family:var(--font-montserrat)] text-base font-bold leading-6 tracking-[0.5px] text-white">
              {description}
            </p>
          </div>

          <div className="h-px w-full bg-[#2E3940]" />

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="flex items-center gap-4">
              <IconDiamond width={24} height={24} className="shrink-0 text-white" />
              <span className="whitespace-nowrap [font-family:var(--font-montserrat)] text-2xl font-bold leading-8 text-[#FFEA9E]">
                {t("card.quantityLabel")}
              </span>
            </span>
            <span className="flex items-baseline gap-2">
              <span className="[font-family:var(--font-montserrat)] text-4xl font-bold leading-[44px] text-white">
                {quantityValue}
              </span>
              <span className="whitespace-nowrap [font-family:var(--font-montserrat)] text-sm font-bold tracking-[0.1px] text-white">
                {quantityUnit}
              </span>
            </span>
          </div>

          <div className="h-px w-full bg-[#2E3940]" />

          {prizes.map((prize, index) => (
            <Fragment key={prize.noteKey}>
              {index > 0 && (
                <div className="flex items-center gap-2">
                  <span className="[font-family:var(--font-montserrat)] text-sm font-bold tracking-[0.1px] text-[#2E3940]">
                    {t("card.prizeOr")}
                  </span>
                  <div className="h-px flex-1 bg-[#2E3940]" />
                </div>
              )}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <IconLicense width={24} height={24} className="shrink-0 text-white" />
                  <span className="[font-family:var(--font-montserrat)] text-2xl font-bold leading-8 text-[#FFEA9E]">
                    {t("card.prizeLabel")}
                  </span>
                </div>
                <span className="[font-family:var(--font-montserrat)] text-4xl font-bold leading-[44px] text-white">
                  {prize.amount}
                </span>
                <p className="[font-family:var(--font-montserrat)] text-sm font-bold tracking-[0.1px] text-white">
                  {t(`prize.${prize.noteKey}`)}
                </p>
              </div>
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
