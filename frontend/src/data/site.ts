import type { IconName } from '../components/ui/Icon'
import type { GalleryImage } from '../types'

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

// SAMPLE contact details. The FIRST phone and email are shown bigger on the Contact page.
export const CONTACT = {
  phones: [
    { value: "+63 900 000 0000", href: "tel:+639000000000" },
    { value: "+63 900 000 0001", href: "tel:+639000000001" },
  ],
  emails: [
    { value: "hello@realkestate.example", href: "mailto:hello@realkestate.example" },
    { value: "sales@realkestate.example", href: "mailto:sales@realkestate.example" },
  ],
  address: "Sales gallery address, City, Philippines",
  hours: "Monday to Saturday, 9:00 AM to 6:00 PM",
};

// To add another platform later: add an entry here (and an icon in components/ui/Icon.tsx).
export const SOCIALS: { label: string; icon: "facebook"; href: string }[] = [
  { label: "Kriza on Facebook", icon: "facebook", href: "#" },
  { label: "DECA HOMES on Facebook", icon: "facebook", href: "#" },
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
];

export const LOCATION_HINTS = [
  "Ortigas", "Cubao", "Manila", "Pasig City", "Quezon City", "Bulacan", "San Jose del Monte", "Cavite", "Pampanga",
];

/* ── Homepage: hero, processes, featured community, communities, agent ───────────── */

// Copy your photos to frontend/public/images/udh-ortigas/ with these names (or change the paths).
export const FEATURED = {
  slug: "urban-deca-homes-ortigas", // must match Property.slug in the database
  name: "UDH Ortigas",
  eyebrow: "Featured community",
  title: "Live where life happens.",
  body: "Landscaped gardens that glow at night, sports courts for the kids and towers made for everyday family living, all within reach of Ortigas.",
  highlights: ["Landscaped parks", "Sports courts", "Open spaces", "Walkable essentials"],
  // The FIRST image is also the homepage hero cover. Add more objects to grow the photo viewer.
  images: [
    { src: "/images/udh-ortigas/aerial-day.jpg", alt: "Aerial view of UDH Ortigas towers, park and courts" },
    { src: "/images/udh-ortigas/night-park.jpg", alt: "Landscaped park lit up at night" },
    { src: "/images/udh-ortigas/towers-night.jpg", alt: "UDH Ortigas towers at night" },
  ] as GalleryImage[],
};

// These slugs show first in "Our communities". Region names also cover existing slug variants.
export const PRIORITY_SLUGS = ["urban-deca-homes-cubao", "urban-deca-homes-manila"];

export const PROCESSES: { title: string; body: string; to: string; cta: string; icon: IconName; accent: string }[] = [
  { title: "Property Buying", body: "Pick your unit, reserve it, then settle your down payment through our partner banks or Pag-IBIG.", to: "/properties", cta: "Browse properties", icon: "home", accent: "border-deca-600" },
  { title: "Rent-to-Own", body: "Move in sooner and let your monthly payments work toward owning the unit. Ask which units qualify.", to: "/contact#inquire", cta: "Ask about rent-to-own", icon: "key", accent: "border-lagoon-400" },
  { title: "Investment", body: "Studios and 1-bedrooms in busy districts, made for steady rental income. Let us run the numbers with you.", to: "/contact#inquire", cta: "Talk about investing", icon: "trending", accent: "border-lagoon-500" },
];

export const KRIZA = {
  name: "Kriza",
  role: "Your DECA HOMES real estate agent",
  pitch: "Buying a home is personal, so you deserve a real person on your side. Kriza walks with you from the first viewing to turnover: honest answers, clear numbers and a free quotation built around your budget.",
  photo: undefined as string | undefined, // e.g. "/images/kriza.png". Leave empty to show the cartoon.
};

/* ── Payment guide ──────────────────────────────────────────────────────────────── */

// SAMPLE steps: confirm the real process and terms with DECA HOMES sales.
export const PAYMENT_STEPS = [
  { title: "Choose your unit", body: "Compare studio, 1, 2 and 3-bedroom units, then pick the building and floor that suit you. Not sure? Ask for a free quote." },
  { title: "Reserve it", body: "Send your reservation form and pay the reservation fee through any partner bank below." },
  { title: "Submit your requirements", body: "Prepare valid IDs and proof of income. Open the requirements checklist below so nothing is missed." },
  { title: "Pay your down payment", body: "Your sales representative will confirm the amount, schedule and payment channel for your chosen unit." },
  { title: "Settle the balance and move in", body: "Complete Pag-IBIG or bank financing, or the agreed payment plan, then schedule your unit turnover." },
];

