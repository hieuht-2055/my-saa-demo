import Link from "next/link";
import { IconArrowUpRight } from "./icons";

interface CtaButtonProps {
  href: string;
  label: string;
  variant: "primary" | "secondary";
}

const VARIANT_CLASS: Record<CtaButtonProps["variant"], string> = {
  // mm:2167:9063 — solid yellow, dark text/icon.
  primary:
    "bg-[#FFEA9E] text-[#00101A] transition-[filter,transform] duration-200 ease-out hover:brightness-105 hover:-translate-y-0.5",
  // mm:2167:9064 — outlined, white text/icon.
  secondary:
    "border border-[#998C5F] bg-[rgba(255,234,158,0.10)] text-white transition-colors duration-200 hover:bg-[rgba(255,234,158,0.18)]",
};

// mm:2167:9062 — hero CTA pair (ABOUT AWARDS / ABOUT KUDOS).
export default function CtaButton({ href, label, variant }: CtaButtonProps) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2 rounded-lg px-6 py-4 [font-family:var(--font-montserrat)] text-[22px] font-bold leading-7 ${VARIANT_CLASS[variant]}`}
    >
      {label}
      <IconArrowUpRight width={24} height={24} />
    </Link>
  );
}
