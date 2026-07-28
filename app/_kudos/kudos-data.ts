// mm:2940:13431 (Sun* Kudos - Live board) — structural/mock data for the Kudos
// board. Proper nouns, counts and image paths live here; every UI label lives
// in the `kudos` i18n namespace (lib/i18n/messages/{vi,en}/kudos.ts).
//
// Content is taken verbatim from the Figma design — no invented copy. There is
// no `kudos` table in Supabase yet (auth-only project), so this module is the
// board's data source until the API lands.

/** Rank badge artwork shipped in `public/kudos/` (mm:...;3106:17694). */
export type HeroBadge = "new-hero" | "rising-hero" | "super-hero" | "legend-hero";

export interface Sunner {
  id: string;
  name: string;
  /** Organisational unit shown under the name, e.g. "CEVC10". */
  department: string;
  avatar: string;
  badge: HeroBadge;
  /** "Hoa thị" count — 1/2/3 map to the 10/20/50-kudos tiers (spec B.3.2). */
  stars: 1 | 2 | 3;
}

export interface KudosPost {
  id: string;
  senderId: string;
  receiverId: string;
  /** Pre-formatted "HH:mm - MM/DD/YYYY" exactly as the design renders it. */
  postedAt: string;
  /** Category strip above the message, e.g. "IDOL GIỚI TRẺ". */
  groupTag: string;
  content: string;
  /** Without the leading "#". */
  hashtags: string[];
  /** Attachment thumbnails, max 5 rendered (spec C.3.6). */
  images: string[];
  likeCount: number;
  /** Seeds the heart's active state; toggled client-side. */
  likedByViewer: boolean;
  /** True when the viewer sent it — the heart is disabled (spec C.4.1). */
  sentByViewer: boolean;
}

export interface PrizeRecipient {
  id: string;
  name: string;
  avatar: string;
  /** Prize description, e.g. "Nhận được 1 áo phông SAA". */
  prize: string;
}

/** One name on the Spotlight word cloud (mm:2940:14174). */
export interface SpotlightNode {
  id: string;
  name: string;
  kudosId: string;
  /** "HH:mmAM/PM" as shown in the hover tooltip + activity ticker. */
  receivedAt: string;
  /** Percentage position inside the canvas. */
  xPct: number;
  yPct: number;
  /** Font size in px — the cloud mixes three weights. */
  fontSize: number;
}

export interface ViewerStats {
  kudosReceived: number;
  kudosSent: number;
  heartsReceived: number;
  /** Set on admin-configured special days — renders the "x2" flame badge. */
  heartMultiplier: 1 | 2;
  secretBoxOpened: number;
  secretBoxUnopened: number;
}

const SENDERS: Sunner[] = [
  { id: "s1", name: "Huỳnh Dương Xuân Nhật", department: "CEVC10", avatar: "/kudos/avatar-sender.png", badge: "new-hero", stars: 1 },
  { id: "s2", name: "Huỳnh Dương Xuân Nhật", department: "CEVC10", avatar: "/kudos/avatar-sender.png", badge: "rising-hero", stars: 2 },
  { id: "s3", name: "Huỳnh Dương Xuân Nhật", department: "CEVC10", avatar: "/kudos/avatar-sender.png", badge: "super-hero", stars: 3 },
];

const RECEIVER: Sunner = {
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

export function findSunner(id: string): Sunner | undefined {
  return SUNNERS.find((s) => s.id === id);
}

const KUDOS_MESSAGE =
  "Cảm ơn người em bình thường nhưng phi thường :D Cảm ơn sự chăm chỉ, cẩn mẫn của em đã tạo động lực rất nhiều cho team, để luôn nhắc mình luôn phải nỗ lực hơn nữa trong công việc. <3 và cuộc sống";

const GALLERY = Array.from({ length: 5 }, () => "/kudos/sample-photo.png");

const HASHTAGS = ["Dedicated", "Inspring", "Dedicated", "Inspring", "Dedicated", "Inspring"];

export const DEPARTMENTS = ["CEVC10", "CECV11", "Marketing", "HR", "BSD"] as const;

/** Distinct hashtags offered by the B.1.1 filter dropdown. */
export const HASHTAG_OPTIONS = ["Dedicated", "Inspring", "Teamwork", "Ownership", "Creative"] as const;

/** Category strips used by the group-tag row (mm:...;2234:33038). */
export const GROUP_TAGS = ["IDOL GIỚI TRẺ", "CHIẾN THẦN DEADLINE", "NGƯỜI TRUYỀN LỬA"] as const;

function buildPosts(count: number, idPrefix: string): KudosPost[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `${idPrefix}-${i + 1}`,
    senderId: SENDERS[i % SENDERS.length].id,
    receiverId: RECEIVER.id,
    postedAt: "10:00 - 10/30/2025",
    groupTag: GROUP_TAGS[i % GROUP_TAGS.length],
    content: KUDOS_MESSAGE,
    hashtags: HASHTAGS,
    images: GALLERY,
    likeCount: 1000,
    likedByViewer: false,
    // Every 4th post is the viewer's own — exercises the disabled heart rule.
    sentByViewer: i % 4 === 3,
  }));
}

/** Top-5 most-hearted kudos of the event (spec B.2 — carousel is exactly 5). */
export const HIGHLIGHT_KUDOS: KudosPost[] = buildPosts(5, "hl");

/** The ALL KUDOS feed. Paged client-side to emulate the infinite scroll. */
export const ALL_KUDOS: KudosPost[] = buildPosts(12, "kd");

export const VIEWER_STATS: ViewerStats = {
  kudosReceived: 25,
  kudosSent: 25,
  heartsReceived: 25,
  heartMultiplier: 2,
  secretBoxOpened: 25,
  secretBoxUnopened: 25,
};

export const PRIZE_RECIPIENTS: PrizeRecipient[] = Array.from({ length: 10 }, (_, i) => ({
  id: `pz-${i + 1}`,
  name: "Huỳnh Dương Xuân",
  avatar: "/kudos/avatar-sunner.png",
  prize: "Nhận được 1 áo phông SAA",
}));

/** Total kudos in the system, shown as the Spotlight headline (spec B.7.1). */
export const TOTAL_KUDOS = 388;

const SPOTLIGHT_NAMES = [
  "Đỗ hoàng Hiệp",
  "Dương thùy An",
  "Mai phượng Thùy",
  "Nguyễn Văn Quy",
  "Lê Kiều Trang",
  "Nguyễn Bá Chúc",
  "Nguyễn Hoàng Linh",
];

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
  const name = SPOTLIGHT_NAMES[i % SPOTLIGHT_NAMES.length];
  const r = seeded(i * 7 + 1);
  const r2 = seeded(i * 13 + 5);
  const r3 = seeded(i * 29 + 11);
  return {
    id: `sp-${i + 1}`,
    name,
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
