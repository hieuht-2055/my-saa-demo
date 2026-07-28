"use client";

import Image from "next/image";
import type { KeyboardEvent } from "react";
import { IconPen, IconSearch } from "./icons";
import { useT } from "@/lib/i18n/locale-provider";

interface KudosHeroProps {
  onCompose: () => void;
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  onSearchSubmit: () => void;
  searchError: string | null;
}

/**
 * mm:2940:13437 (A) + mm:2940:13448 (Button chuc nang) — the keyvisual banner:
 * background photo, gold title over a dark radial cover, the KUDOS wordmark,
 * then two pills overlapping the bottom edge — a compose button (opens the
 * dialog via `onCompose`) and a real search input (Enter or the icon submits).
 */
export default function KudosHero({
  onCompose,
  searchQuery,
  onSearchQueryChange,
  onSearchSubmit,
  searchError,
}: KudosHeroProps) {
  const t = useT("kudos");

  function handleSearchKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      onSearchSubmit();
    }
  }

  return (
    // mm:2940:13432 (Keyvisual)
    <div className="relative w-full overflow-hidden lg:h-[512px]">
      {/* mm:I2940:13432;2167:5141 */}
      <Image src="/kudos/kv-bg.png" alt="" fill priority sizes="1440px" className="object-cover" />
      {/* mm:I2940:13432;1210:12612 — dark cover fading the photo into the page bg */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(25deg, #00101A 14.74%, rgba(0,19,32,0) 47.8%)" }}
      />

      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-6 py-12 sm:px-16 lg:px-36 lg:pt-[100px]">
        <div className="flex flex-col gap-2.5">
          {/* mm:2940:13439 */}
          <h1 className="[font-family:var(--font-montserrat)] text-3xl font-bold leading-[44px] text-[#FFEA9E] lg:text-[36px]">
            {t("hero.title")}
          </h1>
          {/* mm:2940:13440 */}
          <Image src="/kudos/kudos-logo.svg" alt={t("hero.logoAlt")} width={296} height={52} className="h-auto w-[220px] sm:w-[296px]" />
        </div>

        {/* mm:2940:13448 */}
        <div className="flex flex-col gap-4 sm:flex-row">
          {/* mm:2940:13449 */}
          <button
            type="button"
            onClick={onCompose}
            className="flex flex-1 items-center gap-4 rounded-[68px] border border-[#998C5F] bg-[rgba(255,234,158,0.10)] px-4 py-6 text-left transition-colors duration-200 hover:bg-[rgba(255,234,158,0.18)]"
          >
            <IconPen width={24} height={24} className="shrink-0 text-white" />
            <span className="truncate [font-family:var(--font-montserrat)] text-base font-bold leading-6 tracking-[0.15px] text-white">
              {t("hero.composePlaceholder")}
            </span>
          </button>

          {/* mm:2940:13450 */}
          <div className="flex flex-col gap-1 sm:w-[381px]">
            <div className="flex items-center gap-4 rounded-[68px] border border-[#998C5F] bg-[rgba(255,234,158,0.10)] px-4 py-6">
              <button
                type="button"
                onClick={onSearchSubmit}
                aria-label={t("hero.searchSubmit")}
                className="shrink-0 text-white"
              >
                <IconSearch width={24} height={24} />
              </button>
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => onSearchQueryChange(event.target.value)}
                onKeyDown={handleSearchKeyDown}
                maxLength={100}
                placeholder={t("hero.searchPlaceholder")}
                aria-label={t("hero.searchPlaceholder")}
                className="w-full bg-transparent [font-family:var(--font-montserrat)] text-base font-bold leading-6 tracking-[0.15px] text-white placeholder:text-white/70 focus:outline-none"
              />
            </div>
            {searchError && (
              <p role="alert" className="px-4 text-sm font-bold text-[#D4271D]">
                {searchError}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
