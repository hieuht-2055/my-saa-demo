"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ComposeImage } from "./kudos-compose-types";
import { intakeImages } from "./kudos-compose-draft";

export interface ComposeAttachments {
  images: ComposeImage[];
  /** "type" or "max" when the last pick was partly refused, else null. */
  error: "type" | "max" | null;
  add: (files: File[]) => void;
  remove: (id: string) => void;
  /** Discard: empties the list and revokes the preview URLs. */
  clear: () => void;
  /** Submit: empties the list but leaves the URLs alive for the new post. */
  detach: () => void;
}

/**
 * mm:520:11602 (Viết Kudo, spec F) — the attachment list and the object-URL
 * lifecycle that comes with it. Separate from `useKudosCompose` because this is
 * the only part of the draft that owns a browser resource: every preview URL
 * handed out here has to be revoked, on removal and on unmount alike, or the blobs
 * outlive the modal.
 */
export function useComposeAttachments(): ComposeAttachments {
  const [images, setImages] = useState<ComposeImage[]>([]);
  const [error, setError] = useState<"type" | "max" | null>(null);

  /**
   * Tracked in a ref, not derived from `images`, because the unmount cleanup must
   * see every URL ever created — including ones already dropped from the list.
   */
  const urls = useRef<string[]>([]);
  /** Monotonic, so two picks in the same millisecond cannot collide on a key. */
  const seq = useRef(0);

  useEffect(
    () => () => {
      urls.current.forEach(URL.revokeObjectURL);
      urls.current = [];
    },
    [],
  );

  /**
   * URL creation is a side effect, so it happens outside the state updater —
   * StrictMode invokes updaters twice, which would mint two URLs per file and
   * leak one of each.
   */
  const add = useCallback(
    (files: File[]) => {
      const intake = intakeImages(files, images.length);
      setError(intake.error ?? null);
      if (!intake.accepted.length) return;

      const added = intake.accepted.map((file) => {
        const url = URL.createObjectURL(file);
        urls.current.push(url);
        seq.current += 1;
        return { id: `img-${seq.current}`, url, name: file.name };
      });
      setImages((prev) => [...prev, ...added]);
    },
    [images.length],
  );

  const remove = useCallback(
    (id: string) => {
      const target = images.find((image) => image.id === id);
      if (target) {
        URL.revokeObjectURL(target.url);
        urls.current = urls.current.filter((held) => held !== target.url);
      }
      setImages((prev) => prev.filter((image) => image.id !== id));
      // Removing can only free a slot, so any ceiling complaint is now moot.
      setError(null);
    },
    [images],
  );

  /** Empties the list and revokes every URL — the "Hủy"/discard path. */
  const clear = useCallback(() => {
    urls.current.forEach(URL.revokeObjectURL);
    urls.current = [];
    setImages([]);
    setError(null);
  }, []);

  /**
   * Empties the list but keeps the URLs alive, handing ownership to whoever took
   * the draft. This is the submit path: a sent kudos carries these exact object
   * URLs into the feed, so revoking them here would blank the thumbnails on the
   * post the user just made. Forgetting them also keeps the unmount cleanup from
   * revoking them later, at the cost of holding the blobs for the page's life —
   * the right trade until attachments are uploaded and served by URL.
   */
  const detach = useCallback(() => {
    urls.current = [];
    setImages([]);
    setError(null);
  }, []);

  return { images, error, add, remove, clear, detach };
}
