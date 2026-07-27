'use client'

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from 'react'
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  LOCALE_COOKIE_MAX_AGE,
  type Locale,
} from './config'
import { messages, type Namespace } from './messages'

interface LocaleContextValue {
  locale: Locale
  setLocale: (next: Locale) => void
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

/**
 * Client provider holding the active locale. Seeded server-side from the
 * locale cookie (`initialLocale`) to avoid a flash, then switched instantly
 * on the client. Switching also writes the cookie so the next SSR render (and
 * server-only strings like page metadata) picks up the choice.
 */
export function LocaleProvider({
  initialLocale = DEFAULT_LOCALE,
  children,
}: {
  initialLocale?: Locale
  children: ReactNode
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale)

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    document.cookie = `${LOCALE_COOKIE}=${next};path=/;max-age=${LOCALE_COOKIE_MAX_AGE};samesite=lax`
    document.documentElement.lang = next
  }, [])

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext)
  if (!ctx) {
    throw new Error('useLocale must be used within a LocaleProvider')
  }
  return ctx
}

/**
 * Returns a translator bound to the active locale and a namespace. Missing
 * keys fall back to the default locale, then to the key itself.
 */
export function useT(namespace: Namespace) {
  const { locale } = useLocale()
  return useCallback(
    (key: string): string =>
      messages[locale][namespace][key] ??
      messages[DEFAULT_LOCALE][namespace][key] ??
      key,
    [locale, namespace],
  )
}
