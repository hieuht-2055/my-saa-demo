import { createClient } from '@/lib/supabase/server'

export interface CurrentUser {
  isAuthenticated: boolean
  email: string | null
  isAdmin: boolean
}

/**
 * Resolves the current session for the (public) homepage header. The homepage
 * renders for everyone; when a session exists the header shows the bell,
 * avatar, and account menu. Admin is derived from `app_metadata.role`.
 */
export async function getCurrentUser(): Promise<CurrentUser> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { isAuthenticated: false, email: null, isAdmin: false }
  }

  const role =
    (user.app_metadata as { role?: string } | null)?.role ?? null

  return {
    isAuthenticated: true,
    email: user.email ?? null,
    isAdmin: role === 'admin',
  }
}
