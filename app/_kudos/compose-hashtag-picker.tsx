"use client";

import { useDismissableMenu } from "../_home/use-dismissable-menu";
import { IconCloseTiny, IconPlus } from "./compose-icons";
import { MAX_HASHTAGS } from "./kudos-compose-types";
import { useT } from "@/lib/i18n/locale-provider";

interface ComposeHashtagPickerProps {
  selected: string[];
  /** Already excludes chosen tags (contract: "minus already-chosen tags"). */
  options: string[];
  onAdd: (tag: string) => void;
  onRemove: (tag: string) => void;
  error?: "required" | "max";
  id: string;
}

/**
 * mm:520:9890 (E) + mm:520:9891 (E.1) + mm:662:8595 (E.2) — required Hashtag
 * field. "+ Hashtag" opens a dropdown of `options`; chosen tags render as
 * chips with an "x" (TC ID-34/35/36). Errors: empty (spec E validation) or
 * at the 5-tag ceiling (TC ID-17/53) — `MAX_HASHTAGS` drives the "Tối đa 5" note.
 */
export default function ComposeHashtagPicker({
  selected,
  options,
  onAdd,
  onRemove,
  error,
  id,
}: ComposeHashtagPickerProps) {
  const t = useT("kudos");
  const { isOpen, setIsOpen, containerRef } = useDismissableMenu<HTMLDivElement>();
  const atMax = selected.length >= MAX_HASHTAGS;
  const errorId = error ? `${id}-error` : undefined;

  function pick(tag: string) {
    onAdd(tag);
    setIsOpen(false);
  }

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex w-full flex-wrap items-center gap-4">
        {/* mm:520:9891 (E.1) */}
        <span
          id={`${id}-label`}
          className="flex items-center gap-0.5 whitespace-nowrap [font-family:var(--font-montserrat)] text-[22px] font-bold leading-7 text-[#00101A]"
        >
          {t("compose.hashtagLabel")}
          <span aria-hidden className="text-base leading-5 text-[#CF1322]">
            {t("compose.requiredMark")}
          </span>
        </span>

        <div className="flex flex-1 flex-wrap items-center gap-2">
          {selected.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-2 rounded-full border border-[#FFEA9E] bg-[rgba(255,234,158,0.4)] px-3 py-1.5 [font-family:var(--font-montserrat)] text-sm font-bold text-[#00101A]"
            >
              #{tag}
              <button
                type="button"
                onClick={() => onRemove(tag)}
                aria-label={`${t("compose.hashtagRemoveAria")} #${tag}`}
                className="text-[#00101A]/70 hover:text-[#00101A]"
              >
                <IconCloseTiny width={10} height={10} />
              </button>
            </span>
          ))}

          <div ref={containerRef} className="relative">
            {!atMax && (
              <button
                type="button"
                onClick={() => setIsOpen((v) => !v)}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-labelledby={`${id}-label`}
                className="flex h-12 items-center gap-1 rounded-lg border border-[#998C5F] bg-white px-2 py-1"
              >
                <IconPlus width={24} height={24} className="shrink-0 text-[#999999]" />
                <span className="flex flex-col items-start justify-center">
                  <span className="[font-family:var(--font-montserrat)] text-[11px] font-bold leading-4 tracking-[0.5px] text-[#999999]">
                    {t("compose.hashtagLabel")}
                  </span>
                  <span className="[font-family:var(--font-montserrat)] text-[11px] font-bold leading-4 tracking-[0.5px] text-[#999999]">
                    {t("compose.maxCount")}
                  </span>
                </span>
              </button>
            )}

            {isOpen && (
              <ul
                role="listbox"
                aria-label={t("compose.hashtagDropdownAria")}
                className="absolute left-0 top-full z-20 mt-2 min-w-[160px] overflow-hidden rounded-lg border border-[#998C5F] bg-white py-2 shadow-lg"
              >
                {options.length === 0 ? (
                  <li className="px-4 py-2 [font-family:var(--font-montserrat)] text-sm text-[#999999]">
                    {t("compose.maxCount")}
                  </li>
                ) : (
                  options.map((tag) => (
                    <li key={tag}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={false}
                        onClick={() => pick(tag)}
                        className="w-full px-4 py-2 text-left [font-family:var(--font-montserrat)] text-sm font-bold text-[#00101A] hover:bg-[rgba(255,234,158,0.25)]"
                      >
                        #{tag}
                      </button>
                    </li>
                  ))
                )}
              </ul>
            )}
          </div>
        </div>
      </div>

      {error && (
        <p id={errorId} className="[font-family:var(--font-montserrat)] text-sm font-bold text-[#CF1322]">
          {t(`compose.errors.${error}`)}
        </p>
      )}
    </div>
  );
}
