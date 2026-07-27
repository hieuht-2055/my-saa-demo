import { digitFont, montserrat } from "@/app/_home/fonts";
import { LocaleProvider } from "@/lib/i18n/locale-provider";
import type { Locale } from "@/lib/i18n/config";
import PrelaunchBackground from "./prelaunch-background";
import PrelaunchCountdown from "./prelaunch-countdown";

interface PrelaunchScreenProps {
  /** ISO datetime string for the event; Track B supplies it (lib/event-config.ts). */
  eventTargetIso: string;
  /** CTA destination once the countdown reaches zero. Defaults to "/". */
  ctaHref?: string;
  /** Active locale, resolved from the cookie by the route (SSR). */
  initialLocale?: Locale;
}

// mm:2268:35127 "Countdown - Prelaunch page" — full-viewport prelaunch /
// coming-soon screen: background art + centered countdown. Presentational
// only; Track B owns the route file and the target-date source.
export default function PrelaunchScreen({
  eventTargetIso,
  ctaHref,
  initialLocale,
}: PrelaunchScreenProps) {
  const parsed = new Date(eventTargetIso);
  const targetDate = Number.isNaN(parsed.getTime()) ? null : parsed;

  return (
    <LocaleProvider initialLocale={initialLocale}>
      <div
        className={`${montserrat.variable} ${digitFont.variable} relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#00101A]`}
      >
        <PrelaunchBackground />
        <div className="relative z-10 flex w-full items-center justify-center">
          <PrelaunchCountdown targetDate={targetDate} ctaHref={ctaHref} />
        </div>
      </div>
    </LocaleProvider>
  );
}
