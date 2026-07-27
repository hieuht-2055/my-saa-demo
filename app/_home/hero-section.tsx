import Image from "next/image";
import Countdown from "./countdown";
import CtaButton from "./cta-button";
import EventInfo from "./event-info";

interface HeroSectionProps {
  eventTargetDate: Date | null;
}

// mm:2167:9027 (keyvisual) + mm:2167:9029 (gradient cover) + mm:2167:9030
// (content) — full-bleed key-visual with the countdown, event info, and CTAs.
export default function HeroSection({ eventTargetDate }: HeroSectionProps) {
  return (
    <section
      className="relative w-full overflow-hidden bg-cover bg-top"
      style={{ backgroundImage: "url('/home/keyvisual-bg.png')" }}
    >
      {/* mm:2167:9029 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(12deg, #00101A 23.7%, rgba(0,18,29,0.46) 38.34%, rgba(0,19,32,0) 48.92%)",
        }}
      />

      <div className="relative z-10 mx-auto flex w-full max-w-[1224px] flex-col gap-10 px-6 pt-24 pb-20 sm:px-16 lg:px-36">
        {/* mm:2788:12911 */}
        <div className="relative aspect-[451/200] w-full max-w-[451px]">
          <Image
            src="/home/root-further-logo.png"
            alt="ROOT FURTHER"
            fill
            priority
            sizes="(max-width: 1024px) 80vw, 451px"
            className="object-contain object-left"
          />
        </div>

        {/* mm:2167:9034 */}
        <div className="flex flex-col items-start gap-4">
          <Countdown targetDate={eventTargetDate} />
          <EventInfo />
        </div>

        {/* mm:2167:9062 */}
        <div className="flex flex-wrap items-start gap-10">
          <CtaButton href="/awards" label="ABOUT AWARDS" variant="primary" />
          <CtaButton href="/kudos" label="ABOUT KUDOS" variant="secondary" />
        </div>
      </div>
    </section>
  );
}
