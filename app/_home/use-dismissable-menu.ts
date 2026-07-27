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
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return { isOpen, setIsOpen, containerRef };
}
