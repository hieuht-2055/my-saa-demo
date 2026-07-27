interface CountdownDigitProps {
  digit: string;
}

// mm:2167:9040 — single glass digit tile (reused for every digit in every
// unit). Digital-readout face is loaded as `--font-digital-numbers`.
export default function CountdownDigit({ digit }: CountdownDigitProps) {
  return (
    <div
      className="flex h-[82px] w-[51px] items-center justify-center rounded-lg border-[0.5px] border-[#FFEA9E]/50 backdrop-blur-md"
      style={{
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.05) 100%)",
      }}
    >
      <span
        className="[font-family:var(--font-digital-numbers)] text-[40px] leading-none text-white tabular-nums"
        aria-hidden="true"
      >
        {digit}
      </span>
    </div>
  );
}
