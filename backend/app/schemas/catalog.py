from pydantic import BaseModel

class UnitTypeOut(BaseModel):
    id: int
    name: str
    bedrooms: int
    bathrooms: int
    floor_area_min_sqm: float | None
    floor_area_max_sqm: float | None
    price: float | None  # cheapest unit of this type in the building (None if no unit has a price yet)
    description: str
    amenities: list[str]
    images: list[str]
    available_units: int

class BuildingOut(BaseModel):
    id: int
    name: str
    description: str
    floors: int | None
    images: list[str]
    unit_types: list[UnitTypeOut]

class PropertySummary(BaseModel):
    id: int
    slug: str
    name: str
    tagline: str | None
    location: str
    vibes: list[str]
    cover_image: str | None
    price_from: float | None
    price_to: float | None
    bedrooms: list[int]
    building_count: int
    available_units: int
    
class PropertyAmenityOut(BaseModel):
    name: str
    icon: str | None

class BedroomPriceOut(BaseModel):
    bedrooms: int
    price_min: float | None
    price_max: float | None

class PropertyUnitTypeOut(BaseModel):
    id: int
    name: str
    bedrooms: int
    bathrooms: int
    floor_area_min_sqm: float | None
    floor_area_max_sqm: float | None
    price_min: float | None
    price_max: float | None

class PropertyFactsOut(BaseModel):
    address: str | None
    land_area_sqm: float | None
    total_buildings: int
    total_floors: int | None
    total_units: int
    parking_slots: int | None

class PropertyDetail(PropertySummary):
    description: str
    address: str| None
    images: list[str]
    amenities: list[PropertyAmenityOut]
    nearby: dict[str, list[str]]
    bedroom_prices: list[BedroomPriceOut]
    unit_types: list[PropertyUnitTypeOut]
    facts: PropertyFactsOut
    latitude: float | None
    longitude: float | None
    buildings: list[BuildingOut]