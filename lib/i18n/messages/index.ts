import type { Locale } from '../config'
import viCommon from './vi/common'
import enCommon from './en/common'
import viLogin from './vi/login'
import enLogin from './en/login'
import viHome from './vi/home'
import enHome from './en/home'
import viAwards from './vi/awards'
import enAwards from './en/awards'
import viPrelaunch from './vi/prelaunch'
import enPrelaunch from './en/prelaunch'

export type Namespace = 'common' | 'login' | 'home' | 'awards' | 'prelaunch'

/** A flat key→string dictionary for one namespace in one locale. */
export type Dict = Record<string, string>

export const messages: Record<Locale, Record<Namespace, Dict>> = {
  vi: {
    common: viCommon,
    login: viLogin,
    home: viHome,
    awards: viAwards,
    prelaunch: viPrelaunch,
  },
  en: {
    common: enCommon,
    login: enLogin,
    home: enHome,
    awards: enAwards,
    prelaunch: enPrelaunch,
  },
}
