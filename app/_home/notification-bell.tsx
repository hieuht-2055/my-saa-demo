"use client";

import { IconBell } from "./icons";
import { useT } from "@/lib/i18n/locale-provider";

interface NotificationBellProps {
  hasUnread: boolean;
  onClick: () => void;
}

// mm:I2167:9091;186:2101 — bell + red unread dot (mm:I2167:9091;186:2089).
export default function NotificationBell({ hasUnread, onClick }: NotificationBellProps) {
  const t = useT("common");

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={t("notification.ariaLabel")}
      className="relative flex h-10 w-10 items-center justify-center rounded text-white transition-colors hover:bg-white/10"
    >
      <IconBell width={24} height={24} />
      {hasUnread && (
        <span
          aria-hidden="true"
          className="absolute right-[9px] top-[9px] h-2 w-2 rounded-full bg-[#D4271D]"
        />
      )}
    </button>
  );
}
