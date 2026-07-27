/**
 * i18n configuration — the app ships Vietnamese (default) + English. Locale
 * is persisted in a non-HTTP-only cookie so both the server (SSR initial
 * render) and the client (instant switch) can read it.
 */
export const LOCALES = ['vi', 'en'] as const

export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'vi'

/** Cookie name holding the chosen locale. Readable by client + server. */
export const LOCALE_COOKIE = 'locale'

/** One year, in seconds — how long the locale choice persists. */
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365

export function isLocale(value: string | undefined | null): value is Locale {
  return value === 'vi' || value === 'en'
}
