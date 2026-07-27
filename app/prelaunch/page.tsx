import type { Metadata } from "next";
import PrelaunchScreen from "@/app/_prelaunch/prelaunch-screen";
import { getEventDateIso } from "@/lib/event-config";
import { getLocale } from "@/lib/i18n/get-locale";
import { messages } from "@/lib/i18n/messages";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const m = messages[locale].prelaunch;
  return { title: m.metaTitle, description: m.metaDescription };
}

// Public prelaunch / coming-soon countdown (route allow-listed in
// lib/supabase/proxy.ts). The target datetime comes from lib/event-config.ts
// (NEXT_PUBLIC_EVENT_DATETIME); when it has passed, the countdown reads 00 and
// the screen reveals a CTA into the site.
export default async function PrelaunchPage() {
  const locale = await getLocale();
  // null (missing/invalid env) → empty string → countdown falls back to 00.
  const eventTargetIso = getEventDateIso() ?? "";

  return <PrelaunchScreen eventTargetIso={eventTargetIso} initialLocale={locale} />;
}
