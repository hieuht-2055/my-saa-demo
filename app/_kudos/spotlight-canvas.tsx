"use client";

import { useRef, useState, type PointerEvent, type WheelEvent } from "react";
import Link from "next/link";
import type { SpotlightNode } from "./kudos-data";
import { useT } from "@/lib/i18n/locale-provider";

interface SpotlightCanvasProps {
  nodes: SpotlightNode[];
  query: string;
  panZoomEnabled: boolean;
}

interface Transform {
  x: number;
  y: number;
  scale: number;
}

const IDENTITY: Transform = { x: 0, y: 0, scale: 1 };
const MIN_SCALE = 1;
const MAX_SCALE = 3;

/** Strips Vietnamese diacritics so the search match is accent-insensitive. */
function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

/**
 * mm:2940:14174 (B.7) word-cloud layer — every Sunner name scattered at its
 * design `xPct`/`yPct`, dimmed or highlighted against the search query, with
 * a hover tooltip and click-through to `/kudos/{kudosId}`. When the caller
 * flips `panZoomEnabled` on, this layer also answers to drag-to-pan and
 * wheel-to-zoom. The parent resets the transform by remounting this
 * component (a fresh `key` per toggle) rather than reacting to its own prop
 * change in an effect — keeps state resets a plain render, not a side effect.
 */
export default function SpotlightCanvas({ nodes, query, panZoomEnabled }: SpotlightCanvasProps) {
  const t = useT("kudos");
  const [transform, setTransform] = useState<Transform>(IDENTITY);
  const draggingRef = useRef<{ startX: number; startY: number; origin: Transform } | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const normalizedQuery = query.trim() ? normalize(query.trim()) : null;

  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    if (!panZoomEnabled) return;
    draggingRef.current = { startX: e.clientX, startY: e.clientY, origin: transform };
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    if (!panZoomEnabled || !draggingRef.current) return;
    const { startX, startY, origin } = draggingRef.current;
    setTransform({
      ...origin,
      x: origin.x + (e.clientX - startX),
      y: origin.y + (e.clientY - startY),
    });
  }

  function onPointerUp() {
    draggingRef.current = null;
  }

  function onWheel(e: WheelEvent<HTMLDivElement>) {
    if (!panZoomEnabled) return;
    e.preventDefault();
    setTransform((prev) => ({
      ...prev,
      scale: Math.min(MAX_SCALE, Math.max(MIN_SCALE, prev.scale - e.deltaY * 0.001)),
    }));
  }

  if (nodes.length === 0) {
    return (
      <p className="flex h-full w-full items-center justify-center [font-family:var(--font-montserrat)] text-base font-bold text-white/70">
        {t("spotlight.empty")}
      </p>
    );
  }

  return (
    <div
      className={`absolute inset-0 ${panZoomEnabled ? "cursor-grab active:cursor-grabbing" : ""}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      onWheel={onWheel}
    >
      <div
        className="relative h-full w-full transition-transform duration-100 ease-out"
        style={{ transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})` }}
      >
        {nodes.map((node) => {
          const matches = normalizedQuery ? normalize(node.name).includes(normalizedQuery) : false;
          const dimmed = normalizedQuery !== null && !matches;

          return (
            <div
              key={node.id}
              className="group absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${node.xPct}%`, top: `${node.yPct}%` }}
              onMouseEnter={() => setHoveredId(node.id)}
              onMouseLeave={() => setHoveredId((id) => (id === node.id ? null : id))}
            >
              <Link
                href={`/kudos/${node.kudosId}`}
                style={{ fontSize: node.fontSize }}
                className={`whitespace-nowrap [font-family:var(--font-montserrat)] font-bold transition-opacity duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FFEA9E] ${
                  matches ? "text-[#D4271D]" : "text-white"
                } ${dimmed ? "opacity-20" : "opacity-100"}`}
              >
                {node.name}
              </Link>

              {hoveredId === node.id && (
                <div className="pointer-events-none absolute left-1/2 top-full z-10 mt-1 -translate-x-1/2 whitespace-nowrap rounded bg-[#00070C] px-2 py-1 text-xs font-bold text-white shadow-lg">
                  {node.name} · {t("spotlight.receivedAt")} {node.receivedAt}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
