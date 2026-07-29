"use client";

import { useRef } from "react";
import Image from "next/image";
import { IconCloseTiny, IconPlus } from "./compose-icons";
import { ACCEPTED_IMAGE_TYPES, MAX_IMAGES, type ComposeImage } from "./kudos-compose-types";
import { useT } from "@/lib/i18n/locale-provider";

interface ComposeImagePickerProps {
  images: ComposeImage[];
  onAdd: (files: File[]) => void;
  onRemove: (id: string) => void;
  error?: "max" | "type";
  id: string;
}

/**
 * mm:520:9896 (F) + mm:520:9897 (F.1) + mm:662:9132 (F.5) — up to
 * `MAX_IMAGES` attachments. Thumbnails are 80x80, 18px radius, #998C5F
 * border, with a small circular "x" (F.2–F.4); "+ Image" is HIDDEN — not
 * disabled — once full, and reappears after a removal (TC ID-19/38/40).
 */
export default function ComposeImagePicker({ images, onAdd, onRemove, error, id }: ComposeImagePickerProps) {
  const t = useT("kudos");
  const inputRef = useRef<HTMLInputElement>(null);
  const atMax = images.length >= MAX_IMAGES;
  const errorId = error ? `${id}-error` : undefined;

  function onFilesPicked(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    onAdd(Array.from(fileList));
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex w-full flex-wrap items-center gap-4">
        {/* mm:520:9897 (F.1) */}
        <span
          id={`${id}-label`}
          className="whitespace-nowrap [font-family:var(--font-montserrat)] text-[22px] font-bold leading-7 text-[#00101A]"
        >
          {t("compose.imageLabel")}
        </span>

        <div className="flex flex-1 flex-wrap items-center gap-4">
          {images.map((image) => (
            <div key={image.id} className="relative h-20 w-20 shrink-0 rounded-[18px] border border-[#998C5F] bg-white">
              <Image
                src={image.url}
                alt=""
                width={80}
                height={80}
                // `image.url` is a blob: object URL created client-side for
                // preview only — the server-side optimizer can never fetch
                // it, so optimization must be skipped (Next.js Image docs).
                unoptimized
                className="h-full w-full rounded-[4px] border border-[#FFEA9E] object-cover"
              />
              <button
                type="button"
                onClick={() => onRemove(image.id)}
                aria-label={`${t("compose.imageRemoveAria")} ${image.name}`}
                className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#D4271D] text-white"
              >
                <IconCloseTiny width={12} height={12} />
              </button>
            </div>
          ))}

          {!atMax && (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              aria-labelledby={`${id}-label`}
              className="flex h-12 items-center gap-1 rounded-lg border border-[#998C5F] bg-white px-2 py-1"
            >
              <IconPlus width={24} height={24} className="shrink-0 text-[#999999]" />
              <span className="flex flex-col items-start justify-center">
                <span className="[font-family:var(--font-montserrat)] text-[11px] font-bold leading-4 tracking-[0.5px] text-[#999999]">
                  {t("compose.imageLabel")}
                </span>
                <span className="[font-family:var(--font-montserrat)] text-[11px] font-bold leading-4 tracking-[0.5px] text-[#999999]">
                  {t("compose.maxCount")}
                </span>
              </span>
            </button>
          )}

          <input
            ref={inputRef}
            id={id}
            type="file"
            multiple
            accept={ACCEPTED_IMAGE_TYPES.join(",")}
            onChange={(event) => onFilesPicked(event.target.files)}
            className="sr-only"
            aria-describedby={errorId}
          />
        </div>
      </div>

      {error && (
        <p id={errorId} className="[font-family:var(--font-montserrat)] text-sm font-bold text-[#CF1322]">
          {t(`compose.errors.${error}`)}
        </p>
      )}
    </div>
  );
}
