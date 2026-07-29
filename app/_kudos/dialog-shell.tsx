"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { IconClose } from "./icons";
import { useT } from "@/lib/i18n/locale-provider";

const DEFAULT_PANEL_CLASS =
  "flex w-full max-w-[560px] flex-col gap-6 rounded-2xl border border-[#FFEA9E]/40 bg-[#00101A] p-6 shadow-2xl sm:p-8";
const DEFAULT_TITLE_CLASS =
  "[font-family:var(--font-montserrat)] text-2xl font-bold leading-8 text-[#FFEA9E]";

interface DialogShellProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  /**
   * Override the panel's own chrome (width/background/radius/padding). Only
   * `Secret Box` (D.1.8) draws the shared dark #00101A card this defaults to;
   * frames with their own MoMorph panel — e.g. Viết Kudo's cream #FFF8E1 card
   * (mm:520:11647) — pass their real tokens here instead of inventing art.
   */
  panelClassName?: string;
  /** Override the title's typography/color to match `panelClassName`'s theme. */
  titleClassName?: string;
  /**
   * Centre the title full-width with the close control absolutely positioned
   * in the corner, for frames whose design draws no header row — just a
   * centred heading (mm:520:9870) — instead of the shared title+close row.
   */
  centerTitle?: boolean;
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
export default function DialogShell({
  open,
  title,
  onClose,
  children,
  panelClassName,
  titleClassName,
  centerTitle,
}: DialogShellProps) {
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
        className={panelClassName ?? DEFAULT_PANEL_CLASS}
      >
        {centerTitle ? (
          <div className="relative flex w-full items-center justify-center">
            <h2 className={titleClassName ?? DEFAULT_TITLE_CLASS}>{title}</h2>
            <button
              type="button"
              onClick={onClose}
              aria-label={t("compose.close")}
              className="absolute right-0 top-0 rounded p-1 text-[#00101A] transition-colors duration-200 hover:bg-black/5"
            >
              <IconClose width={24} height={24} />
            </button>
          </div>
        ) : (
          <div className="flex items-start justify-between gap-4">
            <h2 className={titleClassName ?? DEFAULT_TITLE_CLASS}>{title}</h2>
            <button
              type="button"
              onClick={onClose}
              aria-label={t("compose.close")}
              className="rounded p-1 text-white transition-colors duration-200 hover:bg-white/10"
            >
              <IconClose width={24} height={24} />
            </button>
          </div>
        )}

        {children}
      </div>
    </div>
  );
}
