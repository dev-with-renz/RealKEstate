export interface GalleryImage {
  src: string;
  alt: string;
}

/** One row per unit type (2BR A, 2BR B ...) used in a property. */
export interface UnitType {
  id: number;
  name: string;
  bedrooms: number; // 0 = studio, 1, 2, 3
  bathrooms: number;
  /** Units of the same type can differ in size, so we show a range. */
  floor_area_min_sqm: number | null;
  floor_area_max_sqm: number | null;
  price_min: number | null;
  price_max: number | null;
}

/** One row per bedroom count (Studio, 1BR, 2BR, 3BR) with the price range across ALL its sub types. */
export interface BedroomPrice {
  bedrooms: number;
  price_min: number | null;
  price_max: number | null;
}

export interface Amenity {
  name: string;
  icon: string | null; // "pool", "court", "garden" ...
}

export interface PropertyFacts {
  address: string | null;
  land_area_sqm: number | null;
  total_buildings: number;
  total_floors: number | null;
  total_units: number;
  parking_slots: number | null;
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
}

export interface PropertyDetail extends PropertySummary {
  description: string;
  address: string | null;
  images: string[]; // up to 10 property pictures
  amenities: Amenity[]; // community amenities
  nearby: Record<string, string[]>;
  bedroom_prices: BedroomPrice[];
  unit_types: UnitType[];
  facts: PropertyFacts;
  latitude: number | null;
  longitude: number | null;
}

export interface InquiryPayload {
  kind: "inquiry" | "quote";
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  message: string;
  property_slug: string | null; // the property the person is interested in
  website: string;
  consent: boolean; // Data Privacy Act consent
}
