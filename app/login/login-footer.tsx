/**
 * Fixed-at-bottom footer with the copyright line. Sits at the bottom of the
 * flex column layout so it stays pinned even on short viewports, without a
 * literal `position: fixed` that could overlap hero content.
 */
export default function LoginFooter() {
  return (
    <footer className="flex items-center justify-center border-t border-[#2E3940] px-6 py-10 sm:px-24">
      <p className="[font-family:var(--font-montserrat-alternates)] text-base font-bold leading-6 text-white">
        Bản quyền thuộc về Sun* © 2025
      </p>
    </footer>
  );
}
