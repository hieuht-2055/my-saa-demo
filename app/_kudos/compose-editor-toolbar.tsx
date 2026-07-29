"use client";

import { useEffect, useState, type RefObject } from "react";
import { IconLink } from "./icons";
import { IconBold, IconItalic, IconNumberList, IconQuote, IconStrikethrough } from "./compose-icons";
import { useT } from "@/lib/i18n/locale-provider";

interface ComposeEditorToolbarProps {
  editorRef: RefObject<HTMLDivElement | null>;
  onAfterCommand: () => void;
}

interface PressedState {
  bold: boolean;
  italic: boolean;
  strike: boolean;
  orderedList: boolean;
}

/**
 * mm:520:9877 (C) — the six formatting controls above the editor (C.1–C.6).
 * `document.execCommand` is the simplest thing that satisfies the spec (no
 * rich-text dependency lives in this repo). Pressed state is read back via
 * `queryCommandState` on `selectionchange` so toggling reflects the caret's
 * actual formatting, not just "was this button clicked last".
 */
export default function ComposeEditorToolbar({ editorRef, onAfterCommand }: ComposeEditorToolbarProps) {
  const t = useT("kudos");
  const [pressed, setPressed] = useState<PressedState>({
    bold: false,
    italic: false,
    strike: false,
    orderedList: false,
  });
  const [linkPromptOpen, setLinkPromptOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkNewTab, setLinkNewTab] = useState(false);

  useEffect(() => {
    function syncPressed() {
      const editor = editorRef.current;
      if (!editor || !editor.contains(document.getSelection()?.anchorNode ?? null)) return;
      setPressed({
        bold: document.queryCommandState("bold"),
        italic: document.queryCommandState("italic"),
        strike: document.queryCommandState("strikeThrough"),
        orderedList: document.queryCommandState("insertOrderedList"),
      });
    }
    document.addEventListener("selectionchange", syncPressed);
    return () => document.removeEventListener("selectionchange", syncPressed);
  }, [editorRef]);

  function run(command: string, value?: string) {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    onAfterCommand();
  }

  function confirmLink() {
    const url = linkUrl.trim();
    if (!url) return;
    editorRef.current?.focus();
    document.execCommand("createLink", false, url);
    if (linkNewTab) {
      const anchorNode = document.getSelection()?.anchorNode;
      const anchor = (anchorNode instanceof Element ? anchorNode : anchorNode?.parentElement)?.closest("a");
      if (anchor) {
        anchor.setAttribute("target", "_blank");
        anchor.setAttribute("rel", "noopener noreferrer");
      }
    }
    onAfterCommand();
    setLinkPromptOpen(false);
    setLinkUrl("");
    setLinkNewTab(false);
  }

  const BUTTON_CLASS = (active: boolean) =>
    `flex h-10 w-14 items-center justify-center border border-[#998C5F] text-[#00101A] transition-colors duration-200 ${
      active ? "bg-[rgba(255,234,158,0.4)]" : "bg-transparent hover:bg-[rgba(255,234,158,0.2)]"
    }`;

  return (
    <div className="relative flex w-full">
      {/* mm:520:9881 (C.1) — first button carries the group's top-left radius */}
      <button
        type="button"
        aria-pressed={pressed.bold}
        aria-label={t("compose.toolbarBoldAria")}
        onClick={() => run("bold")}
        className={`${BUTTON_CLASS(pressed.bold)} rounded-tl-lg`}
      >
        <IconBold width={24} height={24} />
      </button>
      {/* mm:662:11119 (C.2) */}
      <button
        type="button"
        aria-pressed={pressed.italic}
        aria-label={t("compose.toolbarItalicAria")}
        onClick={() => run("italic")}
        className={`${BUTTON_CLASS(pressed.italic)} -ml-px`}
      >
        <IconItalic width={24} height={24} />
      </button>
      {/* mm:662:11213 (C.3) */}
      <button
        type="button"
        aria-pressed={pressed.strike}
        aria-label={t("compose.toolbarStrikethroughAria")}
        onClick={() => run("strikeThrough")}
        className={`${BUTTON_CLASS(pressed.strike)} -ml-px`}
      >
        <IconStrikethrough width={24} height={24} />
      </button>
      {/* mm:662:10376 (C.4) */}
      <button
        type="button"
        aria-pressed={pressed.orderedList}
        aria-label={t("compose.toolbarNumberListAria")}
        onClick={() => run("insertOrderedList")}
        className={`${BUTTON_CLASS(pressed.orderedList)} -ml-px`}
      >
        <IconNumberList width={24} height={24} />
      </button>
      {/* mm:662:10507 (C.5) — opens the URL prompt (TC ID-31) */}
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={linkPromptOpen}
        aria-label={t("compose.toolbarLinkAria")}
        onClick={() => setLinkPromptOpen((v) => !v)}
        className={`${BUTTON_CLASS(linkPromptOpen)} -ml-px`}
      >
        <IconLink width={24} height={24} />
      </button>
      {/* mm:662:10647 (C.6) */}
      <button
        type="button"
        aria-label={t("compose.toolbarQuoteAria")}
        onClick={() => run("formatBlock", "blockquote")}
        className={`${BUTTON_CLASS(false)} -ml-px`}
      >
        <IconQuote width={24} height={24} />
      </button>

      {linkPromptOpen && (
        <div
          role="dialog"
          aria-label={t("compose.linkPromptLabel")}
          // Escape closes only this prompt. Stopping it matters: the surrounding
          // modal listens for Escape on `document`, so letting it through would
          // close the whole dialog and discard the draft. Enter confirms, which is
          // what a one-field prompt should do.
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.stopPropagation();
              setLinkPromptOpen(false);
              return;
            }
            if (event.key === "Enter") {
              event.preventDefault();
              event.stopPropagation();
              confirmLink();
            }
          }}
          className="absolute left-0 top-12 z-30 flex w-72 flex-col gap-3 rounded-lg border border-[#998C5F] bg-white p-4 shadow-lg"
        >
          <label htmlFor="compose-link-url" className="text-sm font-bold text-[#00101A]">
            {t("compose.linkPromptLabel")}
          </label>
          <input
            id="compose-link-url"
            type="url"
            autoFocus
            value={linkUrl}
            onChange={(event) => setLinkUrl(event.target.value)}
            placeholder={t("compose.linkPromptPlaceholder")}
            className="rounded border border-[#998C5F] px-3 py-2 text-sm text-[#00101A] focus:outline-none"
          />
          <label className="flex items-center gap-2 text-sm text-[#00101A]">
            <input type="checkbox" checked={linkNewTab} onChange={(event) => setLinkNewTab(event.target.checked)} />
            {t("compose.linkPromptOpenNewTab")}
          </label>
          <button
            type="button"
            onClick={confirmLink}
            className="rounded bg-[#FFEA9E] px-3 py-2 text-sm font-bold text-[#00101A] transition-opacity hover:brightness-105"
          >
            {t("compose.linkPromptConfirm")}
          </button>
        </div>
      )}
    </div>
  );
}
