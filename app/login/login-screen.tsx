"use client";

import { useState } from "react";
import { montserrat, montserratAlternates } from "./fonts";
import { signInWithGoogle } from "@/lib/supabase/sign-in-with-google";
import { LocaleProvider, useT } from "@/lib/i18n/locale-provider";
import type { Locale } from "@/lib/i18n/config";
import LoginHeader from "./login-header";
import HeroContent from "./hero-content";
import LoginFooter from "./login-footer";

interface LoginScreenProps {
  /** True when redirected from a failed OAuth callback (`/login?error=auth`). */
  hasAuthError?: boolean;
  /** Active locale, resolved from the cookie by the route (SSR). */
  initialLocale?: Locale;
}

/**
 * Login screen — provides the i18n context, then delegates to the content
 * component (which reads translations from that context).
 */
export default function LoginScreen({ hasAuthError = false, initialLocale }: LoginScreenProps) {
  return (
    <LocaleProvider initialLocale={initialLocale}>
      <LoginScreenContent hasAuthError={hasAuthError} />
    </LocaleProvider>
  );
}

function LoginScreenContent({ hasAuthError }: { hasAuthError: boolean }) {
  const t = useT("login");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    hasAuthError ? t("authError") : null,
  );

  async function handleGoogleLogin() {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      // On success the browser navigates to Google, so control does not return.
      await signInWithGoogle("/");
    } catch {
      setErrorMessage(t("authError"));
      setIsLoading(false);
    }
  }

  return (
    <div
      className={`${montserrat.variable} ${montserratAlternates.variable} flex min-h-screen w-full flex-col bg-[#00101A]`}
    >
      <LoginHeader />
      <HeroContent
        isLoading={isLoading}
        errorMessage={errorMessage}
        onLoginClick={handleGoogleLogin}
      />
      <LoginFooter />
    </div>
  );
}
