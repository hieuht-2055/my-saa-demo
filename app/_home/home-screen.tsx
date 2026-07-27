"use client";

import { useMemo, useState } from "react";
import { signOut } from "@/app/auth/actions";
import { LocaleProvider } from "@/lib/i18n/locale-provider";
import type { Locale } from "@/lib/i18n/config";
import { digitFont, montserrat, montserratAlternates } from "./fonts";
import AwardsSection from "./awards-section";
import HeroSection from "./hero-section";
import KudosSection from "./kudos-section";
import RootFurther from "./root-further";
import SiteFooter from "./site-footer";
import SiteHeader from "./site-header";
import WidgetButton from "./widget-button";

interface HomeScreenProps {
  /** INTEGRATION POINT (Track B): real Supabase auth state. */
  isAuthenticated: boolean;
  isAdmin: boolean;
  userEmail: string | null;
  /** ISO datetime string for the event; Track B reads this from an env var. */
  eventTargetIso: string;
  /** Active locale, resolved from the cookie by the route (SSR). */
  initialLocale?: Locale;
}

/**
 * Homepage SAA — owns presentational/local state only (notification badge).
 * Locale lives in the i18n context (LocaleProvider); auth state and the event
 * target date arrive as props from `app/page.tsx`.
 */
export default function HomeScreen({
  isAuthenticated,
  isAdmin,
  userEmail,
  eventTargetIso,
  initialLocale,
}: HomeScreenProps) {
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true);

  const eventTargetDate = useMemo(() => {
    const parsed = new Date(eventTargetIso);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }, [eventTargetIso]);

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
        className={`${montserrat.variable} ${montserratAlternates.variable} ${digitFont.variable} flex min-h-screen w-full flex-col bg-[#00101A]`}
      >
        <SiteHeader
          isAuthenticated={isAuthenticated}
          isAdmin={isAdmin}
          userEmail={userEmail}
          hasUnreadNotifications={hasUnreadNotifications}
          onNotificationClick={onNotificationClick}
          onSignOut={onSignOut}
        />

        <main className="flex flex-1 flex-col gap-24 lg:gap-[120px]">
          <HeroSection eventTargetDate={eventTargetDate} />
          <RootFurther />
          <AwardsSection />
          <KudosSection />
        </main>

        <WidgetButton />
        <SiteFooter />
      </div>
    </LocaleProvider>
  );
}
