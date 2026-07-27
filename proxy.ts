import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/proxy'

// Next.js 16: Middleware is now "Proxy". One `proxy.ts` per project at the
// same level as `app`. Refreshes the Supabase session and guards routes.
export async function proxy(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Run on all paths except static assets and image files so the session
     * cookie stays fresh and route guards apply to every page navigation.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
