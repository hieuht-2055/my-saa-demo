"use client";

import type { ReactNode } from "react";
import { IconGift } from "./icons";
import type { ViewerStats } from "./kudos-data";
import { useT } from "@/lib/i18n/locale-provider";

interface StatsPanelProps {
  stats: ViewerStats;
  onOpenSecretBox: () => void;
}

interface StatRowProps {
  label: string;
  value: number;
  suffix?: ReactNode;
}

/** One "label ..... value" row shared by all 5 statistics (component 256:6756). */
function StatRow({ label, value, suffix }: StatRowProps) {
  return (
    <div className="flex w-full items-center justify-between gap-2">
      <span className="flex items-center gap-2 [font-family:var(--font-montserrat)] text-[22px] font-bold leading-7 text-white">
        {label}
        {suffix}
      </span>
      <span className="shrink-0 text-right [font-family:var(--font-montserrat)] text-[32px] font-bold leading-10 text-[#FFEA9E]">
        {value}
      </span>
    </div>
  );
}

/**
 * mm:2940:13489 (D.1) — dark, gold-bordered viewer-statistics box: received /
 * sent / hearts (with the x2 multiplier flame chip on special days), a
 * divider, then Secret Box counts and the "Mở Secret Box" CTA.
 */
export default function StatsPanel({ stats, onOpenSecretBox }: StatsPanelProps) {
  const t = useT("kudos");
  const isBoxEmpty = stats.secretBoxUnopened === 0;

  return (
    <div className="flex w-full max-w-[422px] flex-col items-center gap-4 rounded-[17px] border border-[#998C5F] bg-[#00070C] p-6">
      <StatRow label={t("stats.received")} value={stats.kudosReceived} />
      <StatRow label={t("stats.sent")} value={stats.kudosSent} />
      <StatRow
        label={t("stats.hearts")}
        value={stats.heartsReceived}
        suffix={
          stats.heartMultiplier === 2 ? (
            <span
              title={t("stats.multiplierAlt")}
              className="inline-flex items-center gap-0.5 rounded-full bg-[rgba(255,234,158,0.1)] px-1.5 py-0.5 text-xs font-bold text-[#FFEA9E]"
            >
              🔥x2
            </span>
          ) : null
        }
      />

      <div className="h-px w-full bg-[#2E3940]" />

      <StatRow label={t("stats.boxOpened")} value={stats.secretBoxOpened} />
      <StatRow label={t("stats.boxUnopened")} value={stats.secretBoxUnopened} />

      {/* mm:2940:13497 (D.1.8) */}
      <button
        type="button"
        onClick={onOpenSecretBox}
        disabled={isBoxEmpty}
        className="flex w-full items-center justify-center gap-1 rounded-lg bg-[#FFEA9E] px-4 py-4 [font-family:var(--font-montserrat)] text-[22px] font-bold leading-7 text-[#00101A] transition-colors duration-200 hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {t("stats.openBox")}
        <IconGift width={24} height={24} />
      </button>
    </div>
  );
}
