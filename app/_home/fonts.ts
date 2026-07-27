import {
  Montserrat,
  Montserrat_Alternates,
  Share_Tech_Mono,
} from "next/font/google";

// Homepage typography — matches MoMorph spec. Montserrat covers nav/body/
// headings/buttons (weights 400/500/700 all appear in the design), Montserrat
// Alternates covers the footer copyright line. "vietnamese" subset is
// required: most copy on this screen is in Vietnamese.
export const montserrat = Montserrat({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

export const montserratAlternates = Montserrat_Alternates({
  subsets: ["latin", "vietnamese"],
  weight: ["700"],
  variable: "--font-montserrat-alternates",
  display: "swap",
});

// The Figma spec calls for "Digital Numbers" (a seven-segment LCD display
// face) for the countdown digits. That family isn't on Google Fonts, so
// Share Tech Mono — a monospaced, digital-readout-style face available via
// next/font/google — stands in as the closest faithful substitute.
export const digitFont = Share_Tech_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-digital-numbers",
  display: "swap",
});
