"use client";

import type { Sunner } from "./kudos-data";
import { useT } from "@/lib/i18n/locale-provider";

interface ComposeMentionPopupProps {
  results: Sunner[];
  /** Which option the keyboard is on — owned by the editor, which sees the keys. */
  activeIndex: number;
  onPick: (sunner: Sunner) => void;
}

/**
 * mm:520:9886 (D) / TC ID-12, ID-13, ID-33 — the "@" mention list. Presentational:
 * the caret lives in the editor's `contentEditable`, so the editor keeps focus and
 * owns arrow/enter handling while this only draws the current state.
 *
 * `onMouseDown` is prevented so clicking an option never moves focus out of the
 * editor — losing the selection there would strand the mention with nowhere to go.
 */
export default function ComposeMentionPopup({
  results,
  activeIndex,
  onPick,
}: ComposeMentionPopupProps) {
  const t = useT("kudos");

  return (
    <ul
      role="listbox"
      aria-label={t("compose.mentionDropdownAria")}
      className="absolute z-30 mt-1 max-h-48 w-64 overflow-y-auto rounded-lg border border-[#998C5F] bg-white py-2 shadow-lg"
    >
      {results.map((sunner, index) => (
        <li key={sunner.id}>
          <button
            type="button"
            role="option"
            aria-selected={index === activeIndex}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => onPick(sunner)}
            className={`flex w-full items-center px-4 py-2 text-left [font-family:var(--font-montserrat)] text-sm font-bold text-[#00101A] ${
              index === activeIndex ? "bg-[rgba(255,234,158,0.25)]" : ""
            } hover:bg-[rgba(255,234,158,0.25)]`}
          >
            {sunner.name}
          </button>
        </li>
      ))}
    </ul>
  );
}
