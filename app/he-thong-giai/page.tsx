import type { Metadata } from "next";
import AwardsSystemScreen from "../_awards-system/awards-system-screen";
import { getCurrentUser } from "@/lib/supabase/current-user";
import { getLocale } from "@/lib/i18n/get-locale";

export const metadata: Metadata = {
  title: "Hệ thống giải thưởng | Sun* Annual Awards 2025",
  description: "Hệ thống giải thưởng SAA 2025 — Root Further.",
};

/**
 * Award System detail screen (test cases ID-0/ID-1). Route access is enforced
 * by the proxy (`lib/supabase/proxy.ts`): an unauthenticated request to any
 * non-public path is redirected to `/login`, so by the time this renders a
 * session exists. `getCurrentUser()` supplies the header's auth state.
 */
export default async function AwardsSystemPage() {
  const { isAuthenticated, isAdmin, email } = await getCurrentUser();
  const locale = await getLocale();

  return (
    <AwardsSystemScreen
      isAuthenticated={isAuthenticated}
      isAdmin={isAdmin}
      userEmail={email}
      initialLocale={locale}
    />
  );
}
