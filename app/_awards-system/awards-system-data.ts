export interface AwardPrize {
  /** e.g. "7.000.000 VNĐ" */
  amount: string;
  /** Key suffix under the `prize.*` i18n namespace (e.g. "perAward" → t("prize.perAward")). */
  noteKey: "perAward" | "perIndividual" | "perTeam";
}

export interface AwardDetailData {
  slug: string;
  /** Decorative wordmark image layered over the shared glowing-ring photo. */
  nameImage: string;
  nameImageWidth: number;
  nameImageHeight: number;
  quantityValue: string;
  /** Key suffix under the `unit.*` i18n namespace (e.g. "caNhan" → t("unit.caNhan")). */
  quantityUnitKey: "caNhan" | "taThe" | "caNhanHoacTapThe";
  /** One entry for most awards; Signature carries two, joined by "Hoặc". */
  prizes: AwardPrize[];
  /** Which side the ring photo sits on — the design alternates per row. */
  imageSide: "left" | "right";
}

// mm:313:8466 (D.Danh sách giải thưởng) — the 6 award categories, structural
// data only (title/description/unit words/prize notes/nav labels live in the
// `awards` i18n namespace, keyed by slug — see lib/i18n/messages/{vi,en}/awards.ts).
//
// NOTE: `nameImage` for signature-2025-creator/mvp intentionally points at
// `/awards/` rather than `/home/`: the home page's
// `award-name-signature-creator.png` / `award-name-mvp.png` files have their
// pixel content swapped (verified by inspection — the "signature" file shows
// an "MVP" wordmark and vice versa). That's a pre-existing bug in the home
// asset set, out of scope to fix here, so this screen carries its own
// correctly-matched copies instead of propagating the mismatch.
export const AWARD_DETAILS: AwardDetailData[] = [
  {
    slug: "top-talent",
    nameImage: "/home/award-name-top-talent.png",
    nameImageWidth: 222,
    nameImageHeight: 36,
    quantityValue: "10",
    quantityUnitKey: "caNhan",
    prizes: [{ amount: "7.000.000 VNĐ", noteKey: "perAward" }],
    imageSide: "left",
  },
  {
    slug: "top-project",
    nameImage: "/home/award-name-top-project.png",
    nameImageWidth: 232,
    nameImageHeight: 35,
    quantityValue: "02",
    quantityUnitKey: "taThe",
    prizes: [{ amount: "15.000.000 VNĐ", noteKey: "perAward" }],
    imageSide: "right",
  },
  {
    slug: "top-project-leader",
    nameImage: "/home/award-name-top-project-leader.png",
    nameImageWidth: 232,
    nameImageHeight: 64,
    quantityValue: "03",
    quantityUnitKey: "caNhan",
    prizes: [{ amount: "7.000.000 VNĐ", noteKey: "perAward" }],
    imageSide: "left",
  },
  {
    slug: "best-manager",
    nameImage: "/home/award-name-best-manager.png",
    nameImageWidth: 232,
    nameImageHeight: 30,
    quantityValue: "01",
    quantityUnitKey: "caNhan",
    prizes: [{ amount: "10.000.000 VNĐ", noteKey: "perAward" }],
    imageSide: "right",
  },
  {
    slug: "signature-2025-creator",
    nameImage: "/awards/award-name-signature-creator.png",
    nameImageWidth: 232,
    nameImageHeight: 54,
    quantityValue: "01",
    quantityUnitKey: "caNhanHoacTapThe",
    prizes: [
      { amount: "5.000.000 VNĐ", noteKey: "perIndividual" },
      { amount: "8.000.000 VNĐ", noteKey: "perTeam" },
    ],
    imageSide: "left",
  },
  {
    slug: "mvp",
    nameImage: "/awards/award-name-mvp.png",
    nameImageWidth: 116,
    nameImageHeight: 52,
    quantityValue: "01",
    quantityUnitKey: "caNhan",
    prizes: [{ amount: "15.000.000 VNĐ", noteKey: "perAward" }],
    imageSide: "right",
  },
];

// mm:313:8459 (mms_C_Menu list) — nav slugs, in design order. Line up 1:1
// with AWARD_DETAILS so the nav can scroll-spy against the same anchors.
// Labels come from the `nav.<slug>` i18n keys (AwardsNav resolves them via
// useT), so this stays a plain structural list.
export const AWARD_NAV_SLUGS = AWARD_DETAILS.map(({ slug }) => slug);
