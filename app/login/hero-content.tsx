import Image from "next/image";
import GoogleLoginButton from "./google-login-button";

interface HeroContentProps {
  isLoading: boolean;
  errorMessage: string | null;
  onLoginClick: () => void;
}

/**
 * Hero section: abstract color-wave key-visual background, "ROOT FURTHER"
 * wordmark, Vietnamese subtitle/tagline, and the Google login button.
 * Purely presentational — loading/error state and the click handler are
 * owned by login-screen.tsx and passed in as props.
 */
export default function HeroContent({
  isLoading,
  errorMessage,
  onLoginClick,
}: HeroContentProps) {
  return (
    <main
      className="relative flex flex-1 items-center bg-cover bg-center px-6 py-16 sm:px-16 lg:px-36 lg:py-24"
      style={{ backgroundImage: "url('/login/hero-keyvisual.jpg')" }}
    >
      {/* Gradient overlays — exact stops from MoMorph (Rectangle 57 + Cover) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, #00101A 0%, #00101A 25.41%, rgba(0, 16, 26, 0) 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(0deg, #00101A 22.48%, rgba(0, 19, 32, 0) 51.74%)",
        }}
      />

      <div className="relative z-10 mx-auto flex w-full min-w-0 max-w-[1152px] flex-col items-start gap-12 lg:gap-20">
        <div className="relative w-full max-w-[451px] min-w-0 aspect-[451/200]">
          <Image
            src="/login/root-further-logo.png"
            alt="ROOT FURTHER"
            fill
            priority
            sizes="(max-width: 1024px) 80vw, 451px"
            className="object-contain object-left"
          />
        </div>

        <div className="flex w-full min-w-0 max-w-[496px] flex-col gap-6 pl-4">
          <p className="max-w-[480px] [font-family:var(--font-montserrat)] text-xl font-bold leading-[40px] tracking-[0.5px] text-white">
            Bắt đầu hành trình của bạn cùng SAA 2025.
            <br />
            Đăng nhập để khám phá!
          </p>

          <div className="flex flex-col gap-3">
            <GoogleLoginButton isLoading={isLoading} onClick={onLoginClick} />
            {errorMessage && (
              <p
                role="alert"
                className="[font-family:var(--font-montserrat)] text-sm font-bold text-red-400"
              >
                {errorMessage}
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
