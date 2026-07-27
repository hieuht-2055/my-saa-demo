export interface AwardCardData {
  slug: string;
  title: string;
  description: string;
  /** Decorative wordmark image layered over the shared award photo. */
  nameImage: string;
}

// mm:5005:14974 — the 6 award categories. Copy is exactly what the Figma
// design carries (including the repeated placeholder description on the
// last three cards — not invented, that's what the design has today).
export const AWARD_CARDS: AwardCardData[] = [
  {
    slug: "top-talent",
    title: "Top Talent",
    description: "Vinh danh top cá nhân xuất sắc trên mọi phương diện",
    nameImage: "/home/award-name-top-talent.png",
  },
  {
    slug: "top-project",
    title: "Top Project",
    description:
      "Vinh danh dự án xuất sắc trên mọi phương diện, dự án có doanh thu nổi bật",
    nameImage: "/home/award-name-top-project.png",
  },
  {
    slug: "top-project-leader",
    title: "Top Project Leader",
    description: "Vinh danh người quản lý truyền cảm hứng và dẫn dắt dự án bứt phá, ",
    nameImage: "/home/award-name-top-project-leader.png",
  },
  {
    slug: "best-manager",
    title: "Best Manager",
    description: "Vinh danh người quản lý có năng lực quản lý tốt, dẫn dắt đội nhóm",
    nameImage: "/home/award-name-best-manager.png",
  },
  {
    slug: "signature-2025-creator",
    title: "Signature 2025 - Creator",
    description: "Vinh danh người quản lý có năng lực quản lý tốt, dẫn dắt đội nhóm",
    nameImage: "/home/award-name-signature-creator.png",
  },
  {
    slug: "mvp",
    title: "MVP (Most Valuable Person)",
    description: "Vinh danh người quản lý có năng lực quản lý tốt, dẫn dắt đội nhóm",
    nameImage: "/home/award-name-mvp.png",
  },
];
