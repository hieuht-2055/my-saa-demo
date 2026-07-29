// mm:2940:14174 (B.7 Spotlight board) — the word-cloud layout and its activity
// ticker. Split out of `kudos-data.ts` because it is generated data rather than
// content: 120 positioned nodes derived from the seven names the design carries.

import { ALL_KUDOS, type SpotlightNode } from "./kudos-data";
import { SPOTLIGHT_NAMES } from "./kudos-sunners";

/**
 * Deterministic 32-bit hash → [0,1). The cloud must lay out identically on the
 * server and the client, so `Math.random()` is off the table (hydration).
 */
function seeded(seed: number): number {
  let x = (seed * 1103515245 + 12345) & 0x7fffffff;
  x ^= x >>> 15;
  return ((x * 2654435761) & 0x7fffffff) / 0x7fffffff;
}

export const SPOTLIGHT_NODES: SpotlightNode[] = Array.from({ length: 120 }, (_, i) => {
  const r = seeded(i * 7 + 1);
  const r2 = seeded(i * 13 + 5);
  const r3 = seeded(i * 29 + 11);
  return {
    id: `sp-${i + 1}`,
    name: SPOTLIGHT_NAMES[i % SPOTLIGHT_NAMES.length],
    kudosId: ALL_KUDOS[i % ALL_KUDOS.length].id,
    receivedAt: "08:30PM",
    xPct: 2 + r * 94,
    yPct: 4 + r2 * 90,
    fontSize: r3 > 0.93 ? 20 : r3 > 0.78 ? 14 : 10,
  };
});

/** Bottom-left activity ticker inside the Spotlight canvas. */
export const SPOTLIGHT_TICKER = Array.from({ length: 6 }, (_, i) => ({
  id: `tk-${i + 1}`,
  time: "08:30PM",
  name: "Nguyễn Bá Chúc",
}));
