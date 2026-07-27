import Image from "next/image";
import Link from "next/link";
import { IconArrowUpRight } from "./icons";

// mm:3390:10349 — "Sun* Kudos" promo card: background photo, label/title/
// description, "Chi tiết" CTA, and the Kudos logotype graphic.
export default function KudosSection() {
  return (
    <section className="mx-auto w-full max-w-[1224px] px-6 sm:px-16 lg:px-36">
      <div className="relative flex w-full items-center overflow-hidden rounded-2xl bg-[#0F0F0F] px-6 py-16 sm:px-16 lg:px-[68px] lg:py-20">
        {/* mm:I3390:10349;313:8416 */}
        <Image
          src="/home/kudos-bg.png"
          alt=""
          fill
          sizes="1120px"
          className="rounded-2xl object-cover"
        />

        {/* mm:I3390:10349;313:8419 */}
        <div className="relative z-10 flex w-full max-w-[457px] flex-col items-start gap-8">
          <div className="flex flex-col items-start gap-4">
            {/* mm:I3390:10349;313:8421 */}
            <p className="[font-family:var(--font-montserrat)] text-2xl font-bold leading-8 text-white">
              Phong trào ghi nhận
            </p>
            {/* mm:I3390:10349;313:8422 */}
            <h2 className="[font-family:var(--font-montserrat)] text-[clamp(32px,5vw,57px)] font-bold leading-tight tracking-[-0.25px] text-[#FFEA9E]">
              Sun* Kudos
            </h2>
            {/* mm:I3390:10349;313:8423 */}
            <p className="text-justify [font-family:var(--font-montserrat)] text-base font-bold leading-6 tracking-[0.5px] text-white">
              ĐIỂM MỚI CỦA SAA 2025
              <br />
              Hoạt động ghi nhận và cảm ơn đồng nghiệp - lần đầu tiên được diễn ra dành cho tất cả
              Sunner. Hoạt động sẽ được triển khai vào tháng 11/2025, khuyến khích người Sun* chia
              sẻ những lời ghi nhận, cảm ơn đồng nghiệp trên hệ thống do BTC công bố. Đây sẽ là
              chất liệu để Hội đồng Heads tham khảo trong quá trình lựa chọn người đạt giải.
            </p>
          </div>

          {/* mm:I3390:10349;313:8426 */}
          <Link
            href="/kudos"
            className="flex items-center gap-2 rounded bg-[#FFEA9E] px-4 py-4 [font-family:var(--font-montserrat)] text-base font-bold leading-6 tracking-[0.15px] text-[#00101A] transition-colors duration-200 hover:brightness-105"
          >
            Chi tiết
            <IconArrowUpRight width={24} height={24} />
          </Link>
        </div>

        {/* mm:I3390:10349;329:2948 */}
        <div className="relative z-10 ml-auto hidden h-[72px] w-[364px] lg:block">
          <Image src="/home/kudos-logotype.svg" alt="KUDOS" fill sizes="364px" className="object-contain object-right" />
        </div>
      </div>
    </section>
  );
}
