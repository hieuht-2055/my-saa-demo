// mm:2268:35129 (MM_MEDIA_BG Image) + mm:2268:35130 (Cover) — full-screen
// organic line-art background with a dark gradient overlay for text
// contrast. Static, no interaction (per spec 0.1). Asset is pre-composited
// at the frame's exact aspect ratio (1512x1077), so `cover` reproduces the
// design 1:1 without needing the raw Figma crop-transform offsets.
export default function PrelaunchBackground() {
  return (
    <>
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/prelaunch/countdown-bg.png')" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(18deg, #00101A 15.48%, rgba(0,18,29,0.46) 52.13%, rgba(0,19,32,0) 63.41%)",
        }}
      />
    </>
  );
}
