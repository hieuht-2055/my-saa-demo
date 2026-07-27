import Image from "next/image";
import Link from "next/link";
import AccountMenu from "./account-menu";
import LanguageMenu from "./language-menu";
import NavLink from "./nav-link";
import NotificationBell from "./notification-bell";
import type { Locale } from "./home-screen";

interface SiteHeaderProps {
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  userEmail: string | null;
  hasUnreadNotifications: boolean;
  onNotificationClick: () => void;
  onSignOut: () => void;
}

const NAV_ITEMS = [
  { href: "/", label: "About SAA 2025", active: true },
  { href: "/awards", label: "Award Information", active: false },
  { href: "/kudos", label: "Sun* Kudos", active: false },
];

// mm:2167:9091 — sticky translucent header. Bell + avatar only render when
// authenticated (INTEGRATION POINT: Track B supplies real auth state).
export default function SiteHeader({
  locale,
  onLocaleChange,
  isAuthenticated,
  isAdmin,
  userEmail,
  hasUnreadNotifications,
  onNotificationClick,
  onSignOut,
}: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between gap-6 bg-[rgba(16,20,23,0.8)] px-6 py-3 backdrop-blur-sm sm:px-16 lg:px-36">
      <div className="flex items-center gap-16">
        {/* mm:I2167:9091;178:1033 */}
        <Link href="/" aria-label="Sun* Annual Awards 2025 — về đầu trang">
          <Image src="/home/logo-header.png" alt="SAA 2025" width={52} height={48} priority />
        </Link>

        {/* mm:I2167:9091;178:653 */}
        <nav className="hidden items-center gap-6 lg:flex">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
        </nav>
      </div>

      {/* mm:I2167:9091;186:1601 */}
      <div className="flex items-center gap-4">
        <LanguageMenu locale={locale} onLocaleChange={onLocaleChange} />

        {isAuthenticated && (
          <>
            <NotificationBell
              hasUnread={hasUnreadNotifications}
              onClick={onNotificationClick}
            />
            <AccountMenu userEmail={userEmail} isAdmin={isAdmin} onSignOut={onSignOut} />
          </>
        )}
      </div>
    </header>
  );
}
