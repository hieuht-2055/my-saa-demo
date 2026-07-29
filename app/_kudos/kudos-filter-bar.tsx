"use client";

import FilterDropdown from "./filter-dropdown";
import { HASHTAG_OPTIONS } from "./kudos-data";
import { DEPARTMENTS } from "./kudos-sunners";
import { useT } from "@/lib/i18n/locale-provider";

interface KudosFilterBarProps {
  hashtag: string | null;
  department: string | null;
  onHashtagChange: (value: string | null) => void;
  onDepartmentChange: (value: string | null) => void;
}

/**
 * mm:2940:13451 (B.1.1 + B.1.2) — the hashtag and department dropdowns that sit in
 * the HIGHLIGHT heading and narrow both sections at once (spec B/C).
 */
export default function KudosFilterBar({
  hashtag,
  department,
  onHashtagChange,
  onDepartmentChange,
}: KudosFilterBarProps) {
  const t = useT("kudos");

  return (
    <div className="flex items-center gap-4">
      <FilterDropdown
        label={t("filter.hashtag")}
        options={HASHTAG_OPTIONS}
        value={hashtag}
        onChange={onHashtagChange}
      />
      <FilterDropdown
        label={t("filter.department")}
        options={DEPARTMENTS}
        value={department}
        onChange={onDepartmentChange}
      />
    </div>
  );
}
