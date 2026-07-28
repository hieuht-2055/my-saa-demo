"use client";

import Image from "next/image";
import type { PrizeRecipient } from "./kudos-data";
import { useT } from "@/lib/i18n/locale-provider";

interface PrizeRecipientsProps {
  recipients: PrizeRecipient[];
}

/**
 * mm:2940:13510 (D.3) — dark gold-bordered box listing the 10 latest Secret
 * Box winners. The list scrolls vertically with a thin visible scrollbar
 * (styled via the WebKit scrollbar pseudo-elements to match the 2px gold-grey
 * bar drawn in the design, rather than faking a static decoration).
 */
export default function PrizeRecipients({ recipients }: PrizeRecipientsProps) {
  const t = useT("kudos");

  return (
    <div className="flex w-full max-w-[422px] flex-col items-center gap-4 rounded-[17px] border border-[#998C5F] bg-[#00070C] p-6">
      {/* mm:2940:13513 (D.3.1) */}
      <h3 className="text-center [font-family:var(--font-montserrat)] text-[22px] font-bold leading-7 text-[#FFEA9E]">
        {t("prizes.title")}
      </h3>

      {recipients.length === 0 ? (
        <p className="py-8 [font-family:var(--font-montserrat)] text-base font-bold text-white/70">
          {t("prizes.empty")}
        </p>
      ) : (
        <ul className="flex max-h-96 w-full flex-col gap-4 overflow-y-auto pr-2 [&::-webkit-scrollbar-thumb]:rounded-lg [&::-webkit-scrollbar-thumb]:bg-[#999999] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-[2px]">
          {/* mm:2940:13516 (D.3.2) — one row per recipient */}
          {recipients.map((recipient) => (
            <li key={recipient.id} className="flex w-full items-center gap-2">
              <Image
                src={recipient.avatar}
                alt=""
                width={64}
                height={64}
                className="h-16 w-16 shrink-0 rounded-full border-2 border-white object-cover"
              />
              <div className="flex flex-col items-start gap-0.5">
                <span className="[font-family:var(--font-montserrat)] text-[22px] font-bold leading-7 text-[#FFEA9E]">
                  {recipient.name}
                </span>
                <span className="[font-family:var(--font-montserrat)] text-base font-bold leading-6 tracking-[0.15px] text-white">
                  {recipient.prize}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
