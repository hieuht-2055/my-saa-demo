'use client'

import { createClient } from '@/lib/supabase/client'

/**
 * Starts the Google OAuth flow via Supabase. The browser is redirected to
 * Google; on success Supabase redirects back to `/auth/callback`, which
 * exchanges the code for a session and forwards to `next` (default `/`, the homepage).
 *
 * Throws on failure so callers can surface the spec error message.
 */
export async function signInWithGoogle(next = '/'): Promise<void> {
  const supabase = createClient()
  const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`

  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo },
  })

  if (error) throw error
}
