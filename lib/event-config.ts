/**
 * Event configuration for the homepage countdown.
 *
 * The event start time is configured via the `NEXT_PUBLIC_EVENT_DATETIME`
 * environment variable in ISO-8601 format (e.g. "2025-12-31T18:30:00+07:00").
 * It is NEXT_PUBLIC so the countdown can also tick on the client.
 */
const DEFAULT_EVENT_DATETIME = '2025-12-31T18:30:00+07:00'

/**
 * Returns the configured event start time as a Date, or `null` when the
 * value is missing or not a valid datetime (the countdown falls back to a
 * 00:00:00 zero-state instead of crashing).
 */
export function getEventDate(): Date | null {
  const raw = process.env.NEXT_PUBLIC_EVENT_DATETIME || DEFAULT_EVENT_DATETIME
  const date = new Date(raw)
  return Number.isNaN(date.getTime()) ? null : date
}

/** ISO string form for passing to client components (null if invalid). */
export function getEventDateIso(): string | null {
  return getEventDate()?.toISOString() ?? null
}
