from decimal import Decimal
from sqlalchemy import Column, String, Text, Table, Numeric, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship, Mapped, mapped_column
from backend.app.src.db.base import Base, TimestampMixin
from backend.app.src.db.types import JsonB

# Amenity can be shared by multiple properties.
property_amenity = Table(
    "property_amenities",
    Base.metadata,
    Column("property_id", ForeignKey("properties.id", ondelete="CASCADE"), primary_key=True),
    Column("amenity_id", ForeignKey("amenities.id", ondelete="CASCADE"), primary_key=True),
)

# NEW: the same Amenity rows can also describe a unit type ("Compact kitchenette", "Balcony").
# This powers the "Amenities: Studio / 1 Bed / 2 Bed" text on the listing page.
unit_type_amenity = Table(
    "unit_type_amenities",
    Base.metadata,
    Column("unit_type_id", ForeignKey("unit_types.id", ondelete="CASCADE"), primary_key=True),
    Column("amenity_id", ForeignKey("amenities.id", ondelete="CASCADE"), primary_key=True),
)

class Amenity(TimestampMixin, Base):
    """A reusable feature (for example, a pool) that properties can offer."""

    __tablename__ = "amenities"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(100), unique=True)          # e.g. "Swimming Pool"
    icon: Mapped[str | None] = mapped_column(String(50), nullable=True)  # optional icon name
    category: Mapped[str | None] = mapped_column(String(50), nullable=True)  # "indoor", "outdoor", etc.

    properties: Mapped[list["Property"]] = relationship(secondary=property_amenity, back_populates="amenities")
    unit_types: Mapped[list["UnitType"]] = relationship(secondary=unit_type_amenity, back_populates="amenities")

class Property(TimestampMixin, Base):
    """A real-estate listing or development shown in the application."""

    __tablename__ = "properties"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(200), index=True)
    slug: Mapped[str] = mapped_column(String(200), unique=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    location: Mapped[str] = mapped_column(String(200), index=True)
    price_from: Mapped[Decimal | None] = mapped_column(Numeric(14,2), nullable=True)
    
    # Visible fields on UI
    tagline: Mapped[str | None] = mapped_column(String(255), nullable=True)
    address: Mapped[str | None] = mapped_column(String(255), nullable=True)
    vibes: Mapped[list[str]] = mapped_column(JsonB, default=list) # marketing tags: family, stylish, modern...
    images: Mapped[list[str]] = mapped_column(JsonB, default=list) # property/site gallery (URLs)
    is_published: Mapped[bool] = mapped_column(default=True)
    sort_order: Mapped[int] = mapped_column(default=0)

    amenities: Mapped[list[Amenity]] = relationship(secondary=property_amenity, back_populates="properties")
    nearby_places: Mapped[list["NearbyPlace"]] = relationship(back_populates="property", cascade="all, delete-orphan")
    buildings: Mapped[list["Building"]] = relationship(
        back_populates="property", cascade="all, delete-orphan", order_by="Building.sort_order"
        )
    
class NearbyPlace(TimestampMixin, Base):
    """A point of interest near a property, such as a school or mall."""

    __tablename__ = "nearby_places"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    property_id: Mapped[int] = mapped_column(ForeignKey("properties.id", ondelete="CASCADE"), index=True)
    
    name: Mapped[str] = mapped_column(String(200)) # "SM Aura", "BGC High School"
    category: Mapped[str] = mapped_column(String(50))
    # school | hospital | government | primary_need | mall   (the website groups by these; others show as-is)
    distance_km: Mapped[float | None] = mapped_column(nullable=True)  # 0.8
    distance_text: Mapped[str | None] = mapped_column(String(50), nullable=True)  # "5 mins walk"

    property: Mapped["Property"] = relationship(back_populates="nearby_places")
    
class Building(TimestampMixin, Base):
    """A building or tower that belongs to a property development."""

    __tablename__ = "buildings"
    
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    property_id: Mapped[int] = mapped_column(ForeignKey("properties.id", ondelete="CASCADE"), index=True)
    name: Mapped[str] = mapped_column(String(100), index=True)
    floors: Mapped[int | None] = mapped_column(nullable=True)
    
    # New
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    images: Mapped[list[str]] = mapped_column(JsonB, default=list)  # building gallery (URLs)
    sort_order: Mapped[int] = mapped_column(default=0)
    
    property: Mapped["Property"] = relationship(back_populates="buildings")
    units: Mapped[list["Unit"]] = relationship(back_populates="building", cascade="all, delete-orphan")

class UnitType(TimestampMixin, Base):
    """A reusable unit floor-plan/category, such as a studio or two-bedroom."""

    __tablename__ = "unit_types"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(100), index=True)
    code: Mapped[str | None] = mapped_column(String(50), unique=True, nullable=True)
    bedrooms: Mapped[int] = mapped_column(default=0)
    bathrooms: Mapped[int] = mapped_column(default=1)
    floor_area: Mapped[Decimal | None] = mapped_column(Numeric(7,2), nullable=True)
    style: Mapped[str | None] = mapped_column(String(100), nullable=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    images: Mapped[list[str]] = mapped_column(JsonB, default=list)
    
    amenities: Mapped[list[Amenity]] = relationship(secondary=unit_type_amenity, back_populates="unit_types")
    units: Mapped[list["Unit"]] = relationship(back_populates="unit_type")
    
class Unit(TimestampMixin, Base):
    """An individual rentable or saleable unit in a building."""

    __tablename__ = "units"
    __table_args__ = (UniqueConstraint("building_id", "unit_number", name="uq_units_building_unit_number"))
    
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    building_id: Mapped[int] = mapped_column(ForeignKey("buildings.id", ondelete="CASCADE"))
    unit_type_id: Mapped[int] = mapped_column(ForeignKey("unit_types.id", ondelete="RESTRICT"), nullable=False)
    
    unit_number: Mapped[str] = mapped_column(String(20))
    floor: Mapped[int | None] = mapped_column(nullable=True)
    price: Mapped[Decimal | None] = mapped_column(Numeric(14,2), nullable=True)
    status: Mapped[str] = mapped_column(String(50), default="available", server_default="available", index=True)
    floor_area: Mapped[Decimal | None] = mapped_column(Numeric(7,2), nullable=True)
    image_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    
    building: Mapped["Building"] = relationship(back_populates="units")
    unit_type: Mapped["UnitType"] = relationship(back_populates="units", nullable=True)