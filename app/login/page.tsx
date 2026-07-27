import type { Metadata } from "next";
import LoginScreen from "./login-screen";
import { getLocale } from "@/lib/i18n/get-locale";
import { messages } from "@/lib/i18n/messages";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const m = messages[locale].login;
  return { title: m.metaTitle, description: m.metaDescription };
}

// Next.js 16: `searchParams` is async.
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const locale = await getLocale();

  return <LoginScreen hasAuthError={error === "auth"} initialLocale={locale} />;
}
