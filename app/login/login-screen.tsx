"use client";

import { useState } from "react";
import { montserrat, montserratAlternates } from "./fonts";
import { signInWithGoogle } from "@/lib/supabase/sign-in-with-google";
import LoginHeader from "./login-header";
import HeroContent from "./hero-content";
import LoginFooter from "./login-footer";

export type Locale = "vi" | "en";

const AUTH_ERROR_MESSAGE = "Đăng nhập không thành công. Vui lòng thử lại.";

interface LoginScreenProps {
  /** Seeded from `/login?error=auth` when the OAuth callback failed. */
  initialError?: string | null;
}

/**
 * Login screen — owns presentational/local state (loading, error, locale)
 * and drives the Supabase Google OAuth flow.
 */
export default function LoginScreen({ initialError = null }: LoginScreenProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(initialError);
  const [locale, setLocale] = useState<Locale>("vi");

  async function handleGoogleLogin() {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      // On success the browser navigates to Google, so control does not return.
      await signInWithGoogle("/");
    } catch {
      setErrorMessage(AUTH_ERROR_MESSAGE);
      setIsLoading(false);
    }
  }

  function onLocaleChange(next: Locale) {
    // i18n deferred (see clarifications.md — static VN). Selector is presentational.
    setLocale(next);
  }

  return (
    <div
      className={`${montserrat.variable} ${montserratAlternates.variable} flex min-h-screen w-full flex-col bg-[#00101A]`}
    >
      <LoginHeader locale={locale} onLocaleChange={onLocaleChange} />
      <HeroContent
        isLoading={isLoading}
        errorMessage={errorMessage}
        onLoginClick={handleGoogleLogin}
      />
      <LoginFooter />
    </div>
  );
}
