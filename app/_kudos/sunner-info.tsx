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
 * The sender column when the kudos was sent anonymously (Viết Kudo spec G). It
 * mirrors `SunnerInfo`'s geometry so the card's identity row keeps its balance,
 * but carries no avatar, no profile link, no department and no badge — every one
 * of those would give the sender away.
 *
 * The compose frame specifies the choice, not this consequence: no anonymous card
 * state is drawn anywhere in the design. So the placeholder mark is built from
 * the board's own tokens rather than invented artwork.
 */
export function AnonymousSunnerInfo({ name }: { name: string }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center justify-center gap-[13px] sm:max-w-[235px]">
      <span
        aria-hidden
        className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-[#FFEA9E] bg-[rgba(255,234,158,0.4)] [font-family:var(--font-montserrat)] text-2xl font-bold leading-8 text-[#00101A]"
      >
        ?
      </span>
      <div className="flex w-full flex-col items-start gap-0.5">
        <span
          title={name}
          className="w-full text-center [font-family:var(--font-montserrat)] text-base font-bold leading-6 tracking-[0.15px] text-[#00101A]"
        >
          {name}
        </span>
      </div>
    </div>
  );
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
    // 235px is a CEILING here, not a fixed width. The design pins this column
    // at 235 on both cards, but the highlight card's info row is only 480px wide
    // (mm:I2940:13465;335:9442) while two columns plus the 32px send icon and
    // two 24px gaps need 502 — Figma lets the children overlap, flexbox cannot,
    // so a rigid width pushes the receiver out past the card edge. Capping and
    // letting it flex gives the post card its designed 235 (600px row, room to
    // spare) and shrinks the highlight card's columns to a clean 200.
    <div className="flex min-w-0 flex-1 flex-col items-center justify-center gap-[13px] sm:max-w-[235px]">
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
