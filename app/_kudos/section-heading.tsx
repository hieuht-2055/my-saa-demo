import type { ReactNode } from "react";

interface SectionHeadingProps {
  subtitle: string;
  title: string;
  /** Rendered at the right end of the title row (e.g. the two filter buttons). */
  action?: ReactNode;
}

/**
 * mm:2940:13452 (B.1) — reused verbatim for B.6 (2940:13476) and C.1 (2940:14221):
 * a small white subtitle, a thin gold-adjacent divider, then the big gold
 * section title with optional trailing actions on the same row.
 *
 * No horizontal inset of its own — `kudos-screen.tsx` already renders this
 * inside a padded `<section>` shell, so adding a second `mx-auto`/`px-*` here
 * would double the gutter and throw off centering.
 */
export default function SectionHeading({ subtitle, title, action }: SectionHeadingProps) {
  return (
    <div className="flex w-full flex-col gap-4">
      {/* mm:2940:13454 */}
      <p className="[font-family:var(--font-montserrat)] text-2xl font-bold leading-8 text-white">
        {subtitle}
      </p>

      {/* mm:2940:13455 */}
      <div className="h-px w-full bg-[#2E3940]" />

      {/* mm:2940:13456 */}
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="[font-family:var(--font-montserrat)] text-[clamp(32px,5vw,57px)] font-bold leading-tight tracking-[-0.25px] text-[#FFEA9E]">
          {title}
        </h2>
        {action && <div className="flex flex-wrap items-center gap-2">{action}</div>}
      </div>
    </div>
  );
}
