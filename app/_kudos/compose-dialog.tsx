"use client";

import { useState } from "react";
import DialogShell from "./dialog-shell";
import { HASHTAG_OPTIONS } from "./kudos-data";
import { useT } from "@/lib/i18n/locale-provider";

interface ComposeDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (content: string, hashtags: string[]) => void;
}

/**
 * mm:2940:13449 (A.1) — the "send a thank-you" dialog opened by the compose
 * pill. The pill and its behaviour are specified on this screen; the dialog
 * itself is drawn on another frame, so this is the minimum faithful form:
 * a required message plus optional hashtags.
 *
 * The submit button stays disabled while the message is blank — an empty kudos
 * can never be submitted.
 */
export default function ComposeDialog({ open, onClose, onSubmit }: ComposeDialogProps) {
  const t = useT("kudos");
  const [content, setContent] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);

  const isEmpty = content.trim().length === 0;

  function toggleHashtag(tag: string) {
    setHashtags((prev) =>
      prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag],
    );
  }

  function handleSubmit() {
    if (isEmpty) return;
    onSubmit(content.trim(), hashtags);
    setContent("");
    setHashtags([]);
  }

  return (
    <DialogShell open={open} title={t("compose.title")} onClose={onClose}>
      <div className="flex flex-col gap-2">
        <label
          htmlFor="kudos-compose-message"
          className="[font-family:var(--font-montserrat)] text-sm font-bold leading-5 text-white"
        >
          {t("compose.messageLabel")}
        </label>
        <textarea
          id="kudos-compose-message"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder={t("compose.messagePlaceholder")}
          rows={5}
          required
          aria-describedby={isEmpty ? "kudos-compose-hint" : undefined}
          className="w-full resize-y rounded-xl border border-white/20 bg-white/5 p-4 [font-family:var(--font-montserrat)] text-base leading-6 text-white placeholder:text-white/40 focus:border-[#FFEA9E] focus:outline-none"
        />
        {isEmpty && (
          <p
            id="kudos-compose-hint"
            className="[font-family:var(--font-montserrat)] text-sm leading-5 text-[#FFEA9E]"
          >
            {t("compose.required")}
          </p>
        )}
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="[font-family:var(--font-montserrat)] text-sm font-bold leading-5 text-white">
          {t("compose.hashtagLabel")}
        </legend>
        <div className="flex flex-wrap gap-2">
          {HASHTAG_OPTIONS.map((tag) => {
            const selected = hashtags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => toggleHashtag(tag)}
                aria-pressed={selected}
                className={`rounded-full border px-3 py-1.5 [font-family:var(--font-montserrat)] text-sm font-bold leading-5 transition-colors duration-200 ${
                  selected
                    ? "border-[#FFEA9E] bg-[#FFEA9E] text-[#00101A]"
                    : "border-white/30 text-white hover:border-[#FFEA9E]"
                }`}
              >
                #{tag}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="rounded px-4 py-3 [font-family:var(--font-montserrat)] text-base font-bold leading-6 text-white transition-colors duration-200 hover:bg-white/10"
        >
          {t("compose.cancel")}
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isEmpty}
          className="rounded bg-[#FFEA9E] px-4 py-3 [font-family:var(--font-montserrat)] text-base font-bold leading-6 text-[#00101A] transition-opacity duration-200 hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {t("compose.submit")}
        </button>
      </div>
    </DialogShell>
  );
}
