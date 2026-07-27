import CountdownDigit, { type CountdownDigitSize } from "./countdown-digit";

interface CountdownUnitProps {
  value: number;
  label: string;
  /**
   * Inclusive upper bound for a valid value. Two distinct behaviors, kept
   * backward-compatible on purpose:
   *  - omitted (home page's existing calls): legacy behavior — clamp into
   *    [0, 99], exactly as before this prop existed.
   *  - provided (prelaunch calls: days max=99, hours max=23, minutes
   *    max=59): a value outside [0, max] is INVALID and renders "00"
   *    rather than being clamped into range (see MoMorph test cases
   *    f98adad8 / 724e6e17 — e.g. hours=25 or minutes=-1 must show "00",
   *    not "23"/"00"-via-clamp).
   */
  max?: number;
  /** "sm" (default, home header) or "lg" (prelaunch hero) — see CountdownDigit. */
  size?: CountdownDigitSize;
}

function formatValue(value: number, max?: number): string {
  if (max === undefined) {
    return Math.max(0, Math.min(99, value)).toString().padStart(2, "0");
  }
  const isValid = Number.isFinite(value) && value >= 0 && value <= max;
  return (isValid ? value : 0).toString().padStart(2, "0");
}

const GAP_CLASS: Record<NonNullable<CountdownUnitProps["size"]>, string> = {
  sm: "gap-3.5",
  lg: "gap-3.5 sm:gap-5 lg:gap-[21px]",
};

const LABEL_CLASS: Record<NonNullable<CountdownUnitProps["size"]>, string> = {
  sm: "text-2xl leading-8",
  lg: "text-2xl leading-8 sm:text-3xl sm:leading-9 lg:text-4xl lg:leading-[48px]",
};

// mm:2167:9038 (home, Days/Hours/Minutes) / mm:2268:35139 (prelaunch) —
// two-digit zero-padded tile pair + caption. Shared by both screens.
export default function CountdownUnit({ value, label, max, size = "sm" }: CountdownUnitProps) {
  const padded = formatValue(value, max);
  const [tens, units] = padded.split("");

  return (
    <div className={`flex flex-col items-start justify-center ${GAP_CLASS[size]}`}>
      <div className={`flex items-center ${GAP_CLASS[size]}`}>
        <CountdownDigit digit={tens} size={size} />
        <CountdownDigit digit={units} size={size} />
      </div>
      <span
        className={`[font-family:var(--font-montserrat)] font-bold text-white ${LABEL_CLASS[size]}`}
      >
        {label}
      </span>
    </div>
  );
}
