"use client";

import { useState } from "react";
import SpotlightSearch from "./spotlight-search";
import SpotlightCanvas from "./spotlight-canvas";
import SpotlightTicker from "./spotlight-ticker";
import { IconPanZoom } from "./icons";
import type { SpotlightNode } from "./kudos-data";
import { useT } from "@/lib/i18n/locale-provider";

interface TickerEntry {
  id: string;
  time: string;
  name: string;
}

interface SpotlightBoardProps {
  totalKudos: number;
  nodes: SpotlightNode[];
  ticker: TickerEntry[];
  query: string;
  onQueryChange: (value: string) => void;
  error: string | null;
}

/**
 * mm:2940:14174 (B.7) + mm:3007:17482 (B.7.1) + mm:3007:17479 (B.7.2) +
 * mm:2940:14833 (B.7.3) — the Spotlight canvas: dark gold-bordered panel with
 * a centred "{total} KUDOS" headline, a top-left Sunner search pill, a
 * bottom-left activity ticker, and a bottom-right pan/zoom toggle.
 */
export default function SpotlightBoard({
  totalKudos,
  nodes,
  ticker,
  query,
  onQueryChange,
  error,
}: SpotlightBoardProps) {
  const t = useT("kudos");
  const [panZoomEnabled, setPanZoomEnabled] = useState(false);

  return (
    <div className="relative h-[400px] w-full overflow-hidden rounded-[48px] border border-[#998C5F] bg-[#00101A] lg:h-[548px]">
      {/* `key` forces a remount on toggle, so turning pan/zoom off resets the
          canvas's internal transform to identity without an effect. */}
      <SpotlightCanvas
        key={panZoomEnabled ? "pan-zoom-on" : "pan-zoom-off"}
        nodes={nodes}
        query={query}
        panZoomEnabled={panZoomEnabled}
      />

      {/* Chrome layer — explicitly above the cloud so the pill, headline and
          ticker stay legible over the names scattered behind them. */}
      <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-6">
        <div className="pointer-events-auto flex items-start">
          <SpotlightSearch query={query} onQueryChange={onQueryChange} error={error} />
        </div>

        {/* mm:3007:17482 (B.7.1) */}
        <p className="pointer-events-none absolute left-1/2 top-4 -translate-x-1/2 whitespace-nowrap text-center [font-family:var(--font-montserrat)] text-2xl font-bold leading-[44px] tracking-[-0.25px] text-white [text-shadow:0_2px_10px_#00101A,0_0_20px_#00101A] sm:text-4xl">
          {totalKudos} {t("spotlight.kudosSuffix")}
        </p>

        {/* Scrim under the ticker — the design darkens this corner with the
            keyvisual artwork; a gradient does the same job for legibility. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-40"
          style={{ background: "linear-gradient(0deg, #00101A 20%, rgba(0,16,26,0) 100%)" }}
        />

        <div className="pointer-events-auto relative flex items-end justify-between gap-4">
          <SpotlightTicker ticker={ticker} />

          {/* mm:3007:17479 (B.7.2) */}
          <button
            type="button"
            onClick={() => setPanZoomEnabled((v) => !v)}
            title={t("spotlight.panZoom")}
            aria-pressed={panZoomEnabled}
            aria-label={t("spotlight.panZoom")}
            className={`shrink-0 rounded-full p-1.5 text-white transition-colors duration-200 hover:bg-white/10 ${
              panZoomEnabled ? "bg-white/20" : ""
            }`}
          >
            <IconPanZoom width={24} height={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
