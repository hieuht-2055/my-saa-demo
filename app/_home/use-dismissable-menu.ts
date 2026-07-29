"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Shared open/close state for header dropdowns (language, account, widget
 * quick-menu) — closes on outside click and Escape, per spec. Returns a ref
 * to attach to the menu's outer wrapper.
 */
export function useDismissableMenu<T extends HTMLElement>() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<T>(null);

  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      // An open menu CONSUMES Escape. Registered in the capture phase and
      // stopping propagation on purpose: when one of these menus sits inside a
      // modal, the dialog also listens for Escape on `document` to close itself.
      // Both listeners are on the same node, so ordering — not bubbling — decides
      // who wins, and the dialog's is registered first. Capturing here runs
      // before its bubble-phase handler and keeps Escape from dismissing the
      // whole dialog (and discarding a draft) when the user only meant to shut
      // this dropdown.
      event.stopPropagation();
      setIsOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown, true);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [isOpen]);

  return { isOpen, setIsOpen, containerRef };
}
