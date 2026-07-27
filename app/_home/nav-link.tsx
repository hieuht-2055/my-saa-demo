import Link from "next/link";

interface NavLinkProps {
  href: string;
  label: string;
  active?: boolean;
}

/**
 * Header/footer nav item. Active variant (mm:I2167:9091;186:1579) shows the
 * yellow underline + glow; inactive items (mm:I2167:9091;186:1593) pick up
 * the same treatment on hover/focus so the interaction reads consistently.
 */
export default function NavLink({ href, label, active = false }: NavLinkProps) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`[font-family:var(--font-montserrat)] flex items-center gap-1 rounded p-4 text-sm font-bold leading-5 tracking-[0.1px] transition-colors duration-200 ${
        active
          ? "border-b border-[#FFEA9E] text-[#FFEA9E] [text-shadow:0_4px_4px_rgba(0,0,0,0.25),0_0_6px_#FAE287]"
          : "text-white hover:text-[#FFEA9E]"
      }`}
    >
      {label}
    </Link>
  );
}
