import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * OAuth callback. Supabase redirects here with a `code` after Google sign-in.
 * We exchange it for a session, then forward to `next` (default /todo).
 * On any failure we send the user back to /login with an error flag so the
 * login screen can show: "Đăng nhập không thành công. Vui lòng thử lại."
 */
export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const next = url.searchParams.get('next') ?? '/'

  // Build the redirect base from the real Host header (the host the browser
  // actually used, e.g. 127.0.0.1:3000) rather than the dev-normalized origin,
  // which can flip to localhost and split the session across cookie domains.
  const host = request.headers.get('host')
  const base = host ? `${url.protocol}//${host}` : url.origin

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${base}${next}`)
    }
  }

  return NextResponse.redirect(`${base}/login?error=auth`)
}
