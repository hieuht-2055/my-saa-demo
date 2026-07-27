import Image from "next/image";
import Link from "next/link";
import { IconArrowUpRight } from "./icons";
import type { AwardCardData } from "./awards-data";

// mm:2167:9075 (repeated for each of the 6 cards) — square photo (shared
// asset across all cards, per the design) + wordmark overlay, title,
// 2-line-clamped description, and a "Chi tiết" link.
export default function AwardCard({ slug, title, description, nameImage }: AwardCardData) {
  return (
    <Link
      href={`/awards#${slug}`}
      className="group flex w-full max-w-[336px] flex-col items-start gap-6 transition-transform duration-200 ease-out hover:-translate-y-1"
    >
      {/* mm:I2167:9075;214:1019 */}
      <div
        className="relative aspect-square w-full overflow-hidden rounded-[24px] transition-shadow duration-200 ease-out"
        style={{ boxShadow: "0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287" }}
      >
        {/* mm:I2167:9075;214:1019;81:2442 */}
        <Image
          src="/home/award-bg.png"
          alt=""
          fill
          sizes="336px"
          className="rounded-[24px] border-[0.955px] border-[#FFEA9E] object-cover"
        />
        {/* mm:I2167:9075;214:1019;214:666 */}
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <Image src={nameImage} alt={title} width={221} height={35} className="max-w-[80%] object-contain" />
        </div>
      </div>

      <div className="flex w-full flex-col items-start gap-1">
        {/* mm:I2167:9075;214:1021 */}
        <h3 className="[font-family:var(--font-montserrat)] text-2xl font-normal leading-8 text-[#FFEA9E]">
          {title}
        </h3>
        {/* mm:I2167:9075;214:1022 */}
        <p className="line-clamp-2 [font-family:var(--font-montserrat)] text-base font-normal leading-6 tracking-[0.5px] text-white">
          {description}
        </p>
        {/* mm:I2167:9075;214:1023 */}
        <span className="flex items-center gap-1 py-4 [font-family:var(--font-montserrat)] text-base font-medium leading-6 tracking-[0.15px] text-white transition-colors group-hover:text-[#FFEA9E]">
          Chi tiết
          <IconArrowUpRight width={24} height={24} />
        </span>
      </div>
    </Link>
  );
}
