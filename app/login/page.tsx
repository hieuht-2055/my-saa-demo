import type { Metadata } from "next";
import LoginScreen from "./login-screen";

export const metadata: Metadata = {
  title: "Đăng nhập | Sun* Annual Awards 2025",
  description: "Đăng nhập để khám phá Sun* Annual Awards 2025.",
};

const AUTH_ERROR_MESSAGE = "Đăng nhập không thành công. Vui lòng thử lại.";

// Next.js 16: `searchParams` is async.
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const initialError = error === "auth" ? AUTH_ERROR_MESSAGE : null;

  return <LoginScreen initialError={initialError} />;
}
