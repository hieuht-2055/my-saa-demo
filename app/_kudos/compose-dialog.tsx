"use client";

import DialogShell from "./dialog-shell";
import ComposeRecipientPicker from "./compose-recipient-picker";
import ComposeTitlePicker from "./compose-title-picker";
import ComposeEditor from "./compose-editor";
import ComposeHashtagPicker from "./compose-hashtag-picker";
import ComposeImagePicker from "./compose-image-picker";
import { IconSend } from "./icons";
import { IconCancel } from "./compose-icons";
import type { KudosComposeApi } from "./kudos-compose-types";
import { useT } from "@/lib/i18n/locale-provider";

interface ComposeDialogProps {
  open: boolean;
  onClose: () => void;
  compose: KudosComposeApi;
}

const PANEL_CLASS =
  "flex w-full max-w-[752px] flex-col gap-8 rounded-3xl bg-[#FFF8E1] p-6 shadow-2xl sm:p-10 max-h-[90vh] overflow-y-auto";
const TITLE_CLASS =
  "max-w-[80%] [font-family:var(--font-montserrat)] text-[28px] font-bold leading-9 text-[#00101A] sm:text-[32px] sm:leading-10";

/**
 * mm:520:11647 (Viết KUDO) — the full "write a Kudos" modal. Presentational
 * only: every field reads from and writes through `compose` (the
 * `KudosComposeApi` from `use-kudos-compose.ts`), so this component holds no
 * draft `useState` of its own — only local UI state (which picker is open)
 * lives here, per the contract in `kudos-compose-types.ts`.
 *
 * The cream #FFF8E1 panel is this frame's own chrome, distinct from the
 * shared dark #00101A `DialogShell` default used by Secret Box — so it
 * overrides `panelClassName`/`titleClassName` and centers the title (no
 * header row is drawn in this design, just a centred heading).
 */
export default function ComposeDialog({ open, onClose, compose }: ComposeDialogProps) {
  const t = useT("kudos");
  const { draft, errors } = compose;

  function onCancel() {
    compose.reset();
    onClose();
  }

  return (
    <DialogShell
      open={open}
      title={t("compose.title")}
      onClose={onCancel}
      panelClassName={PANEL_CLASS}
      titleClassName={TITLE_CLASS}
      centerTitle
    >
      {/* mm:520:9871 (B) */}
      <ComposeRecipientPicker
        value={draft.recipient}
        onChange={compose.setRecipient}
        search={compose.searchRecipients}
        error={errors.recipient}
        id="kudos-compose-recipient"
      />

      {/* mm:1688:10448 ("Danh hiệu") — required, but spec-less: see the component. */}
      <ComposeTitlePicker
        value={draft.title}
        options={compose.titleOptions}
        onChange={compose.setTitle}
        error={errors.title}
        id="kudos-compose-title"
      />

      {/* mm:520:9874 (C/D) */}
      <ComposeEditor
        content={draft.content}
        onChange={compose.setContent}
        error={errors.content}
        searchMentions={compose.searchMentions}
        id="kudos-compose-content"
      />

      {/* mm:520:9890 (E) */}
      <ComposeHashtagPicker
        selected={draft.hashtags}
        options={compose.hashtagOptions}
        onAdd={compose.addHashtag}
        onRemove={compose.removeHashtag}
        error={errors.hashtags}
        id="kudos-compose-hashtags"
      />

      {/* mm:520:9896 (F) */}
      <ComposeImagePicker
        images={draft.images}
        onAdd={compose.addImages}
        onRemove={compose.removeImage}
        error={errors.images}
        id="kudos-compose-images"
      />

      {/* mm:520:14099 (G) — reveals the anonymous-name field when checked
          (TC ID-43/44); no MoMorph asset exists for the checked state, so the
          tick uses the panel's own gold accent rather than invented art. */}
      <div className="flex w-full flex-col gap-4">
        <label className="flex w-full items-center gap-4">
          <span className="relative inline-flex h-6 w-6 shrink-0 items-center justify-center">
            <input
              type="checkbox"
              checked={draft.anonymous}
              onChange={(event) => compose.setAnonymous(event.target.checked)}
              className="peer sr-only"
            />
            <span
              aria-hidden
              className="absolute inset-0 rounded border border-[#999999] bg-white transition-colors duration-200 peer-checked:border-[#FFEA9E] peer-checked:bg-[#FFEA9E]"
            />
            <svg
              aria-hidden
              viewBox="0 0 16 16"
              className="relative h-3 w-3 text-[#00101A] opacity-0 transition-opacity duration-200 peer-checked:opacity-100"
            >
              <path d="M2 8.5L6 12.5L14 3.5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
            </svg>
          </span>
          <span className="[font-family:var(--font-montserrat)] text-[22px] font-bold leading-7 text-[#999999]">
            {t("compose.anonymousLabel")}
          </span>
        </label>

        {draft.anonymous && (
          <div className="flex flex-col gap-2">
            <label htmlFor="kudos-compose-anon-name" className="sr-only">
              {t("compose.anonymousNameLabel")}
            </label>
            <input
              id="kudos-compose-anon-name"
              type="text"
              value={draft.anonymousName}
              onChange={(event) => compose.setAnonymousName(event.target.value)}
              placeholder={t("compose.anonymousNamePlaceholder")}
              className="h-14 w-full rounded-lg border border-[#998C5F] bg-white px-6 [font-family:var(--font-montserrat)] text-base font-bold text-[#00101A] placeholder:text-[#999999] focus:outline-none"
            />
          </div>
        )}
      </div>

      {/* mm:520:9905 (H) */}
      <div className="flex w-full flex-col items-stretch gap-4 sm:flex-row sm:justify-end sm:gap-6">
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center justify-center gap-2 rounded border border-[#998C5F] bg-[rgba(255,234,158,0.10)] px-10 py-4 [font-family:var(--font-montserrat)] text-base font-bold leading-6 tracking-[0.15px] text-[#00101A] transition-colors duration-200 hover:bg-[rgba(255,234,158,0.2)]"
        >
          {t("compose.cancel")}
          <IconCancel width={24} height={24} />
        </button>
        <button
          type="button"
          onClick={compose.submit}
          disabled={!compose.canSubmit || compose.submitting}
          className="flex items-center justify-center gap-2 rounded-lg bg-[#FFEA9E] px-4 py-4 [font-family:var(--font-montserrat)] text-[22px] font-bold leading-7 text-[#00101A] transition-opacity duration-200 hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-40 sm:w-[502px]"
        >
          {compose.submitting ? t("compose.submitting") : t("compose.submit")}
          {!compose.submitting && <IconSend width={24} height={24} />}
        </button>
      </div>
    </DialogShell>
  );
}
