import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { signOut } from '@/app/auth/actions'

/**
 * Minimal protected landing page — the post-login redirect target (/todo).
 * Placeholder until the real Todo feature is built; proves the OAuth
 * round-trip and route protection work end-to-end.
 */
export default async function TodoPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Belt-and-braces: proxy already guards this route.
  if (!user) redirect('/login')

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-neutral-950 px-6 text-neutral-100">
      <h1 className="text-2xl font-bold">SAA 2025</h1>
      <p className="text-neutral-300">
        Đăng nhập thành công với <span className="font-semibold">{user.email}</span>
      </p>
      <form action={signOut}>
        <button
          type="submit"
          className="rounded-md bg-neutral-100 px-4 py-2 font-semibold text-neutral-900 transition hover:bg-white"
        >
          Đăng xuất
        </button>
      </form>
    </main>
  )
}
