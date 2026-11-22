/* Content for the three dropdowns on the About page. Edit the words here, not in the components. */

export interface Pillar {
  title: string;
  body: string;
}

export interface Agency {
  id: string; // also the URL hash, e.g. /about#8990-holdings
  title: string;
  logo: string;
  logoAlt: string;
  pitch: string[];
  highlights: string[];
  website: { label: string; href: string };
  pillarsLabel: string;
  pillars: Pillar[];
}

export const KRIZA_ID = "meet-kriza";

export const KRIZA_INTRO = [
  "Welcome! I'm Kriza, your dedicated real estate partner here at Deca Homes and XUR Homes Realty Inc.",
  "Finding a home you can truly call your own is one of life's biggest milestones. That's why I'm proud to help you explore the affordable, well-planned communities crafted by DECA HOMES and backed by the trusted vision of 8990 Holdings. Whether you're comparing unit layouts or looking for expert guidance, you don't have to navigate it alone. I'm here to walk you through every step of the way, from your first question to your move-in day.",
];

// TODO: replace these placeholders with each company's OFFICIAL five pillars.
const placeholderPillars = (): Pillar[] =>
  [1, 2, 3, 4, 5].map((n) => ({ title: `Pillar ${n}`, body: "Replace with the official name and description of this pillar." }));

export const HOLDINGS: Agency = {
  id: "8990-holdings",
  title: "8990 Holdings, Inc.",
  logo: "/images/agency/8990_Holdings.png",
  logoAlt: "8990 Holdings, Inc. logo",
  pitch: [
    "8990 Holdings, Inc. is one of the largest mass housing developers in the Philippines and the force behind the DECA HOMES communities you are exploring.",
    "Its focus is simple: well-planned, affordable homes that hard-working Filipino families can actually own.",
  ],
  highlights: ["Affordable, well-planned communities", "Studio to 3-bedroom homes", "A trusted name in Philippine housing"],
  website: { label: "8990holdings.com", href: "https://8990holdings.com/" },
  pillarsLabel: "5 Pillars of 8990 Holdings",
  pillars: placeholderPillars(),
};

export const XUR: Agency = {
  id: "xur-homes-realty",
  title: "XUR Homes Realty, Inc.",
  logo: "/images/agency/XUR_Homes_Realty.jpg",
  logoAlt: "XUR Homes Realty, Inc. logo",
  pitch: [
    "XUR Homes Realty, Inc. is the real estate team that guides your purchase, from finding the right unit to making sense of your payment options.",
    "You get clear answers, honest numbers and a partner beside you until you hold the keys.",
  ],
  highlights: ["Units matched to your budget", "Help with payment options and Pag-IBIG", "Support from reservation to move-in"],
  website: { label: "facebook.com/xurhomesrealtyinc", href: "https://www.facebook.com/xurhomesrealtyinc" },
  pillarsLabel: "5 Pillars of Real Estate Principle",
  pillars: placeholderPillars(),
};
