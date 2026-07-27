export type CountdownDigitSize = "sm" | "lg";

interface CountdownDigitProps {
  digit: string;
  /**
   * Visual scale. "sm" (default) is the original header-countdown tile —
   * unchanged, so the home page keeps its exact prior appearance. "lg" is
   * the larger glass tile used by the full-screen prelaunch countdown
   * (mm:2268:35141 etc.), responsive from mobile up to the Figma desktop
   * spec (76.8x122.88px, 73.73px LED face) at the `lg` breakpoint.
   */
  size?: CountdownDigitSize;
}

const BOX_CLASS: Record<CountdownDigitSize, string> = {
  sm: "h-[82px] w-[51px] rounded-lg border-[0.5px] backdrop-blur-md",
  lg: [
    "h-[70px] w-[44px] rounded-lg border-[0.5px] backdrop-blur-md",
    "sm:h-[96px] sm:w-[60px] sm:rounded-xl sm:border-[0.75px] sm:backdrop-blur-xl",
    "lg:h-[122.88px] lg:w-[76.8px] lg:backdrop-blur-[24.96px]",
  ].join(" "),
};

const FONT_CLASS: Record<CountdownDigitSize, string> = {
  sm: "text-[40px]",
  lg: "text-[32px] sm:text-[52px] lg:text-[73.73px]",
};

// mm:2167:9040 (home) / mm:2268:35141 (prelaunch) — single glass digit tile,
// reused for every digit in every unit on both screens via the `size` prop.
// Digital-readout face is loaded as `--font-digital-numbers`.
export default function CountdownDigit({ digit, size = "sm" }: CountdownDigitProps) {
  return (
    <div
      className={`flex items-center justify-center border-[#FFEA9E]/50 ${BOX_CLASS[size]}`}
      style={{
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.05) 100%)",
      }}
    >
      <span
        className={`[font-family:var(--font-digital-numbers)] leading-none text-white tabular-nums ${FONT_CLASS[size]}`}
        aria-hidden="true"
      >
        {digit}
      </span>
    </div>
  );
}
