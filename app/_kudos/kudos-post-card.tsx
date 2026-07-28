"use client";

import SunnerInfo from "./sunner-info";
import KudosGallery from "./kudos-gallery";
import { IconSend, IconPen, IconHeart, IconLink } from "./icons";
import { findSunner, type KudosPost } from "./kudos-data";
import { useT } from "@/lib/i18n/locale-provider";

interface KudosPostCardProps {
  post: KudosPost;
  onToggleLike: (kudosId: string) => void;
  onCopyLink: (kudosId: string) => void;
  onHashtagClick: (hashtag: string) => void;
}

/**
 * mm:3127:21871 (C.3) + mm:I3127:21871;256:5194 (C.4) — one kudos post card:
 * sender → receiver identity row (via `SunnerInfo`), timestamp, centred
 * group-tag strip with a decorative pencil, the message (clamped to 5 lines),
 * gallery, hashtags, then the like / copy-link action bar. Unlike the
 * Highlight carousel card, the feed card has no "Xem chi tiết" button.
 */
export default function KudosPostCard({
  post,
  onToggleLike,
  onCopyLink,
  onHashtagClick,
}: KudosPostCardProps) {
  const t = useT("kudos");
  const sender = findSunner(post.senderId);
  const receiver = findSunner(post.receiverId);
  if (!sender || !receiver) return null;

  const likeLabel = post.likedByViewer ? t("card.unlike") : t("card.like");

  return (
    <article className="flex w-full max-w-[680px] flex-col items-start gap-4 rounded-3xl bg-[#FFF8E1] px-6 pb-4 pt-6 sm:px-10 sm:pt-10">
      {/* mm:I3127:21871;256:4857 */}
      <div className="flex w-full flex-col items-center justify-between gap-4 sm:flex-row">
        <SunnerInfo sunner={sender} role="sender" />
        {/* mm:I3127:21871;256:5147 */}
        <span role="img" aria-label={t("card.sentAria")} className="shrink-0 text-[#00101A]">
          <IconSend width={32} height={32} />
        </span>
        <SunnerInfo sunner={receiver} role="receiver" />
      </div>

      <div className="h-px w-full bg-[#FFEA9E]" />

      <div className="flex w-full flex-col items-start gap-4">
        {/* mm:I3127:21871;256:5229 */}
        <p className="[font-family:var(--font-montserrat)] text-base font-bold leading-6 tracking-[0.5px] text-[#999999]">
          {post.postedAt}
        </p>

        {/* mm:I3127:21871;2234:33038 — centred group tag + decorative pencil */}
        <div className="relative flex h-8 w-full items-center justify-center">
          <span className="text-center [font-family:var(--font-montserrat)] text-base font-bold leading-6 tracking-[0.5px] text-[#00101A]">
            {post.groupTag}
          </span>
          <IconPen
            aria-hidden
            width={32}
            height={32}
            className="absolute right-0 text-[#00101A]"
          />
        </div>

        {/* mm:...;662:11382 -> C.3.5_Content */}
        <div className="w-full rounded-xl border border-[#FFEA9E] bg-[rgba(255,234,158,0.4)] px-6 py-4">
          <p className="line-clamp-5 text-justify [font-family:var(--font-montserrat)] text-xl font-bold leading-8 text-[#00101A]">
            {post.content}
          </p>
        </div>

        <KudosGallery images={post.images} />

        {/* mm:...;256:5158 — wraps to at most 2 lines, then truncates */}
        <div className="flex max-h-12 w-full flex-wrap gap-x-2 overflow-hidden">
          {post.hashtags.map((tag, i) => (
            <button
              key={`${tag}-${i}`}
              type="button"
              onClick={() => onHashtagClick(tag)}
              aria-label={t("card.hashtagAria")}
              className="[font-family:var(--font-montserrat)] text-base font-bold leading-6 tracking-[0.5px] text-[#D4271D] hover:underline"
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      <div className="h-px w-full bg-[#FFEA9E]" />

      {/* mm:I3127:21871;256:5194 */}
      <div className="flex w-full items-center justify-between gap-6">
        <button
          type="button"
          onClick={() => onToggleLike(post.id)}
          disabled={post.sentByViewer}
          title={post.sentByViewer ? t("card.likeOwnDisabled") : undefined}
          aria-label={likeLabel}
          aria-pressed={post.likedByViewer}
          className="flex items-center gap-1 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="[font-family:var(--font-montserrat)] text-2xl font-bold leading-8 text-[#00101A]">
            {post.likeCount.toLocaleString("vi-VN")}
          </span>
          <IconHeart
            width={32}
            height={32}
            className={`transition-colors duration-200 ${post.likedByViewer ? "text-[#D4271D]" : "text-[#999999]"}`}
          />
        </button>

        <button
          type="button"
          onClick={() => onCopyLink(post.id)}
          className="flex items-center gap-1 rounded p-4 [font-family:var(--font-montserrat)] text-base font-bold leading-6 tracking-[0.15px] text-[#00101A] transition-colors duration-200 hover:bg-[rgba(255,234,158,0.4)]"
        >
          {t("card.copyLink")}
          <IconLink width={24} height={24} />
        </button>
      </div>
    </article>
  );
}
