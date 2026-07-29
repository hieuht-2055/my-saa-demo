// The option sources behind the compose modal's pickers (mm:520:11602). Pure
// functions, so they need no hook and carry a stable identity for free — the
// dialog can take them as props without re-rendering on every keystroke.

import { HASHTAG_OPTIONS, type Sunner } from "./kudos-data";
import { SUNNER_DIRECTORY, VIEWER } from "./kudos-sunners";
import { matchesName } from "./kudos-board-helpers";
import { hasHashtag } from "./kudos-compose-draft";

/** Autocomplete lists stay short enough to read without scrolling (spec B.2). */
const SUGGESTION_LIMIT = 8;

/**
 * Spec B / D — one lookup serves both the recipient picker and "@" mentions.
 * The viewer is filtered out: a kudos is for a teammate, never for yourself.
 * An empty query returns the head of the directory so the list opens populated.
 */
export function lookupSunners(query: string): Sunner[] {
  const needle = query.trim();
  const pool = SUNNER_DIRECTORY.filter((sunner) => sunner.id !== VIEWER.id);
  if (!needle) return pool.slice(0, SUGGESTION_LIMIT);
  return pool.filter((s) => matchesName(s.name, needle)).slice(0, SUGGESTION_LIMIT);
}

/** Spec E — already-chosen tags leave the dropdown; nothing to gain by offering them. */
export function availableHashtags(chosen: string[]): string[] {
  return HASHTAG_OPTIONS.filter((tag) => !hasHashtag(chosen, tag));
}
