export interface GalleryImage {
  src: string;
  alt: string;
}

export interface UnitType {
  id: number;
  name: string;
  bedrooms: number; // 0 = studio, 1, 2, 3
  bathrooms: number;
  /** Units of the same type can differ in size, so we show a range. */
  floor_area_min_sqm: number | null;
  floor_area_max_sqm: number | null;
  price: number | null;
  description: string;
  amenities: string[];
  images: string[];
  available_units: number;
}

export interface Building {
  id: number;
  name: string;
  description: string;
  floors: number | null;
  images: string[];
  unit_types: UnitType[];
}

export interface PropertySummary {
  id: number;
  slug: string;
  name: string;
  tagline: string | null;
  location: string;
  vibes: string[];
  cover_image: string | null;
  price_from: number | null;
  price_to: number | null;
  bedrooms: number[];
  building_count: number;
  available_units: number;
}

export interface PropertyDetail extends PropertySummary {
  description: string;
  address: string | null;
  amenities: string[];
  images: string[];
  nearby: Record<string, string[]>;
  buildings: Building[];
}

export interface InquiryPayload {
  kind: "inquiry" | "quote";
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  message: string;
  property_slug: string | null;
  unit_type_pref: string | null;
  website: string;
  consent: boolean; // Data Privacy Act consent
}
