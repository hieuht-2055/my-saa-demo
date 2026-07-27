import CountdownDigit from "./countdown-digit";

interface CountdownUnitProps {
  value: number;
  label: string;
}

// mm:2167:9038 (Days) / mm:2167:9043 (Hours) / mm:2167:9048 (Minutes) —
// two-digit zero-padded tile pair + caption.
export default function CountdownUnit({ value, label }: CountdownUnitProps) {
  const padded = Math.max(0, Math.min(99, value)).toString().padStart(2, "0");
  const [tens, units] = padded.split("");

  return (
    <div className="flex flex-col items-start justify-center gap-3.5">
      <div className="flex items-center gap-3.5">
        <CountdownDigit digit={tens} />
        <CountdownDigit digit={units} />
      </div>
      <span className="[font-family:var(--font-montserrat)] text-2xl font-bold leading-8 text-white">
        {label}
      </span>
    </div>
  );
}
