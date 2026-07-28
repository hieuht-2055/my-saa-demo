"use client";

import { IconArrowLeft, IconArrowRight } from "./icons";
import HighlightCard from "./highlight-card";
import type { KudosPost } from "./kudos-data";
import { useT } from "@/lib/i18n/locale-provider";

interface HighlightCarouselProps {
  posts: KudosPost[];
  index: number;
  onIndexChange: (index: number) => void;
  onToggleLike: (kudosId: string) => void;
  onCopyLink: (kudosId: string) => void;
  onHashtagClick: (hashtag: string) => void;
}

/** Design pixel constants (mm:2940:13463) — card 528px + 24px gap between slides. */
const CARD_WIDTH = 528;
const SLIDE_STEP = CARD_WIDTH + 24;

/**
 * mm:2940:13461 (B.2) + mm:2940:13471 (B.5) — the Highlight Kudos carousel.
 * Desktop shows the active card centered with its neighbours peeking in
 * (faded out by gradient overlays that also host the big round nav arrows);
 * mobile shows only the active card. A smaller prev/`n`/`total`/next pager
 * sits below both. Arrows disable at either end (spec B.2.1/B.2.2/B.5.1/B.5.3).
 */
export default function HighlightCarousel({
  posts,
  index,
  onIndexChange,
  onToggleLike,
  onCopyLink,
  onHashtagClick,
}: HighlightCarouselProps) {
  const t = useT("kudos");
  const total = posts.length;
  const atStart = index <= 0;
  const atEnd = index >= total - 1;

  function goPrev() {
    if (!atStart) onIndexChange(index - 1);
  }
  function goNext() {
    if (!atEnd) onIndexChange(index + 1);
  }

  if (total === 0) {
    return (
      <p className="w-full py-16 text-center [font-family:var(--font-montserrat)] text-base font-bold text-white">
        {t("feed.empty")}
      </p>
    );
  }

  const cardProps = { onToggleLike, onCopyLink, onHashtagClick };

  return (
    <div className="flex w-full flex-col gap-8">
      {/* mm:2940:13461 — mobile: single centered card, no peeking. This branch
          carries its own gutter because the carousel section is full-bleed. */}
      <div className="flex justify-center px-6 lg:hidden">
        <HighlightCard post={posts[index]} active {...cardProps} />
      </div>

      {/* mm:2940:13463 — desktop: peeking carousel.
          The track is anchored at the viewport's centre (`left-1/2`) and then
          shifted by whole pixels. A percentage inside `translateX` would resolve
          against the TRACK's own width (all five cards, 2736px) rather than the
          viewport, which pushes every card off-canvas — hence the px-only X. */}
      <div className="relative hidden h-[560px] w-full overflow-hidden lg:block">
        <div
          className="absolute left-1/2 top-1/2 flex items-center gap-6 transition-transform duration-300 ease-out"
          style={{
            transform: `translate(-${CARD_WIDTH / 2 + index * SLIDE_STEP}px, -50%)`,
          }}
        >
          {posts.map((post, slideIndex) => (
            <HighlightCard key={post.id} post={post} active={slideIndex === index} {...cardProps} />
          ))}
        </div>

        {/* mm:2940:13469 / 2940:13470 */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 flex w-[400px] items-center pl-20"
          style={{ background: "linear-gradient(90deg, #00101A 50%, rgba(255,255,255,0) 100%)" }}
        >
          <button
            type="button"
            onClick={goPrev}
            disabled={atStart}
            aria-label={t("carousel.prev")}
            className="pointer-events-auto flex h-20 w-20 items-center justify-center rounded text-white transition-opacity duration-200 hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <IconArrowLeft width={60} height={60} />
          </button>
        </div>
        {/* mm:2940:13467 / 2940:13468 */}
        <div
          className="pointer-events-none absolute inset-y-0 right-0 flex w-[400px] items-center justify-end pr-10"
          style={{ background: "linear-gradient(270deg, #00101A 50%, rgba(255,255,255,0) 100%)" }}
        >
          <button
            type="button"
            onClick={goNext}
            disabled={atEnd}
            aria-label={t("carousel.next")}
            className="pointer-events-auto flex h-20 w-20 items-center justify-center rounded text-white transition-opacity duration-200 hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <IconArrowRight width={60} height={60} />
          </button>
        </div>
      </div>

      {/* mm:2940:13471 (B.5) — small pager */}
      <div className="flex items-center justify-center gap-8">
        <button
          type="button"
          onClick={goPrev}
          disabled={atStart}
          aria-label={t("carousel.prev")}
          className="flex h-12 w-12 items-center justify-center rounded text-white transition-opacity duration-200 hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-30"
        >
          <IconArrowLeft width={28} height={28} />
        </button>
        {/* mm:2940:13473 */}
        <p aria-label={t("carousel.pageAria")} className="[font-family:var(--font-montserrat)]">
          <span className="text-[28px] font-bold leading-9 text-[#FFEA9E]">{index + 1}</span>
          <span className="text-xl font-bold leading-9 text-[#999999]">/{total}</span>
        </p>
        <button
          type="button"
          onClick={goNext}
          disabled={atEnd}
          aria-label={t("carousel.next")}
          className="flex h-12 w-12 items-center justify-center rounded text-white transition-opacity duration-200 hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-30"
        >
          <IconArrowRight width={28} height={28} />
        </button>
      </div>
    </div>
  );
}
