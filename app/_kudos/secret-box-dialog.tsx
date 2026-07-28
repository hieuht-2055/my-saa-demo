"use client";

import { useState } from "react";
import DialogShell from "./dialog-shell";
import { IconGift } from "./icons";
import { useT } from "@/lib/i18n/locale-provider";

interface SecretBoxDialogProps {
  open: boolean;
  /** Boxes the viewer still has closed — drives the counter and the CTA. */
  unopened: number;
  onClose: () => void;
}

/**
 * mm:2940:13497 (D.1.8) — the dialog behind the sidebar's "Mở Secret Box"
 * button. The button and its behaviour are specified on this screen; the prize
 * reveal is designed on a separate frame, so this shows the honest state: how
 * many boxes remain, and an opening action that decrements the local count.
 */
export default function SecretBoxDialog({ open, unopened, onClose }: SecretBoxDialogProps) {
  const t = useT("kudos");
  const [opened, setOpened] = useState(0);

  const remaining = Math.max(unopened - opened, 0);

  return (
    <DialogShell open={open} title={t("secretBox.title")} onClose={onClose}>
      {remaining === 0 ? (
        <p className="[font-family:var(--font-montserrat)] text-base leading-6 text-white">
          {t("secretBox.none")}
        </p>
      ) : (
        <div className="flex items-center justify-between gap-4">
          <span className="[font-family:var(--font-montserrat)] text-base leading-6 text-white">
            {t("secretBox.remaining")}
          </span>
          <span className="[font-family:var(--font-montserrat)] text-[32px] font-bold leading-10 text-[#FFEA9E]">
            {remaining}
          </span>
        </div>
      )}

      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="rounded px-4 py-3 [font-family:var(--font-montserrat)] text-base font-bold leading-6 text-white transition-colors duration-200 hover:bg-white/10"
        >
          {t("secretBox.close")}
        </button>
        <button
          type="button"
          onClick={() => setOpened((count) => count + 1)}
          disabled={remaining === 0}
          className="flex items-center gap-2 rounded bg-[#FFEA9E] px-4 py-3 [font-family:var(--font-montserrat)] text-base font-bold leading-6 text-[#00101A] transition-opacity duration-200 hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {t("secretBox.open")}
          <IconGift width={24} height={24} />
        </button>
      </div>
    </DialogShell>
  );
}
