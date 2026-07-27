"use client";

import Image from "next/image";
import { IconPen } from "./icons";
import { useDismissableMenu } from "./use-dismissable-menu";
import { useT } from "@/lib/i18n/locale-provider";

// mm:5022:15169 — floating yellow pill (pencil + SAA icon + "/"), fixed
// bottom-right. Opens a quick-action menu stub; wiring the actions
// themselves is out of scope for this UI pass.
export default function WidgetButton() {
  const t = useT("common");
  const { isOpen, setIsOpen, containerRef } = useDismissableMenu<HTMLDivElement>();

  return (
    <div ref={containerRef} className="fixed bottom-8 right-5 z-40">
      {isOpen && (
        <div
          role="menu"
          className="absolute bottom-full right-0 mb-3 w-56 overflow-hidden rounded bg-[#0B0F12] py-2 shadow-lg"
        >
          <button
            type="button"
            role="menuitem"
            className="block w-full cursor-pointer px-4 py-2 text-left text-sm font-bold text-white transition-colors hover:bg-white/10 [font-family:var(--font-montserrat)]"
          >
            {t("widget.writeKudos")}
          </button>
          <button
            type="button"
            role="menuitem"
            className="block w-full cursor-pointer px-4 py-2 text-left text-sm font-bold text-white transition-colors hover:bg-white/10 [font-family:var(--font-montserrat)]"
          >
            {t("widget.saaRules")}
          </button>
        </div>
      )}

      {/* mm:I5022:15169;214:3839 */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={t("widget.ariaLabel")}
        className="flex w-[106px] items-center gap-2 rounded-full bg-[#FFEA9E] px-4 py-4 text-[#00101A] shadow-[0_4px_4px_rgba(0,0,0,0.25),0_0_6px_#FAE287] transition-transform duration-200 ease-out hover:-translate-y-0.5"
      >
        {/* mm:I5022:15169;214:3839;186:1935 */}
        <span className="flex items-center gap-2">
          <IconPen width={24} height={24} />
          <span className="[font-family:var(--font-montserrat)] text-2xl font-bold leading-8">/</span>
        </span>
        {/* mm:I5022:15169;214:3839;186:1766 */}
        <Image src="/home/icon-kudos-small.svg" alt="" width={20} height={18} />
      </button>
    </div>
  );
}
