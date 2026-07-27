"use client";

import { useEffect, useState } from "react";
import CountdownUnit from "@/app/_home/countdown-unit";
import CtaButton from "@/app/_home/cta-button";
import { useT } from "@/lib/i18n/locale-provider";

interface PrelaunchCountdownProps {
  /** Event start time. `null`/invalid falls back to a static 00 00 00. */
  targetDate: Date | null;
  /**
   * Where the CTA sends the user once the countdown reaches zero (nav-lock
   * lifted). Defaults to "/" — Track B may override with the real landing
   * route once the destination is finalized.
   */
  ctaHref?: string;
}

interface Remaining {
  days: number;
  hours: number;
  minutes: number;
  reached: boolean;
}

const ZERO_REMAINING: Remaining = { days: 0, hours: 0, minutes: 0, reached: false };

// Same tick math as app/_home/countdown.tsx's `computeRemaining`, duplicated
// (not imported) rather than shared: this component owns a different
// post-reach behavior (reveal a CTA vs. hiding a label) and lives in its own
// module tree per the two-track file-ownership split.
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

// mm:2268:35136 "Countdown time" — title + DAYS/HOURS/MINUTES tiles. Ticks
// every second on the client only. While `!reached`, the page is a
// navigation dead-end (test cases: spec rows 1-3 "khóa điều hướng"); once
// `reached`, the CTA below unlocks a way into the site.
export default function PrelaunchCountdown({
  targetDate,
  ctaHref = "/",
}: PrelaunchCountdownProps) {
  const t = useT("prelaunch");
  const tc = useT("common");
  const [remaining, setRemaining] = useState<Remaining>(() => computeRemaining(targetDate));

  useEffect(() => {
    const intervalId = setInterval(() => {
      setRemaining(computeRemaining(targetDate));
    }, 1000);
    return () => clearInterval(intervalId);
  }, [targetDate]);

  return (
    <div className="flex w-full flex-col items-center gap-8 px-6 text-center sm:gap-12 lg:gap-[60px]">
      {/* mm:2268:35137 */}
      <p className="[font-family:var(--font-montserrat)] text-2xl font-bold leading-8 text-white sm:text-3xl sm:leading-9 lg:text-4xl lg:leading-[48px]">
        {t("title")}
      </p>

      {/* mm:2268:35138 — `w-full` is required for `flex-wrap` to actually
         wrap on narrow viewports instead of overflowing (a flex item with
         no width constraint sizes to its content, so wrapping never
         triggers without it). */}
      <div className="flex w-full flex-wrap items-center justify-center gap-6 sm:gap-10 lg:gap-[60px]">
        <CountdownUnit value={remaining.days} label={tc("countdown.days")} max={99} size="lg" />
        <CountdownUnit value={remaining.hours} label={tc("countdown.hours")} max={23} size="lg" />
        <CountdownUnit value={remaining.minutes} label={tc("countdown.minutes")} max={59} size="lg" />
      </div>

      {remaining.reached && (
        <CtaButton href={ctaHref} label={t("cta")} variant="primary" />
      )}
    </div>
  );
}
