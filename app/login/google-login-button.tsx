"use client";

import Image from "next/image";
import { useT } from "@/lib/i18n/locale-provider";

interface GoogleLoginButtonProps {
  isLoading: boolean;
  onClick: () => void;
}

/**
 * Presentational Google sign-in button. The click handler is supplied by the
 * parent (login-screen.tsx), which drives the Supabase OAuth call.
 */
export default function GoogleLoginButton({
  isLoading,
  onClick,
}: GoogleLoginButtonProps) {
  const t = useT("login");

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLoading}
      aria-busy={isLoading}
      className="flex w-[305px] cursor-pointer items-center gap-2 rounded-lg bg-[#FFEA9E] px-6 py-4 shadow-none transition-shadow duration-200 ease-out hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
    >
      {isLoading ? (
        <span
          aria-hidden="true"
          className="h-6 w-6 shrink-0 animate-spin rounded-full border-2 border-[#00101A]/30 border-t-[#00101A]"
        />
      ) : (
        <Image
          src="/login/google-icon.svg"
          alt=""
          width={24}
          height={24}
          className="shrink-0"
        />
      )}
      <span className="[font-family:var(--font-montserrat)] text-[22px] font-bold leading-[28px] text-[#00101A]">
        {isLoading ? t("googleLoading") : t("googleIdle")}
      </span>
    </button>
  );
}
