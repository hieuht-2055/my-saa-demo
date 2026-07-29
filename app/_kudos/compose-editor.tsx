"use client";

import { useEffect, useRef, useState } from "react";
import ComposeEditorToolbar from "./compose-editor-toolbar";
import ComposeMentionPopup from "./compose-mention-popup";
import type { Sunner } from "./kudos-data";
import { MAX_CONTENT } from "./kudos-compose-types";
import { useT } from "@/lib/i18n/locale-provider";

interface ComposeEditorProps {
  content: string;
  onChange: (html: string) => void;
  /** "required" (empty) or "max" (over `MAX_CONTENT`) — see `ComposeErrors`. */
  error?: "required" | "max";
  searchMentions: (query: string) => Sunner[];
  id: string;
}

interface MentionState {
  query: string;
  results: Sunner[];
}

/** Text immediately before the caret, inside the current text node only —
 * enough to detect an in-progress "@query" mention token (spec D / TC ID-12). */
function textBeforeCaret(): { node: Text; text: string } | null {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0 || !selection.isCollapsed) return null;
  const node = selection.anchorNode;
  if (!node || node.nodeType !== Node.TEXT_NODE) return null;
  return { node: node as Text, text: (node.textContent ?? "").slice(0, selection.anchorOffset) };
}

/**
 * mm:520:9886 (D) + mm:520:9887 (D.1) — the rich-text body. A `contentEditable`
 * div is the simplest thing that satisfies the spec (no rich-text dependency
 * lives in this repo); the toolbar drives it via `document.execCommand`.
 * Initial HTML is written once via a ref-guard so React never re-writes
 * `innerHTML` under the user's caret while they type.
 */
export default function ComposeEditor({ content, onChange, error, searchMentions, id }: ComposeEditorProps) {
  const t = useT("kudos");
  const editorRef = useRef<HTMLDivElement>(null);
  const hydrated = useRef(false);
  const [charCount, setCharCount] = useState(0);
  const [mention, setMention] = useState<MentionState | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (hydrated.current || !editorRef.current) return;
    editorRef.current.innerHTML = content;
    setCharCount(editorRef.current.textContent?.length ?? 0);
    hydrated.current = true;
  }, [content]);

  function pushChange() {
    const editor = editorRef.current;
    if (!editor) return;
    onChange(editor.innerHTML);
    setCharCount(editor.textContent?.length ?? 0);
  }

  function onInput() {
    pushChange();
    const before = textBeforeCaret();
    const match = before?.text.match(/(?:^|\s)@([\p{L}\p{N}_]{0,50})$/u);
    setMention(match ? { query: match[1], results: searchMentions(match[1]) } : null);
    setActiveIndex(0);
  }

  /**
   * Keyboard operation of the mention list (TC ID-12/13/33 are keyboard flows, and
   * the caret never leaves this element while it is open).
   *
   * Escape is stopped rather than allowed to bubble: the modal listens for it on
   * `document` to close itself, so without this, dismissing the mention list would
   * throw away the whole draft.
   */
  function onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const options = mention?.results ?? [];
    if (!options.length) return;

    if (event.key === "Escape") {
      event.stopPropagation();
      setMention(null);
      return;
    }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const step = event.key === "ArrowDown" ? 1 : -1;
      setActiveIndex((current) => (current + step + options.length) % options.length);
      return;
    }
    if (event.key === "Enter" || event.key === "Tab") {
      // Enter would otherwise break the line underneath the open list.
      event.preventDefault();
      insertMention(options[Math.min(activeIndex, options.length - 1)]);
    }
  }

  function insertMention(sunner: Sunner) {
    const selection = window.getSelection();
    const before = textBeforeCaret();
    if (!selection || !before || !mention) return;
    const start = before.text.length - (mention.query.length + 1);
    if (start < 0) return;
    const range = document.createRange();
    range.setStart(before.node, start);
    range.setEnd(before.node, before.text.length);
    range.deleteContents();
    const textNode = document.createTextNode(`@${sunner.name} `);
    range.insertNode(textNode);
    range.setStartAfter(textNode);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
    setMention(null);
    editorRef.current?.focus();
    pushChange();
  }

  const errorId = error ? `${id}-error` : undefined;
  const isOverLimit = charCount > MAX_CONTENT;

  return (
    <div className="flex w-full flex-col gap-1">
      <div className={`w-full border bg-white ${error ? "border-[#CF1322]" : "border-[#998C5F]"} rounded-b-lg`}>
        <ComposeEditorToolbar editorRef={editorRef} onAfterCommand={pushChange} />
        <div className="relative min-h-[160px] px-6 py-4">
          {charCount === 0 && (
            <p
              aria-hidden
              className="pointer-events-none absolute inset-x-6 top-4 [font-family:var(--font-montserrat)] text-base font-bold leading-6 tracking-[0.15px] text-[#999999]"
            >
              {t("compose.contentPlaceholder")}
            </p>
          )}
          <div
            id={id}
            ref={editorRef}
            role="textbox"
            aria-multiline="true"
            aria-invalid={!!error}
            aria-describedby={errorId}
            contentEditable
            onInput={onInput}
            onKeyDown={onKeyDown}
            suppressContentEditableWarning
            className="min-h-[140px] w-full whitespace-pre-wrap break-words [font-family:var(--font-montserrat)] text-base leading-6 text-[#00101A] focus:outline-none"
          />

          {mention && mention.results.length > 0 && (
            <ComposeMentionPopup
              results={mention.results}
              activeIndex={activeIndex}
              onPick={insertMention}
            />
          )}

          {/* Character counter — the design (mm:520:9887) draws only the
              hint text centred below the box, with no visible counter node;
              this sits unobtrusively in the editor's own corner instead of
              crowding that centred line, while still satisfying spec D.1's
              functional requirement for a counter against `MAX_CONTENT`. */}
          <p
            aria-label={t("compose.contentCounterAria")}
            className={`pointer-events-none absolute bottom-2 right-3 [font-family:var(--font-montserrat)] text-xs font-bold ${
              isOverLimit ? "text-[#CF1322]" : "text-[#999999]"
            }`}
          >
            {charCount}/{MAX_CONTENT}
          </p>
        </div>
      </div>

      {/* mm:520:9887 (D.1) — hint, centred per the design screenshot (the
          node's own 109px-symmetric margins render centred despite the raw
          style dict saying `justify-content: space-between`). */}
      <p className="w-full text-center [font-family:var(--font-montserrat)] text-sm font-bold leading-5 tracking-[0.5px] text-[#00101A]">
        {t("compose.mentionHint")}
      </p>
      {error && (
        <p id={errorId} className="[font-family:var(--font-montserrat)] text-sm font-bold text-[#CF1322]">
          {t(`compose.errors.${error}`)}
        </p>
      )}
    </div>
  );
}
