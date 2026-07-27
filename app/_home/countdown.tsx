"use client";

import { useEffect, useState } from "react";
import CountdownUnit from "./countdown-unit";
import { useT } from "@/lib/i18n/locale-provider";

interface CountdownProps {
  /** Event start time. `null`/invalid falls back to a static 00 00 00. */
  targetDate: Date | null;
}

interface Remaining {
  days: number;
  hours: number;
  minutes: number;
  reached: boolean;
}

const ZERO_REMAINING: Remaining = { days: 0, hours: 0, minutes: 0, reached: false };

function computeRemaining(targetDate: Date | null): Remaining {
  if (!targetDate || Number.isNaN(targetDate.getTime())) {
    return ZERO_REMAINING;
  }

  const diffMs = targetDate.getTime() - Date.now();
  if (diffMs <= 0) {
    return { days: 0, hours: 0, minutes: 0, reached: true };
  }

  const totalMinutes = Math.floor(diffMs / (60 * 1000));
  return {
    days: Math.floor(totalMinutes / (24 * 60)),
    hours: Math.floor((totalMinutes % (24 * 60)) / 60),
    minutes: totalMinutes % 60,
    reached: false,
  };
}

// mm:2167:9035 — "Coming soon" label + DAYS/HOURS/MINUTES countdown. Ticks
// every second on the client only; the target date comes in as a prop so
// this component has no knowledge of where it's configured (Track B env var).
export default function Countdown({ targetDate }: CountdownProps) {
  const t = useT("common");
  const [remaining, setRemaining] = useState<Remaining>(() => computeRemaining(targetDate));

  useEffect(() => {
    // `remaining` is re-derived from `targetDate` on every mount/prop change
    // via the `useState` initializer above; this effect only needs to keep
    // it ticking forward from there, on the timer callback (not synchronously
    // in the effect body).
    const intervalId = setInterval(() => {
      setRemaining(computeRemaining(targetDate));
    }, 1000);
    return () => clearInterval(intervalId);
  }, [targetDate]);

  return (
    <div className="flex flex-col items-start gap-4">
      {/* mm:2167:9036 */}
      {!remaining.reached && (
        <p className="[font-family:var(--font-montserrat)] text-2xl font-bold leading-8 text-white">
          {t("countdown.comingSoon")}
        </p>
      )}
      {/* mm:2167:9037 */}
      <div className="flex items-center gap-10">
        <CountdownUnit value={remaining.days} label={t("countdown.days")} />
        <CountdownUnit value={remaining.hours} label={t("countdown.hours")} />
        <CountdownUnit value={remaining.minutes} label={t("countdown.minutes")} />
      </div>
    </div>
  );
}