// SAMPLE: Pag-IBIG sets its own eligibility, rates and terms. Confirm the latest before publishing.
export const PAGIBIG = {
  title: "Pag-IBIG funding",
  intro: "Pag-IBIG Fund offers housing loans to qualified members. It is a popular way to pay the balance of your unit.",
  steps: [
    "Check that your Pag-IBIG membership and contribution record are up to date.",
    "Reserve your unit and fill in the loan application with your agent.",
    "Submit your identity and income documents for evaluation.",
    "Wait for loan approval, then sign the loan documents.",
    "Pag-IBIG releases the loan to the developer and your monthly payments begin.",
  ],
  note: "Eligibility, rates and terms are set by Pag-IBIG and can change. Your agent will confirm the latest.",
};

export const COSIGNING = {
  title: "Co-signing (co-borrower)",
  intro: "A co-borrower, often a spouse or a family member, adds their income to your application. This can help you qualify for a bigger loan.",
  steps: [
    "Decide with your agent who will co-sign.",
    "The co-borrower prepares their own IDs and proof of income.",
    "The lender evaluates both borrowers together.",
    "Both sign the loan documents and share responsibility for the payments.",
  ],
  note: "Requirements for co-borrowers depend on the lender. Ask your agent before you decide.",
};

// Shown as dropdowns on the Payment Guide page (no downloads).
export const DOCUMENTS = [
  { name: "Payment guide", note: "Reservation, down payment and financing at a glance", items: [
    "Pay the reservation fee to hold your unit.",
    "Pay the down payment on the schedule your agent confirms.",
    "Settle the balance through Pag-IBIG, bank financing or the agreed payment plan.",
    "Schedule your unit turnover once all documents are complete.",
  ] },
  { name: "Reservation form", note: "What you will be asked to fill in", items: [
    "Full name, birthdate and civil status",
    "Contact number and email",
    "Preferred building, unit type and floor",
    "Preferred payment option",
  ] },
  { name: "Requirements checklist", note: "IDs, proof of income and other documents", items: [
    "Two valid government IDs",
    "Proof of income: payslips, ITR or audited financial statements",
    "Proof of billing or address",
    "TIN",
    "Pag-IBIG membership details (for Pag-IBIG loans)",
    "Co-borrower's IDs and proof of income (if you have one)",
  ] },
];

export const FAQS = [
  { q: "Can I get a price estimate before I reserve?", a: "Yes. Tap Get a free quote, tell us the unit type you like and we will send you an estimate with no obligation." },
  { q: "Which payment channels can I use?", a: "Our partner banks are listed above. Your sales representative will confirm the channel and account details for your purchase." },
  { q: "Can I use Pag-IBIG for my unit?", a: "Many buyers do. See the Pag-IBIG funding section above, then ask your agent to confirm if you qualify." },
  { q: "Which documents do I need?", a: "Usually valid government IDs and proof of income. The exact list depends on your payment option, so open the requirements checklist or ask us." },
];

/* ── About ──────────────────────────────────────────────────────────────────────── */

export const LIFESTYLES = {
  familial: {
    label: "Familial",
    title: "Room for the whole family",
    body: "Homes planned around daily routines: schools, markets and clinics close by, with space for kids to play and grandparents to visit.",
    points: ["Two and three-bedroom layouts for growing households", "Walkable essentials and safe common areas", "Payment plans that respect a family budget"],
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

// SAMPLE: replace with the official profile.
export const ABOUT = {
  tagline: "Good homes should be within reach.",
  intro: "Finding a quality home shouldn't be complicated.",
  subIntro: "Built on the legacy of DECA HOMES and 8990 Holdings—pioneers in accessible, high-value housing—we make buying simple and personal. Browse our properties, choose a layout that fits your budget, and connect with an expert who puts your family first.",
  story: [
    { title: "Where it started", body: "It began with a simple question: why should a good home feel out of reach for a hard-working family? DECA HOMES set out to answer it with thoughtful planning, practical designs and fair prices." },
    { title: "What we believe", body: "Affordable does not have to mean basic. We put light, ventilation and sensible layouts first, then add the touches that make a unit feel like yours." },
    { title: "Where we are going", body: "More communities, closer to where people work and study, and a buying process that is as clear as the homes themselves." },
  ],
};

/* ── Data privacy (Philippines: Data Privacy Act of 2012, RA 10173) ─────────────── */
export const DATA_PRIVACY = {
  footer: "We collect only the details you give us to answer your inquiry or quote request, in line with the Data Privacy Act of 2012 (Republic Act No. 10173).",
  dpoEmail: "privacy@realkestate.example", // SAMPLE: your Data Protection Officer's email
};
