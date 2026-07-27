import { Montserrat, Montserrat_Alternates } from "next/font/google";

// Login screen typography — matches MoMorph spec (Montserrat 700 for
// headings/nav/button, Montserrat Alternates 700 for the footer copyright
// line). "vietnamese" subset is required: all copy is in Vietnamese.
export const montserrat = Montserrat({
  subsets: ["latin", "vietnamese"],
  weight: ["700"],
  variable: "--font-montserrat",
  display: "swap",
});

export const montserratAlternates = Montserrat_Alternates({
  subsets: ["latin", "vietnamese"],
  weight: ["700"],
  variable: "--font-montserrat-alternates",
  display: "swap",
});
