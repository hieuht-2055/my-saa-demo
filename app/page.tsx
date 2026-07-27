import type { Metadata } from "next";
import HomeScreen from "./_home/home-screen";
import { getCurrentUser } from "@/lib/supabase/current-user";
import { getEventDateIso } from "@/lib/event-config";
import { getLocale } from "@/lib/i18n/get-locale";

export const metadata: Metadata = {
  title: "Sun* Annual Awards 2025",
  description: "Root Further — Sun* Annual Awards 2025.",
};

// Public homepage (test case ID-0). Auth state only enriches the header.
export default async function Home() {
  const { isAuthenticated, isAdmin, email } = await getCurrentUser();
  const locale = await getLocale();
  // null (missing/invalid env) → empty string → countdown falls back to 00:00:00.
  const eventTargetIso = getEventDateIso() ?? "";

  return (
    <HomeScreen
      isAuthenticated={isAuthenticated}
      isAdmin={isAdmin}
      userEmail={email}
      eventTargetIso={eventTargetIso}
      initialLocale={locale}
    />
  );
}
