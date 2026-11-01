import type { IconName } from '../components/ui/Icon'

/* ───────────────────────────────────────────────────────────────────────────
   All words, links and contact details live here so you can edit the site
   without touching components.
   ─────────────────────────────────────────────────────────────────────────── */

export const NAV: { to: string; label: string; icon: IconName; end?: boolean }[] = [
  { to: "/", label: "Home", icon: "home", end: true },
  { to: "/about", label: "About Us", icon: "heart" },
  { to: "/properties", label: "Properties", icon: "building" },
  { to: "/payment-guide", label: "Payment Guide", icon: "wallet" },
  { to: "/contact", label: "Contact Us", icon: "phone" },
];

// SAMPLE contact details
export const CONTACT = {
  phone: "+63 900 000 0000",
  phoneHref: "tel:+639000000000",
  email: "hello@realkestate.example",
  address: "Sales gallery address, City, Philippines",
  hours: "Monday to Saturday, 9:00 AM to 6:00 PM",
};

export const SOCIALS = [
  { label: "Facebook", short: "Fb", href: "#" },
  { label: "Instagram", short: "Ig", href: "#" },
  { label: "TikTok", short: "Tk", href: "#" },
  { label: "YouTube", short: "Yt", href: "#" },
  { label: "Viber", short: "Vb", href: "#" },
];

export interface Partner {
  name: string;
  kind: "Bank" | "E-wallet";
  /** Drop the official logo in frontend/public/partners/ and set e.g. "/partners/bdo.svg". */
  logo?: string;
}

export const PARTNERS: Partner[] = [
  { name: "BDO", kind: "Bank" },
  { name: "BPI", kind: "Bank" },
  { name: "Security Bank", kind: "Bank" },
  { name: "ChinaBank", kind: "Bank" },
  { name: "PNB", kind: "Bank" },
  { name: "Maya", kind: "E-wallet" },
  { name: "GoTyme", kind: "E-wallet" },
  { name: "GCash", kind: "E-wallet" },
];

export const LOCATION_HINTS = [
  "Pasig City", "Quezon City", "Bulacan", "San Jose del Monte", "Cavite", "Imus", "Pampanga", "Mabalacat",
];

// SAMPLE steps: confirm the real process and terms with DECA HOMES sales.
export const PAYMENT_STEPS = [
  { title: "Choose your unit", body: "Compare studio, 1-bedroom and 2-bedroom units, then pick the tower and floor that suit you. Not sure? Ask for a free quote." },
  { title: "Reserve it", body: "Send your reservation form and pay the reservation fee through any partner bank or e-wallet below." },
  { title: "Submit your requirements", body: "Prepare valid IDs and proof of income. Download the checklist so nothing is missed." },
  { title: "Pay your down payment", body: "Your sales representative will confirm the amount, schedule and payment channel for your chosen unit." },
  { title: "Settle the balance and move in", body: "Complete bank financing or the agreed payment plan, then schedule your unit turnover." },
];

export const DOCUMENTS = [
  { name: "Payment guide", note: "Reservation, down payment and financing at a glance", href: "/downloads/payment-guide.pdf" },
  { name: "Reservation form", note: "Fill in and send it to your sales representative", href: "/downloads/reservation-form.pdf" },
  { name: "Requirements checklist", note: "IDs, proof of income and other documents", href: "/downloads/requirements-checklist.pdf" },
];

export const FAQS = [
  { q: "Can I get a price estimate before I reserve?", a: "Yes. Tap Get a free quote, tell us the unit type you like and we will send you an estimate with no obligation." },
  { q: "Which payment channels can I use?", a: "Our partner banks and e-wallets are listed above. Your sales representative will confirm the channel and account details for your purchase." },
  { q: "Which documents do I need?", a: "Usually valid government IDs and proof of income. The exact list depends on your payment option, so download the checklist or ask us." },
];

export const LIFESTYLES = {
  familial: {
    label: "Familial",
    title: "Room for the whole family",
    body: "Homes planned around daily routines: schools, markets and clinics close by, with space for kids to play and grandparents to visit.",
    points: ["Two-bedroom layouts for growing households", "Walkable essentials and safe common areas", "Payment plans that respect a family budget"],
    image: "/images/aurora-1.svg",
  },
  stylish: {
    label: "Stylish and modern",
    title: "A look you are proud to come home to",
    body: "Clean lines, warm tones and skyline views. A modern address that feels a step above, without a luxury price tag.",
    points: ["Studios and 1-bedrooms with smart layouts", "Contemporary lobbies and facades", "Easy access to malls, cafes and transport"],
    image: "/images/solana-1.svg",
  },
};

export const STYLES: { title: string; body: string; icon: IconName }[] = [
  { title: "Contemporary", body: "Fresh, bright spaces that follow how people live today.", icon: "sparkle" },
  { title: "Modern", body: "Simple forms and good light, with nothing you do not need.", icon: "building" },
  { title: "Economical and practical", body: "Smart floor plans and honest pricing that stretch your peso.", icon: "wallet" },
];

export const WHY: { title: string; body: string; icon: IconName }[] = [
  { title: "Priced for real life", body: "Studio to 2-bedroom homes with clear starting prices and flexible payment options.", icon: "wallet" },
  { title: "Made for families", body: "Communities near schools, clinics and markets, so errands stay short.", icon: "heart" },
  { title: "Guided at every step", body: "From free quote to turnover, a real person walks you through the process.", icon: "shield" },
];

// SAMPLE: replace with the official profile.
export const ABOUT = {
  tagline: "Good homes should be within reach.",
  intro: "DECA HOMES creates affordable, well-planned communities for Filipino families. RealKEstate is where you explore them, compare units and talk to a real person.",
  pillars: [
    { title: "Vision", body: "A home for every family that wants one, in communities that help families thrive." },
    { title: "Mission", body: "Design and deliver quality homes at honest prices, with service that stays with you after turnover." },
    { title: "Values", body: "Honesty in pricing. Care in construction. Respect for every buyer's budget." },
  ],
  story: [
    { title: "Where it started", body: "It began with a simple question: why should a good home feel out of reach for a hard-working family? DECA HOMES set out to answer it with thoughtful planning, practical designs and fair prices." },
    { title: "What we believe", body: "Affordable does not have to mean basic. We put light, ventilation and sensible layouts first, then add the touches that make a unit feel like yours." },
    { title: "Where we are going", body: "More communities, closer to where people work and study, and a buying process that is as clear as the homes themselves." },
  ],
};
