interface EventInfoRowProps {
  label: string;
  value: string;
}

function EventInfoRow({ label, value }: EventInfoRowProps) {
  return (
    <p className="flex flex-wrap items-baseline gap-1 [font-family:var(--font-montserrat)] font-bold">
      <span className="text-base leading-6 tracking-[0.15px] text-white">{label}</span>
      <span className="text-2xl leading-8 text-[#FFEA9E]">{value}</span>
    </p>
  );
}

// mm:2167:9053 — event date/venue/livestream details under the countdown.
export default function EventInfo() {
  return (
    <div className="flex flex-col items-start gap-2">
      <div className="flex flex-wrap items-center gap-[60px]">
        {/* mm:2167:9055 */}
        <EventInfoRow label="Thời gian: " value="26/12/2025" />
        {/* mm:2167:9058 */}
        <EventInfoRow label="Địa điểm:" value="Âu Cơ Art Center" />
      </div>
      {/* mm:2167:9061 */}
      <p className="[font-family:var(--font-montserrat)] text-base font-bold leading-6 tracking-[0.5px] text-white">
        Tường thuật trực tiếp qua sóng Livestream
      </p>
    </div>
  );
}
