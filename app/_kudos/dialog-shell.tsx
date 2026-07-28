"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { IconClose } from "./icons";
import { useT } from "@/lib/i18n/locale-provider";

interface DialogShellProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}

/**
 * Accessible modal shell shared by the compose (A.1) and Secret Box (D.1.8)
 * dialogs. Those two dialogs are specified as behaviour on this screen but are
 * drawn on separate MoMorph frames, so the chrome here is built from this
 * board's own tokens (#00101A panel, #FFEA9E accent) rather than invented art.
 *
 * Escape and backdrop clicks close it, focus moves inside on open and returns
 * to the trigger on close, and body scroll is locked while it is up.
 */
export default function DialogShell({ open, title, onClose, children }: DialogShellProps) {
  const t = useT("kudos");
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreFocusTo = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    restoreFocusTo.current = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    // Land focus on the first control so keyboard users are not stranded
    // outside the panel.
    panelRef.current
      ?.querySelector<HTMLElement>("button, [href], input, textarea, select")
      ?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      // Trap Tab inside the panel — otherwise focus walks out into the page
      // behind the modal, which is still fully rendered.
      const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input, textarea, select, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
      restoreFocusTo.current?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
        className="flex w-full max-w-[560px] flex-col gap-6 rounded-2xl border border-[#FFEA9E]/40 bg-[#00101A] p-6 shadow-2xl sm:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <h2 className="[font-family:var(--font-montserrat)] text-2xl font-bold leading-8 text-[#FFEA9E]">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("compose.close")}
            className="rounded p-1 text-white transition-colors duration-200 hover:bg-white/10"
          >
            <IconClose width={24} height={24} />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}
