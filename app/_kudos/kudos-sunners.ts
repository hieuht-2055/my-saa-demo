// The Kudos board's people: the four Sunners the cards render, the signed-in
// viewer, the wider searchable directory behind the Viết Kudo pickers, and the
// lookup they all share. Split out of `kudos-data.ts` so posts and people are two
// modules rather than one long one — and so the lookup lives with its collection.
//
// Content is taken verbatim from the Figma design — no invented copy.

// Type-only, deliberately: `kudos-data` imports the people back for its seed
// posts, so a value import here would close a module cycle and one of the two
// would evaluate against an uninitialised binding.
import type { HeroBadge, Sunner } from "./kudos-data";

/** Organisational units offered by the B.1.2 filter dropdown. */
export const DEPARTMENTS = ["CEVC10", "CECV11", "Marketing", "HR", "BSD"] as const;

export const SENDERS: Sunner[] = [
  { id: "s1", name: "Huỳnh Dương Xuân Nhật", department: "CEVC10", avatar: "/kudos/avatar-sender.png", badge: "new-hero", stars: 1 },
  { id: "s2", name: "Huỳnh Dương Xuân Nhật", department: "CEVC10", avatar: "/kudos/avatar-sender.png", badge: "rising-hero", stars: 2 },
  { id: "s3", name: "Huỳnh Dương Xuân Nhật", department: "CEVC10", avatar: "/kudos/avatar-sender.png", badge: "super-hero", stars: 3 },
];

export const RECEIVER: Sunner = {
  id: "r1",
  name: "Huỳnh Dương Xuân",
  department: "CEVC10",
  avatar: "/kudos/avatar-receiver.png",
  badge: "legend-hero",
  stars: 3,
};

export const SUNNERS: Sunner[] = [...SENDERS, RECEIVER];

/**
 * The signed-in Sunner, as far as this mock layer models one. Kudos composed on
 * the board are attributed here; once auth-linked profiles exist this is the
 * seam that reads the real session user.
 */
export const VIEWER: Sunner = SENDERS[0];

/** The seven names the design writes on the Spotlight cloud (mm:2940:14174). */
export const SPOTLIGHT_NAMES = [
  "Đỗ hoàng Hiệp",
  "Dương thùy An",
  "Mai phượng Thùy",
  "Nguyễn Văn Quy",
  "Lê Kiều Trang",
  "Nguyễn Bá Chúc",
  "Nguyễn Hoàng Linh",
];

const DIRECTORY_BADGES: HeroBadge[] = ["new-hero", "rising-hero", "super-hero", "legend-hero"];

/**
 * The searchable Sunner directory behind the Viết Kudo recipient picker (spec B)
 * and the editor's "@" mentions (spec D). The board only ever renders the four
 * Sunners above, but a picker needs a population to filter — so the names the
 * design already carries on the Spotlight cloud are promoted to full Sunners
 * here. No invented people: every name comes off the design.
 */
export const SUNNER_DIRECTORY: Sunner[] = [
  ...SUNNERS,
  ...SPOTLIGHT_NAMES.map((name, i) => ({
    id: `dir-${i + 1}`,
    name,
    department: DEPARTMENTS[i % DEPARTMENTS.length],
    avatar: "/kudos/avatar-sunner.png",
    badge: DIRECTORY_BADGES[i % DIRECTORY_BADGES.length],
    stars: ((i % 3) + 1) as 1 | 2 | 3,
  })),
];

export function findSunner(id: string): Sunner | undefined {
  return SUNNER_DIRECTORY.find((s) => s.id === id);
}
