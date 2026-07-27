"use client";

import { IconUserProfile } from "./icons";
import { useDismissableMenu } from "./use-dismissable-menu";
import { useT } from "@/lib/i18n/locale-provider";

interface AccountMenuProps {
  userEmail: string | null;
  isAdmin: boolean;
  onSignOut: () => void;
}

// mm:I2167:9091;186:1597 — avatar button. Opens Profile / Sign out / (Admin
// Dashboard, admin-only) on click; closes on outside click / Escape.
export default function AccountMenu({ userEmail, isAdmin, onSignOut }: AccountMenuProps) {
  const t = useT("common");
  const { isOpen, setIsOpen, containerRef } = useDismissableMenu<HTMLDivElement>();

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={t("account.ariaLabel")}
        className="flex h-10 w-10 items-center justify-center rounded border border-[#998C5F] text-white transition-colors hover:bg-white/10"
      >
        <IconUserProfile width={24} height={24} />
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 top-full z-10 mt-2 w-56 overflow-hidden rounded bg-[#0B0F12] py-2 shadow-lg"
        >
          {userEmail && (
            <p className="truncate px-4 py-2 text-xs text-white/60 [font-family:var(--font-montserrat)]">
              {userEmail}
            </p>
          )}
          {/* INTEGRATION POINT (Track B): route to real profile page */}
          <a
            href="/profile"
            role="menuitem"
            className="block px-4 py-2 text-left text-sm font-bold text-white transition-colors hover:bg-white/10 [font-family:var(--font-montserrat)]"
          >
            {t("account.profile")}
          </a>
          {isAdmin && (
            // INTEGRATION POINT (Track B): route to real admin dashboard
            <a
              href="/admin"
              role="menuitem"
              className="block px-4 py-2 text-left text-sm font-bold text-white transition-colors hover:bg-white/10 [font-family:var(--font-montserrat)]"
            >
              {t("account.adminDashboard")}
            </a>
          )}
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setIsOpen(false);
              onSignOut();
            }}
            className="block w-full cursor-pointer px-4 py-2 text-left text-sm font-bold text-white transition-colors hover:bg-white/10 [font-family:var(--font-montserrat)]"
          >
            {t("account.signOut")}
          </button>
        </div>
      )}
    </div>
  );
}
