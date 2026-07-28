"use client";

import { useDismissableMenu } from "../_home/use-dismissable-menu";
import { IconChevronDown } from "./icons";
import { useT } from "@/lib/i18n/locale-provider";

interface FilterDropdownProps {
  label: string;
  options: readonly string[];
  value: string | null;
  onChange: (value: string | null) => void;
}

/**
 * mm:2940:13459 (B.1.1) / mm:2940:13460 (B.1.2) — pill-shaped filter button
 * that opens a menu of `options` plus a "Bỏ lọc" entry to clear the filter.
 * Closes on outside click / Escape via the shared header-menu hook.
 */
export default function FilterDropdown({ label, options, value, onChange }: FilterDropdownProps) {
  const t = useT("kudos");
  const { isOpen, setIsOpen, containerRef } = useDismissableMenu<HTMLDivElement>();

  function select(next: string | null) {
    onChange(next);
    setIsOpen(false);
  }

  return (
    <div ref={containerRef} className="relative">
      {/* mm:2940:13459 / 2940:13460 */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`flex items-center gap-2 rounded border px-4 py-4 [font-family:var(--font-montserrat)] text-base font-bold leading-6 tracking-[0.15px] text-white transition-colors duration-200 ${
          value
            ? "border-[#FFEA9E] bg-[rgba(255,234,158,0.25)]"
            : "border-[#998C5F] bg-[rgba(255,234,158,0.10)] hover:bg-[rgba(255,234,158,0.18)]"
        }`}
      >
        {value ?? label}
        <IconChevronDown width={24} height={24} className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <ul
          role="listbox"
          className="absolute right-0 z-20 mt-2 min-w-[180px] overflow-hidden rounded-lg border border-[#998C5F] bg-[#00101A] py-2 shadow-lg"
        >
          <li>
            <button
              type="button"
              onClick={() => select(null)}
              className="w-full px-4 py-2 text-left [font-family:var(--font-montserrat)] text-sm font-bold text-[#999999] hover:bg-[rgba(255,234,158,0.10)]"
            >
              {t("filter.clear")}
            </button>
          </li>
          {options.map((option) => (
            <li key={option}>
              <button
                type="button"
                role="option"
                aria-selected={value === option}
                onClick={() => select(option)}
                className={`w-full px-4 py-2 text-left [font-family:var(--font-montserrat)] text-sm font-bold transition-colors duration-200 ${
                  value === option ? "bg-[rgba(255,234,158,0.20)] text-[#FFEA9E]" : "text-white hover:bg-[rgba(255,234,158,0.10)]"
                }`}
              >
                {option}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
