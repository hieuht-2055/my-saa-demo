"use client";

import { useEffect } from "react";
import { IconClose } from "./icons";
import { useT } from "@/lib/i18n/locale-provider";

interface KudosToastProps {
  /** Key in the `kudos` namespace, or null when nothing is showing. */
  messageKey: string | null;
  onDismiss: () => void;
}

/** How long a toast stays up before dismissing itself. */
const AUTO_DISMISS_MS = 3000;

/**
 * The confirmation toast for card actions — "Link copied — ready to share!"
 * after Copy Link (spec B.3/C.4.2), and the compose confirmation.
 *
 * `role="status"` + `aria-live="polite"` so screen readers announce the copy
 * without stealing focus from the button that triggered it.
 */
export default function KudosToast({ messageKey, onDismiss }: KudosToastProps) {
  const t = useT("kudos");

  useEffect(() => {
    if (!messageKey) return;
    const timer = setTimeout(onDismiss, AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [messageKey, onDismiss]);

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-8 z-[110] flex justify-center px-4"
    >
      {messageKey && (
        <div className="pointer-events-auto flex items-center gap-3 rounded-full border border-[#FFEA9E]/50 bg-[#00101A] px-5 py-3 shadow-xl">
          <span className="[font-family:var(--font-montserrat)] text-base font-bold leading-6 text-[#FFEA9E]">
            {t(messageKey)}
          </span>
          <button
            type="button"
            onClick={onDismiss}
            aria-label={t("toast.dismiss")}
            className="rounded text-white/70 transition-colors duration-200 hover:text-white"
          >
            <IconClose width={20} height={20} />
          </button>
        </div>
      )}
    </div>
  );
}
