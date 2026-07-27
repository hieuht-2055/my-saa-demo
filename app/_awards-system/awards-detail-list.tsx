import AwardDetailCard from "./award-detail-card";
import AwardsNav from "./awards-nav";
import { AWARD_DETAILS } from "./awards-system-data";

// mm:313:8458 (mms_B_Hệ thống giải thưởng) — sidebar nav + the 6 award
// sections. Stacks on mobile/tablet, sits side by side from `lg` up.
export default function AwardsDetailList() {
  return (
    <div className="mx-auto flex w-full max-w-[1440px] flex-col items-start gap-10 px-6 sm:px-16 lg:flex-row lg:gap-20 lg:px-36">
      <AwardsNav />
      <div className="flex w-full flex-1 flex-col gap-20">
        {AWARD_DETAILS.map((award) => (
          <AwardDetailCard key={award.slug} {...award} />
        ))}
      </div>
    </div>
  );
}
