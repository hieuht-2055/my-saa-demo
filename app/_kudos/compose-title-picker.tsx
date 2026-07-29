"use client";

import { useDismissableMenu } from "../_home/use-dismissable-menu";
import { IconChevronDown } from "./icons";
import { useT } from "@/lib/i18n/locale-provider";

interface ComposeTitlePickerProps {
  value: string;
  options: string[];
  onChange: (title: string) => void;
  error?: "required";
  id: string;
}

/**
 * mm:1688:10448 ("Danh hiệu") — the one required field on this frame that carries
 * no `mms_` spec row, so it appears in neither the spec CSV nor the test cases.
 * The design draws it plainly enough to build from: a label with the required `*`,
 * a dropdown button reading "Dành tặng một danh hiệu cho đồng đội", and helper text
 * explaining that the chosen title becomes the Kudos heading.
 *
 * Its options are the design's own award titles (`GROUP_TAGS`) — the same strings
 * the feed card already prints above a message, which is where this value lands.
 */
export default function ComposeTitlePicker({
  value,
  options,
  onChange,
  error,
  id,
}: ComposeTitlePickerProps) {
  const t = useT("kudos");
  const { isOpen, setIsOpen, containerRef } = useDismissableMenu<HTMLDivElement>();
  const errorId = error ? `${id}-error` : undefined;

  function pick(title: string) {
    onChange(title);
    setIsOpen(false);
  }

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-start">
        <span
          id={`${id}-label`}
          className="flex items-center gap-0.5 whitespace-nowrap [font-family:var(--font-montserrat)] text-[22px] font-bold leading-7 text-[#00101A]"
        >
          {t("compose.titleLabel")}
          <span aria-hidden className="text-base leading-5 text-[#CF1322]">
            {t("compose.requiredMark")}
          </span>
        </span>

        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div ref={containerRef} className="relative w-full">
            <button
              type="button"
              onClick={() => setIsOpen((open) => !open)}
              aria-haspopup="listbox"
              aria-expanded={isOpen}
              aria-labelledby={`${id}-label`}
              // No `aria-invalid` — the implicit button role does not support it.
              // The error is announced through `aria-describedby` instead.
              aria-describedby={errorId}
              className={`flex h-14 w-full items-center justify-between gap-2 rounded-lg border bg-white px-6 [font-family:var(--font-montserrat)] text-base font-bold leading-6 tracking-[0.15px] transition-colors duration-200 ${
                error ? "border-[#CF1322]" : "border-[#998C5F]"
              } ${value ? "text-[#00101A]" : "text-[#999999]"}`}
            >
              <span className="truncate">{value || t("compose.titlePlaceholder")}</span>
              <IconChevronDown
                aria-hidden
                width={24}
                height={24}
                className="shrink-0 text-[#999999]"
              />
            </button>

            {isOpen && (
              <ul
                role="listbox"
                aria-label={t("compose.titleDropdownAria")}
                className="absolute left-0 top-full z-20 mt-2 max-h-60 w-full overflow-y-auto rounded-lg border border-[#998C5F] bg-white py-2 shadow-lg"
              >
                {options.map((option) => (
                  <li key={option}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={option === value}
                      onClick={() => pick(option)}
                      className={`w-full px-4 py-2 text-left [font-family:var(--font-montserrat)] text-sm font-bold hover:bg-[rgba(255,234,158,0.25)] ${
                        option === value ? "text-[#00101A]" : "text-[#00101A]/80"
                      }`}
                    >
                      {option}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* mm:1688:10447 — two lines, kept as the design writes them. */}
          <p className="whitespace-pre-line [font-family:var(--font-montserrat)] text-base font-bold leading-6 tracking-[0.15px] text-[#999999]">
            {t("compose.titleHint")}
          </p>
        </div>
      </div>

      {error && (
        <p
          id={errorId}
          className="[font-family:var(--font-montserrat)] text-sm font-bold text-[#CF1322]"
        >
          {t(`compose.errors.${error}`)}
        </p>
      )}
    </div>
  );
}
