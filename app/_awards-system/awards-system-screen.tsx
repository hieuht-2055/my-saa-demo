"use client";

import { useState } from "react";
import { signOut } from "@/app/auth/actions";
import { LocaleProvider } from "@/lib/i18n/locale-provider";
import type { Locale } from "@/lib/i18n/config";
import { digitFont, montserrat } from "@/app/_home/fonts";
import KudosSection from "../_home/kudos-section";
import SiteFooter from "../_home/site-footer";
import SiteHeader from "../_home/site-header";
import WidgetButton from "../_home/widget-button";
import AwardsDetailList from "./awards-detail-list";
import KeyvisualHero from "./keyvisual-hero";
import SectionTitle from "./section-title";

interface AwardsSystemScreenProps {
  /** INTEGRATION POINT (Track B): real Supabase auth state. */
  isAuthenticated: boolean;
  isAdmin: boolean;
  userEmail: string | null;
  /** Active locale, resolved from the cookie by the route (SSR). */
  initialLocale?: Locale;
}

/**
 * "Hệ thống giải thưởng SAA 2025" detail screen — presentational/local state
 * only (notification badge). Locale lives in the i18n context; auth state
 * arrives as props from the route's `page.tsx`.
 */
export default function AwardsSystemScreen({
  isAuthenticated,
  isAdmin,
  userEmail,
  initialLocale,
}: AwardsSystemScreenProps) {
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true);

  function onNotificationClick() {
    // INTEGRATION POINT (Track B): open the real notification list.
    setHasUnreadNotifications(false);
  }

  async function onSignOut() {
    // Real Supabase sign-out (server action) → redirects to /login.
    await signOut();
  }

  return (
    <LocaleProvider initialLocale={initialLocale}>
      <div
        className={`${montserrat.variable} ${digitFont.variable} flex min-h-screen w-full flex-col bg-[#00101A]`}
      >
        <SiteHeader
          isAuthenticated={isAuthenticated}
          isAdmin={isAdmin}
          userEmail={userEmail}
          hasUnreadNotifications={hasUnreadNotifications}
          onNotificationClick={onNotificationClick}
          onSignOut={onSignOut}
          activeHref="/he-thong-giai"
        />

        <main className="flex flex-1 flex-col gap-16 lg:gap-20">
          <KeyvisualHero />
          <SectionTitle />
          <AwardsDetailList />
          <KudosSection />
        </main>

        <WidgetButton />
        <SiteFooter />
      </div>
    </LocaleProvider>
  );
}
