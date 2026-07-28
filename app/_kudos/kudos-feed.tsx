"use client";

import { useEffect, useRef } from "react";
import KudosPostCard from "./kudos-post-card";
import type { KudosPost } from "./kudos-data";
import { useT } from "@/lib/i18n/locale-provider";

interface KudosFeedProps {
  posts: KudosPost[];
  hasMore: boolean;
  onLoadMore: () => void;
  onToggleLike: (kudosId: string) => void;
  onCopyLink: (kudosId: string) => void;
  onHashtagClick: (hashtag: string) => void;
}

/**
 * mm:2940:13482 (C.2) — the ALL KUDOS feed column. Infinite-scroll: an
 * IntersectionObserver watches a bottom sentinel and calls `onLoadMore` once
 * it enters the viewport while `hasMore` is true.
 */
export default function KudosFeed({
  posts,
  hasMore,
  onLoadMore,
  onToggleLike,
  onCopyLink,
  onHashtagClick,
}: KudosFeedProps) {
  const t = useT("kudos");
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hasMore) return;
    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) onLoadMore();
      },
      { rootMargin: "200px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, onLoadMore]);

  if (posts.length === 0) {
    return (
      <p className="w-full py-16 text-center [font-family:var(--font-montserrat)] text-base font-bold text-white/70">
        {t("feed.empty")}
      </p>
    );
  }

  return (
    <div className="flex w-full flex-col items-center gap-6">
      {posts.map((post) => (
        <KudosPostCard
          key={post.id}
          post={post}
          onToggleLike={onToggleLike}
          onCopyLink={onCopyLink}
          onHashtagClick={onHashtagClick}
        />
      ))}

      <div ref={sentinelRef} aria-hidden className="h-1 w-full" />

      <p className="[font-family:var(--font-montserrat)] text-sm font-bold text-white/60">
        {hasMore ? t("feed.loadingMore") : t("feed.end")}
      </p>
    </div>
  );
}
