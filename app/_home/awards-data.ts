export interface AwardCardData {
  slug: string;
  /** Decorative wordmark image layered over the shared award photo. */
  nameImage: string;
}

// mm:5005:14974 — the 6 award categories. Title/description copy lives in
// the `home` i18n namespace, keyed by `card.{slug}.title` / `card.{slug}
// .description` (award-card.tsx looks it up via useT). Copy is exactly what
// the Figma design carries (including the repeated placeholder description
// on the last three cards — not invented, that's what the design has today).
export const AWARD_CARDS: AwardCardData[] = [
  {
    slug: "top-talent",
    nameImage: "/home/award-name-top-talent.png",
  },
  {
    slug: "top-project",
    nameImage: "/home/award-name-top-project.png",
  },
  {
    slug: "top-project-leader",
    nameImage: "/home/award-name-top-project-leader.png",
  },
  {
    slug: "best-manager",
    nameImage: "/home/award-name-best-manager.png",
  },
  {
    slug: "signature-2025-creator",
    nameImage: "/home/award-name-signature-creator.png",
  },
  {
    slug: "mvp",
    nameImage: "/home/award-name-mvp.png",
  },
];
