from pydantic import BaseModel

class UnitTypeOut(BaseModel):
    id: int
    name: str
    bedrooms: int
    bathrooms: int
    floor_area_sqm: float | None
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
    
class PropertyDetail(PropertySummary):
    description: str
    address: str| None
    images: list[str]
    nearby: dict[str, list[str]]
    buildings: list[BuildingOut]