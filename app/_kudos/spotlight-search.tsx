"use client";

import { IconSearch } from "./icons";
import { useT } from "@/lib/i18n/locale-provider";

interface SpotlightSearchProps {
  query: string;
  onQueryChange: (value: string) => void;
  error: string | null;
}

/** mm:2940:14833 (B.7.3) — the Spotlight canvas's Sunner search pill. */
export default function SpotlightSearch({ query, onQueryChange, error }: SpotlightSearchProps) {
  const t = useT("kudos");

  return (
    <div className="flex flex-col gap-1">
      {/* Opaque fill, not a tint: the pill sits on top of the name cloud and the
          design samples a solid #1E221E here, so names must not read through it. */}
      <label className="flex items-center gap-1.5 rounded-full border border-[#998C5F] bg-[#1E221E] px-3 py-2">
        <IconSearch width={16} height={16} className="shrink-0 text-white" />
        <input
          type="text"
          value={query}
          maxLength={100}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder={t("spotlight.searchPlaceholder")}
          aria-label={t("spotlight.searchPlaceholder")}
          aria-invalid={Boolean(error)}
          className="w-24 bg-transparent [font-family:var(--font-montserrat)] text-xs font-medium tracking-[0.1px] text-white placeholder:text-white/70 focus:outline-none sm:w-32"
        />
      </label>
      {error && (
        <p role="alert" className="[font-family:var(--font-montserrat)] text-xs font-bold text-[#D4271D]">
          {error}
        </p>
      )}
    </div>
  );
}
