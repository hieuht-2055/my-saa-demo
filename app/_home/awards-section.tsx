import AwardCard from "./award-card";
import { AWARD_CARDS } from "./awards-data";

// mm:2167:9068 — "Hệ thống giải thưởng" header + the 6-card award grid.
// 3 columns desktop, 2 columns tablet/mobile per spec.
export default function AwardsSection() {
  return (
    <section className="mx-auto flex w-full max-w-[1224px] flex-col items-start gap-20 px-6 sm:px-16 lg:px-36">
      {/* mm:2167:9069 */}
      <div className="flex w-full flex-col items-start gap-4">
        {/* mm:2167:9070 */}
        <p className="[font-family:var(--font-montserrat)] text-2xl font-bold leading-8 text-white">
          Sun* annual awards 2025
        </p>
        {/* mm:2167:9071 */}
        <div className="h-px w-full bg-[#2E3940]" />
        {/* mm:2167:9072 */}
        <h2 className="[font-family:var(--font-montserrat)] text-[clamp(32px,5vw,57px)] font-bold leading-tight tracking-[-0.25px] text-[#FFEA9E]">
          Hệ thống giải thưởng
        </h2>
      </div>

      {/* mm:5005:14974 */}
      <div className="grid w-full grid-cols-2 gap-x-6 gap-y-16 sm:gap-x-10 lg:grid-cols-3 lg:gap-x-20">
        {AWARD_CARDS.map((card) => (
          <AwardCard key={card.slug} {...card} />
        ))}
      </div>
    </section>
  );
}
