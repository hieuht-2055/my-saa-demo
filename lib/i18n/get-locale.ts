import { cookies } from 'next/headers'
import { DEFAULT_LOCALE, LOCALE_COOKIE, isLocale, type Locale } from './config'

/**
 * Resolves the active locale for server components from the locale cookie.
 * Falls back to the default locale when unset/invalid. Next.js 16: `cookies()`
 * is async.
 */
export async function getLocale(): Promise<Locale> {
  const store = await cookies()
  const value = store.get(LOCALE_COOKIE)?.value
  return isLocale(value) ? value : DEFAULT_LOCALE
}
