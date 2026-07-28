"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { IconClose } from "./icons";
import { useT } from "@/lib/i18n/locale-provider";

interface KudosGalleryProps {
  images: string[];
}

/**
 * mm:I3127:21871;256:5176 (C.3.6) — up to 5 square 88×88 thumbnails in a row.
 * Clicking one opens it full-size in a lightweight modal overlay: Escape and
 * a backdrop click both dismiss it, and focus returns to the thumbnail that
 * opened it (spec: keyboard-reachable gallery).
 */
export default function KudosGallery({ images }: KudosGalleryProps) {
  const t = useT("kudos");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const shown = images.slice(0, 5);

  useEffect(() => {
    if (openIndex === null) return;
    // Move focus into the overlay on open — without this a keyboard user's
    // focus stays on the thumbnail behind the backdrop.
    closeRef.current?.focus();
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openIndex]);

  function close() {
    const idx = openIndex;
    setOpenIndex(null);
    if (idx !== null) thumbRefs.current[idx]?.focus();
  }

  if (shown.length === 0) return null;

  return (
    <div className="flex w-full flex-wrap items-center gap-4">
      {shown.map((src, i) => (
        <button
          key={`${src}-${i}`}
          ref={(el) => {
            thumbRefs.current[i] = el;
          }}
          type="button"
          onClick={() => setOpenIndex(i)}
          aria-label={t("card.openImageAria")}
          className="h-[88px] w-[88px] shrink-0 overflow-hidden rounded-[18px] border border-[#998C5F] bg-white transition-transform duration-200 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FFEA9E]"
        >
          <Image
            src={src}
            alt={t("card.imageAlt")}
            width={88}
            height={88}
            className="h-full w-full object-cover"
          />
        </button>
      ))}

      {openIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6"
          onClick={close}
        >
          <div
            className="relative max-h-[90vh] max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              aria-label={t("card.closeImageAria")}
              className="absolute -top-12 right-0 text-white transition-opacity duration-200 hover:opacity-70"
            >
              <IconClose width={32} height={32} />
            </button>
            <Image
              src={shown[openIndex]}
              alt={t("card.imageAlt")}
              width={800}
              height={800}
              className="max-h-[90vh] w-auto rounded-lg object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
