"use client";

import { useT } from "@/lib/i18n/locale-provider";

interface TickerEntry {
  id: string;
  time: string;
  name: string;
}

interface SpotlightTickerProps {
  ticker: TickerEntry[];
}

/**
 * Bottom-left activity feed inside the Spotlight canvas (spec B.7). Entries
 * are shown newest-first; the older ones fade toward transparent.
 */
export default function SpotlightTicker({ ticker }: SpotlightTickerProps) {
  const t = useT("kudos");
  const entries = ticker.slice(0, 5);

  return (
    <ul className="flex flex-col gap-1">
      {entries.map((entry, i) => (
        <li
          key={entry.id}
          style={{ opacity: Math.max(1 - i * 0.18, 0.15) }}
          className="[font-family:var(--font-montserrat)] text-xs font-medium text-white"
        >
          <span className="font-bold text-[#FFEA9E]">{entry.time}</span> {entry.name}{" "}
          {t("spotlight.tickerSuffix")}
        </li>
      ))}
    </ul>
  );
}
