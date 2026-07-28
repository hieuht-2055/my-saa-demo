"use client";

import Image from "next/image";
import Link from "next/link";
import type { HeroBadge, Sunner } from "./kudos-data";
import { useT } from "@/lib/i18n/locale-provider";

/** Rank-badge artwork, keyed by tier (mm:...;3106:17694). */
const BADGE_SRC: Record<HeroBadge, string> = {
  "new-hero": "/kudos/badge-new-hero.png",
  "rising-hero": "/kudos/badge-rising-hero.png",
  "super-hero": "/kudos/badge-super-hero.png",
  "legend-hero": "/kudos/badge-legend-hero.png",
};

interface SunnerInfoProps {
  sunner: Sunner;
  /** Cards render this block twice — the label distinguishes the two for AT. */
  role: "sender" | "receiver";
}

/**
 * mm:I3127:21871;256:4858 (C.3.1) / mm:I2940:13465;335:9443 (B.3.1–B.3.2) —
 * the sender/receiver identity block shared by the Highlight card and the feed
 * post card: avatar over name, then "department · rank badge".
 *
 * Column is 235×123 with a 13px gap; the name is Montserrat 700 16/24 (+0.15
 * tracking) in #00101A and the department 700 14/20 (+0.1) in #999999 — all
 * read off the design nodes, not eyeballed.
 *
 * `/sunner/{id}` is the profile screen; it is designed on its own MoMorph frame
 * and not part of this board's scope, so the link is forward-declared here the
 * same way the header linked `/kudos` before this screen existed.
 */
export default function SunnerInfo({ sunner, role }: SunnerInfoProps) {
  const t = useT("kudos");
  const profileHref = `/sunner/${sunner.id}`;

  return (
    // The design fixes this column at 235px, but a card renders TWO of them
    // side by side — held rigid they overflow any viewport under ~530px, so the
    // width only locks in from `sm:` up and the column flexes below that.
    <div className="flex min-w-0 flex-1 flex-col items-center justify-center gap-[13px] sm:w-[235px] sm:flex-none">
      {/* mm:...;256:4734 — avatar comes from the Google account photo */}
      <Link href={profileHref} aria-label={t(`card.${role}ProfileAria`)} className="shrink-0">
        <Image
          src={sunner.avatar}
          alt=""
          width={64}
          height={64}
          className="h-16 w-16 rounded-full object-cover transition-transform duration-200 hover:scale-105"
        />
      </Link>

      {/* mm:...;256:4737 */}
      <div className="flex w-full flex-col items-start gap-0.5">
        {/* mm:...;256:4735 */}
        <Link
          href={profileHref}
          title={sunner.name}
          className="w-full text-center [font-family:var(--font-montserrat)] text-base font-bold leading-6 tracking-[0.15px] text-[#00101A] hover:underline"
        >
          {sunner.name}
        </Link>

        {/* mm:...;256:4741 — "Huy hiệu + Sao" */}
        <div className="flex w-full flex-row flex-wrap items-center justify-center gap-2.5">
          {/* mm:...;256:4751 */}
          <span className="[font-family:var(--font-montserrat)] text-sm font-bold leading-5 tracking-[0.1px] text-[#999999]">
            {sunner.department}
          </span>
          {/* mm:...;256:4754 */}
          <span aria-hidden className="h-1 w-1 rounded-full bg-[#999999] opacity-40" />
          {/* mm:...;3106:17694 — hovering explains how the tier was earned */}
          <Image
            src={BADGE_SRC[sunner.badge]}
            alt={t(`badge.${sunner.badge}`)}
            title={t(`starTier.${sunner.stars}`)}
            width={110}
            height={20}
            className="h-5 w-auto"
          />
        </div>
      </div>
    </div>
  );
}
