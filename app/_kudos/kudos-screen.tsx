"use client";

import { useState } from "react";
import { signOut } from "@/app/auth/actions";
import { LocaleProvider, useT } from "@/lib/i18n/locale-provider";
import type { Locale } from "@/lib/i18n/config";
import { montserrat, montserratAlternates } from "@/app/_home/fonts";
import SiteFooter from "../_home/site-footer";
import SiteHeader from "../_home/site-header";
import WidgetButton from "../_home/widget-button";
import ComposeDialog from "./compose-dialog";
import FilterDropdown from "./filter-dropdown";
import HighlightCarousel from "./highlight-carousel";
import KudosFeed from "./kudos-feed";
import KudosHero from "./kudos-hero";
import KudosToast from "./kudos-toast";
import PrizeRecipients from "./prize-recipients";
import SecretBoxDialog from "./secret-box-dialog";
import SectionHeading from "./section-heading";
import SpotlightBoard from "./spotlight-board";
import StatsPanel from "./stats-panel";
import {
  DEPARTMENTS,
  HASHTAG_OPTIONS,
  PRIZE_RECIPIENTS,
  SPOTLIGHT_TICKER,
  TOTAL_KUDOS,
  VIEWER_STATS,
} from "./kudos-data";
import { useKudosBoard } from "./use-kudos-board";

interface KudosScreenProps {
  isAuthenticated: boolean;
  isAdmin: boolean;
  userEmail: string | null;
  /** Active locale, resolved from the cookie by the route (SSR). */
  initialLocale?: Locale;
}

/**
 * Shared horizontal rhythm. Measured off the design render: the content column
 * runs 144→1296 inside the 1440 frame, i.e. 1152px wide with a 144px gutter —
 * which is also exactly `post card 680 + 48 gap + sidebar 424`.
 */
const SHELL = "mx-auto w-full max-w-[1440px] px-6 sm:px-16 lg:px-36";

/**
 * mm:2940:13431 — "Sun* Kudos - Live board". Composition only: `useKudosBoard`
 * owns every behaviour (filters, hearts, clipboard, paging, dialogs) and the
 * section components below stay purely presentational.
 */
function KudosBoard() {
  const t = useT("kudos");
  const board = useKudosBoard();

  return (
    <>
      <KudosHero
        onCompose={board.dialogs.openCompose}
        searchQuery={board.search.query}
        onSearchQueryChange={board.search.onQueryChange}
        onSearchSubmit={board.search.onSubmit}
        searchError={board.search.error ? t(board.search.error) : null}
      />

      {/* mm:2940:13451 (B) — HIGHLIGHT KUDOS. Only the heading sits inside the
          content column: the design draws the carousel full-bleed so the side
          fades and the big arrows reach the frame edges. */}
      <section className="flex w-full flex-col gap-10">
        <div className={SHELL}>
          <SectionHeading
            subtitle={t("section.subtitle")}
            title={t("section.highlight")}
            action={
              <div className="flex items-center gap-4">
                <FilterDropdown
                  label={t("filter.hashtag")}
                  options={HASHTAG_OPTIONS}
                  value={board.filters.hashtag}
                  onChange={board.filters.onHashtagChange}
                />
                <FilterDropdown
                  label={t("filter.department")}
                  options={DEPARTMENTS}
                  value={board.filters.department}
                  onChange={board.filters.onDepartmentChange}
                />
              </div>
            }
          />
        </div>
        <HighlightCarousel
          posts={board.highlight.posts}
          index={board.highlight.index}
          onIndexChange={board.highlight.onIndexChange}
          onToggleLike={board.actions.onToggleLike}
          onCopyLink={board.actions.onCopyLink}
          onHashtagClick={board.actions.onHashtagClick}
        />
      </section>

      {/* mm:2940:14174 (B.7) — SPOTLIGHT BOARD. The id is the scroll target for
          a submitted Sunner search from the hero field. */}
      <section id="spotlight-board" className={`${SHELL} flex flex-col gap-10`}>
        <SectionHeading subtitle={t("section.subtitle")} title={t("section.spotlight")} />
        <SpotlightBoard
          totalKudos={TOTAL_KUDOS}
          nodes={board.spotlight.nodes}
          ticker={SPOTLIGHT_TICKER}
          query={board.spotlight.query}
          onQueryChange={board.spotlight.onQueryChange}
          error={null}
        />
      </section>

      {/* mm:2940:13475 (C) + 2940:13488 (D) — ALL KUDOS feed beside the sidebar */}
      <section className={`${SHELL} flex flex-col gap-10`}>
        <SectionHeading subtitle={t("section.subtitle")} title={t("section.all")} />
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-12">
          <div className="min-w-0 flex-1">
            <KudosFeed
              posts={board.feed.posts}
              hasMore={board.feed.hasMore}
              onLoadMore={board.feed.onLoadMore}
              onToggleLike={board.actions.onToggleLike}
              onCopyLink={board.actions.onCopyLink}
              onHashtagClick={board.actions.onHashtagClick}
            />
          </div>
          <aside className="flex w-full shrink-0 flex-col gap-6 lg:sticky lg:top-24 lg:w-[424px]">
            <StatsPanel stats={VIEWER_STATS} onOpenSecretBox={board.dialogs.openSecretBox} />
            <PrizeRecipients recipients={PRIZE_RECIPIENTS} />
          </aside>
        </div>
      </section>

      <ComposeDialog
        open={board.dialogs.isComposeOpen}
        onClose={board.dialogs.closeCompose}
        onSubmit={board.dialogs.onComposeSubmit}
      />
      <SecretBoxDialog
        open={board.dialogs.isSecretBoxOpen}
        unopened={VIEWER_STATS.secretBoxUnopened}
        onClose={board.dialogs.closeSecretBox}
      />
      <KudosToast messageKey={board.toast.messageKey} onDismiss={board.toast.dismiss} />
    </>
  );
}

/**
 * Route-level shell: fonts, page chrome and the locale context. The board
 * itself lives in `KudosBoard` so it can call `useT` inside the provider.
 */
export default function KudosScreen({
  isAuthenticated,
  isAdmin,
  userEmail,
  initialLocale,
}: KudosScreenProps) {
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true);

  function onNotificationClick() {
    // INTEGRATION POINT: open the real notification list once it exists.
    setHasUnreadNotifications(false);
  }

  async function onSignOut() {
    // Real Supabase sign-out (server action) → redirects to /login.
    await signOut();
  }

  return (
    <LocaleProvider initialLocale={initialLocale}>
      <div
        className={`${montserrat.variable} ${montserratAlternates.variable} flex min-h-screen w-full flex-col bg-[#00101A]`}
      >
        <SiteHeader
          isAuthenticated={isAuthenticated}
          isAdmin={isAdmin}
          userEmail={userEmail}
          hasUnreadNotifications={hasUnreadNotifications}
          onNotificationClick={onNotificationClick}
          onSignOut={onSignOut}
          activeHref="/kudos"
        />

        <main className="flex flex-1 flex-col gap-24 pb-24 lg:gap-[120px]">
          <KudosBoard />
        </main>

        <WidgetButton />
        <SiteFooter activeHref="/kudos" />
      </div>
    </LocaleProvider>
  );
}
