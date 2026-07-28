"use client";

import Link from "next/link";
import { IconArrowUpRight, IconHeart, IconLink, IconSend } from "./icons";
import SunnerInfo from "./sunner-info";
import { findSunner, type KudosPost } from "./kudos-data";
import { useT } from "@/lib/i18n/locale-provider";

interface HighlightCardProps {
  post: KudosPost;
  active: boolean;
  onToggleLike: (kudosId: string) => void;
  onCopyLink: (kudosId: string) => void;
  onHashtagClick: (hashtag: string) => void;
}

/** Max hashtags rendered on the single-line row (spec B.4.3). */
const MAX_HASHTAGS = 5;

/**
 * mm:2940:13465 (B.3) + mm:I2940:13465;335:9448 (B.4) — one Highlight Kudos
 * card: sender → sent icon → receiver, timestamp, group tag, a clamped
 * message panel, hashtags, then the like/copy-link/view-detail action bar.
 * `active` drives the design's "center slide is prominent, neighbours are
 * dimmed and non-interactive" carousel state (spec B.3 State).
 */
export default function HighlightCard({ post, active, onToggleLike, onCopyLink, onHashtagClick }: HighlightCardProps) {
  const t = useT("kudos");
  const sender = findSunner(post.senderId);
  const receiver = findSunner(post.receiverId);
  const heartDisabled = post.sentByViewer;
  const visibleHashtags = post.hashtags.slice(0, MAX_HASHTAGS);

  return (
    // mm:2940:13465
    // `inert` on the peeking cards, not just `aria-hidden`: all five slides are
    // in the DOM at once, and aria-hidden alone would leave their buttons and
    // links in the tab order — focusable content inside a hidden subtree
    // (WCAG 4.1.2). `inert` removes them from focus and from the a11y tree.
    <div
      inert={!active}
      className={`flex w-[528px] max-w-full shrink-0 flex-col items-start gap-4 rounded-2xl border-4 border-[#FFEA9E] bg-[#FFF8E1] px-6 pb-4 pt-6 transition-all duration-300 ${
        active ? "opacity-100" : "pointer-events-none scale-95 opacity-50"
      }`}
    >
      {/* mm:I2940:13465;335:9442 — the row is only 480px wide, so the send icon
          is centred OVER the gap instead of taking part in the flex flow; that
          leaves both 235px identity columns intact, exactly as the design lays
          them out (sender 576→811, receiver 821→1056, icon overlapping). */}
      <div className="relative flex w-full items-start justify-between gap-2">
        {sender && <SunnerInfo sunner={sender} role="sender" />}
        {/* mm:I2940:13465;335:9444 */}
        <div className="pointer-events-none absolute left-1/2 top-4 -translate-x-1/2">
          <IconSend width={32} height={32} className="text-[#00101A]" />
        </div>
        {receiver && <SunnerInfo sunner={receiver} role="receiver" />}
      </div>

      {/* mm:I2940:13465;335:9447 */}
      <div className="h-px w-full bg-[#FFEA9E]" />

      {/* mm:I2940:13465;335:9448 */}
      <div className="flex w-full flex-col items-end justify-center gap-4">
        {/* mm:I2940:13465;335:9449 */}
        <p className="w-full text-left [font-family:var(--font-montserrat)] text-base font-bold leading-6 tracking-[0.5px] text-[#999999]">
          {post.postedAt}
        </p>
        {/* mm:I2940:13465;1810:19718 */}
        <p className="w-full text-center [font-family:var(--font-montserrat)] text-base font-bold leading-6 tracking-[0.5px] text-[#00101A]">
          {post.groupTag}
        </p>
        {/* mm:I2940:13465;335:9450 */}
        <div className="w-full rounded-xl border border-[#FFEA9E] bg-[rgba(255,234,158,0.40)] px-6 py-4">
          {/* mm:I2940:13465;662:12223 */}
          <p className="line-clamp-3 text-justify [font-family:var(--font-montserrat)] text-xl font-bold leading-8 text-[#00101A]">
            {post.content}
          </p>
        </div>
        {/* mm:I2940:13465;335:9458 */}
        <div className="flex w-full items-center gap-x-2 gap-y-1 overflow-hidden whitespace-nowrap">
          {visibleHashtags.map((hashtag, index) => (
            <button
              key={`${hashtag}-${index}`}
              type="button"
              onClick={() => onHashtagClick(hashtag)}
              aria-label={t("card.hashtagAria")}
              className="shrink-0 [font-family:var(--font-montserrat)] text-base font-bold leading-6 tracking-[0.5px] text-[#D4271D] hover:underline"
            >
              #{hashtag}
            </button>
          ))}
        </div>
      </div>

      {/* mm:I2940:13465;335:9461 — wraps under `sm:` so "Copy Link" +
          "Xem chi tiết" cannot push the card past a narrow viewport. */}
      <div className="flex w-full flex-wrap items-center justify-between gap-x-6 gap-y-2">
        {/* mm:I2940:13465;335:9462 */}
        <div className="flex items-center gap-1">
          <span className="[font-family:var(--font-montserrat)] text-2xl font-bold leading-8 text-[#00101A]">
            {post.likeCount.toLocaleString("vi-VN")}
          </span>
          <button
            type="button"
            onClick={() => onToggleLike(post.id)}
            disabled={heartDisabled}
            title={heartDisabled ? t("card.likeOwnDisabled") : undefined}
            aria-label={post.likedByViewer ? t("card.unlike") : t("card.like")}
            className="disabled:cursor-not-allowed disabled:opacity-60"
          >
            <IconHeart width={32} height={32} className={post.likedByViewer ? "text-[#D4271D]" : "text-[#999999]"} />
          </button>
        </div>

        {/* mm:I2940:13465;335:9672 */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onCopyLink(post.id)}
            className="flex items-center gap-1 rounded px-4 py-4 [font-family:var(--font-montserrat)] text-base font-bold leading-6 tracking-[0.15px] text-[#00101A] hover:underline"
          >
            {t("card.copyLink")}
            <IconLink width={24} height={24} />
          </button>
          <Link
            href={`/kudos/${post.id}`}
            className="flex items-center gap-1 rounded px-4 py-4 [font-family:var(--font-montserrat)] text-base font-bold leading-6 tracking-[0.15px] text-[#00101A] hover:underline"
          >
            {t("card.viewDetail")}
            <IconArrowUpRight width={24} height={24} />
          </Link>
        </div>
      </div>
    </div>
  );
}
