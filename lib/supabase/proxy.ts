import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/** Routes reachable without an authenticated session. */
const PUBLIC_PATHS = ['/', '/login']

function isPublic(pathname: string): boolean {
  if (PUBLIC_PATHS.includes(pathname)) return true
  // Auth callback / OAuth exchange must stay reachable while signed out.
  return pathname.startsWith('/auth')
}

/**
 * Refreshes the Supabase session cookie on every request and enforces
 * route access rules. Called from the root `proxy.ts` (Next.js 16 renamed
 * Middleware to Proxy — same functionality, runs on the Node.js runtime).
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  // Do not run logic between createServerClient and getUser() — it triggers
  // the token refresh whose Set-Cookie headers must land on supabaseResponse.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname

  // Unauthenticated user on a protected route -> /login
  if (!user && !isPublic(path)) {
    return redirectPreservingCookies(request, supabaseResponse, '/login')
  }

  // Authenticated user on /login -> homepage (redirect away from login)
  if (user && path === '/login') {
    return redirectPreservingCookies(request, supabaseResponse, '/')
  }

  return supabaseResponse
}

/**
 * Build a redirect that carries over any Set-Cookie from the refreshed
 * session so the new session is not lost across the redirect.
 */
function redirectPreservingCookies(
  request: NextRequest,
  from: NextResponse,
  pathname: string,
) {
  const url = request.nextUrl.clone()
  url.pathname = pathname
  url.search = ''
  const redirect = NextResponse.redirect(url)
  from.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie))
  return redirect
}
