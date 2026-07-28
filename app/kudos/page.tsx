import type { Metadata } from "next";
import KudosScreen from "../_kudos/kudos-screen";
import { getCurrentUser } from "@/lib/supabase/current-user";
import { getLocale } from "@/lib/i18n/get-locale";

export const metadata: Metadata = {
  title: "Sun* Kudos | Sun* Annual Awards 2025",
  description: "Hệ thống ghi nhận và cảm ơn — Sun* Annual Awards 2025.",
};

/**
 * Sun* Kudos live board (mm:2940:13431). `/kudos` is not in the proxy's
 * `PUBLIC_PATHS`, so `lib/supabase/proxy.ts` already redirects an
 * unauthenticated request to `/login` — by the time this renders a session
 * exists. `getCurrentUser()` supplies the header's auth state.
 */
export default async function KudosPage() {
  const { isAuthenticated, isAdmin, email } = await getCurrentUser();
  const locale = await getLocale();

  return (
    <KudosScreen
      isAuthenticated={isAuthenticated}
      isAdmin={isAdmin}
      userEmail={email}
      initialLocale={locale}
    />
  );
}
