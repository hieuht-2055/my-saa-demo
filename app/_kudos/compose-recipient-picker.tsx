"use client";

import { useState } from "react";
import Image from "next/image";
import { useDismissableMenu } from "../_home/use-dismissable-menu";
import { IconChevronDown } from "./icons";
import type { Sunner } from "./kudos-data";
import { useT } from "@/lib/i18n/locale-provider";

interface ComposeRecipientPickerProps {
  value: Sunner | null;
  onChange: (sunner: Sunner | null) => void;
  search: (query: string) => Sunner[];
  error?: "required";
  id: string;
}

/**
 * mm:520:9871 (B) + mm:520:9872 (B.1) + mm:520:9873 (B.2) — the required
 * "Người nhận" autocomplete. 514x56, 8px radius, border #998C5F per spec;
 * turns red with `errors.recipient` (TC ID-7/50). Typing filters via
 * `search`, Enter/click selects, Escape/outside-click closes (spec B.2 +
 * shared header-menu behaviour).
 */
export default function ComposeRecipientPicker({
  value,
  onChange,
  search,
  error,
  id,
}: ComposeRecipientPickerProps) {
  const t = useT("kudos");
  const { isOpen, setIsOpen, containerRef } = useDismissableMenu<HTMLDivElement>();
  const [query, setQuery] = useState(value?.name ?? "");
  const [activeIndex, setActiveIndex] = useState(-1);

  // Reset (spec H.1 "Hủy") clears `value` externally — keep the input in
  // sync. Adjusted during render (React's documented pattern for state
  // derived from a prop) rather than in an effect, which would cause an
  // extra render pass.
  const [prevValue, setPrevValue] = useState(value);
  if (value !== prevValue) {
    setPrevValue(value);
    setQuery(value?.name ?? "");
  }

  const results = isOpen ? search(query.trim()) : [];
  const errorId = error ? `${id}-error` : undefined;

  function selectSunner(sunner: Sunner) {
    onChange(sunner);
    setQuery(sunner.name);
    setIsOpen(false);
    setActiveIndex(-1);
  }

  function onInputChange(next: string) {
    setQuery(next);
    setActiveIndex(-1);
    if (value) onChange(null); // editing after a pick means searching again
    setIsOpen(true);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (activeIndex >= 0 && results[activeIndex]) selectSunner(results[activeIndex]);
    } else if (event.key === "Escape") {
      setIsOpen(false);
    }
  }

  return (
    <div className="flex w-full flex-wrap items-center gap-4">
      {/* mm:520:9872 (B.1) */}
      <label
        htmlFor={id}
        className="flex items-center gap-0.5 whitespace-nowrap [font-family:var(--font-montserrat)] text-[22px] font-bold leading-7 text-[#00101A]"
      >
        {t("compose.recipientLabel")}
        <span aria-hidden className="text-base leading-5 text-[#CF1322]">
          {t("compose.requiredMark")}
        </span>
      </label>

      <div ref={containerRef} className="relative min-w-[240px] flex-1">
        {/* mm:520:9873 (B.2) */}
        <div
          className={`flex h-14 items-center justify-between gap-2 rounded-lg border bg-white px-6 ${
            error ? "border-[#CF1322]" : "border-[#998C5F]"
          }`}
        >
          <input
            id={id}
            type="text"
            role="combobox"
            aria-expanded={isOpen}
            aria-controls={`${id}-listbox`}
            aria-autocomplete="list"
            aria-invalid={!!error}
            aria-describedby={errorId}
            value={query}
            onFocus={() => setIsOpen(true)}
            onChange={(event) => onInputChange(event.target.value)}
            onKeyDown={onKeyDown}
            placeholder={t("compose.recipientPlaceholder")}
            className="w-full min-w-0 [font-family:var(--font-montserrat)] text-base font-bold leading-6 tracking-[0.15px] text-[#00101A] placeholder:text-[#999999] focus:outline-none"
          />
          <IconChevronDown
            aria-hidden
            width={24}
            height={24}
            className={`shrink-0 text-[#00101A] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </div>

        {isOpen && (
          <ul
            id={`${id}-listbox`}
            role="listbox"
            aria-label={t("compose.recipientDropdownAria")}
            className="absolute left-0 right-0 z-20 mt-2 max-h-64 overflow-y-auto rounded-lg border border-[#998C5F] bg-white py-2 shadow-lg"
          >
            {results.length === 0 ? (
              <li className="px-4 py-2 [font-family:var(--font-montserrat)] text-sm text-[#999999]">
                {t("search.noResult")}
              </li>
            ) : (
              results.map((sunner, index) => (
                <li key={sunner.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={value?.id === sunner.id}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => selectSunner(sunner)}
                    className={`flex w-full items-center gap-3 px-4 py-2 text-left transition-colors duration-200 ${
                      index === activeIndex ? "bg-[rgba(255,234,158,0.4)]" : "hover:bg-[rgba(255,234,158,0.25)]"
                    }`}
                  >
                    <Image src={sunner.avatar} alt="" width={32} height={32} className="h-8 w-8 rounded-full object-cover" />
                    <span className="[font-family:var(--font-montserrat)] text-sm font-bold text-[#00101A]">
                      {sunner.name}
                    </span>
                  </button>
                </li>
              ))
            )}
          </ul>
        )}
      </div>

      {error && (
        <p id={errorId} className="w-full [font-family:var(--font-montserrat)] text-sm font-bold text-[#CF1322]">
          {t(`compose.errors.${error}`)}
        </p>
      )}
    </div>
  );
}
