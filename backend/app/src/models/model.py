from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, text, Text, Index, Table
from sqlalchemy.orm import relationship, Mapped, mapped_column
from backend.app.db import Base

# Amenity can be shared by multiple properties.
property_amenity = Table(
    "property_amenities",
    Base.metadata,
    Column("property_id", ForeignKey("properties.id"), primary_key=True),
    Column("amenity_id", ForeignKey("amenities.id"), primary_key=True),
)

class User(Base):
    """An application account, with optional OAuth profile details."""

    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    email: Mapped[str | None] = mapped_column(String(255), unique=True, index=True, nullable=True)
    username: Mapped[str | None] = mapped_column(String(100), index=True, nullable=True)
    hashed_password: Mapped[str | None] = mapped_column(String(255), nullable=True)
    role: Mapped[str] = mapped_column(String(50), nullable=False, server_default="user", index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=text("CURRENT_TIMESTAMP"))

    # OAuth fields are nullable so password-based accounts do not need them.
    oauth_provider: Mapped[str | None] = mapped_column(String(50), nullable=True)
    oauth_id: Mapped[str | None] = mapped_column(String(255), nullable=True)
    avatar_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    
    __table_args__ = (Index("ix_users_email_username", "email", "username"),)


class Amenity(Base):
    """A reusable feature (for example, a pool) that properties can offer."""

    __tablename__ = "amenities"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(100), unique=True)          # e.g. "Swimming Pool"
    icon: Mapped[str | None] = mapped_column(String(50), nullable=True)  # optional icon name
    category: Mapped[str | None] = mapped_column(String(50), nullable=True)  # "indoor", "outdoor", etc.

    properties: Mapped[list["Property"]] = relationship(secondary=property_amenity, back_populates="amenities")

class Property(Base):
    """A real-estate listing or development shown in the application."""

    __tablename__ = "properties"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(200), index=True)
    slug: Mapped[str] = mapped_column(String(200), unique=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    location: Mapped[str] = mapped_column(String(200), index=True)
    price_from: Mapped[float | None] = mapped_column(nullable=True)
    # Add listing-specific attributes here as the product requirements evolve.

    amenities: Mapped[list[Amenity]] = relationship(secondary=property_amenity, back_populates="properties")
    nearby_places: Mapped[list["NearbyPlace"]] = relationship(back_populates="property", cascade="all, delete-orphan")
    buildings: Mapped[list["Building"]] = relationship(back_populates="property", cascade="all, delete-orphan")
    
class NearbyPlace(Base):
    """A point of interest near a property, such as a school or mall."""

    __tablename__ = "nearby_places"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    property_id: Mapped[int] = mapped_column(ForeignKey("properties.id"), index=True)
    
    name: Mapped[str] = mapped_column(String(200))               # "SM Aura", "BGC High School"
    category: Mapped[str] = mapped_column(String(50))            # "school", "hospital", "mall", "restaurant", "park"
    distance_km: Mapped[float | None] = mapped_column(nullable=True)  # 0.8
    distance_text: Mapped[str | None] = mapped_column(String(50), nullable=True)  # "5 mins walk"

    property: Mapped["Property"] = relationship(back_populates="nearby_places")
    
class Building(Base):
    """A building or tower that belongs to a property development."""

    __tablename__ = "buildings"
    
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    property_id: Mapped[int] = mapped_column(ForeignKey("properties.id"), index=True)
    name: Mapped[str] = mapped_column(String(100), index=True)
    floors: Mapped[str | None] = mapped_column(nullable=True)
    
    property: Mapped["Property"] = relationship(back_populates="buildings")
    units: Mapped[list["Unit"]] = relationship(back_populates="building")

class UnitType(Base):
    """A reusable unit floor-plan/category, such as a studio or two-bedroom."""

    __tablename__ = "unit_types"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(100), index=True)
    code: Mapped[str | None] = mapped_column(String(50), nullable=True)
    bedrooms: Mapped[int] = mapped_column(default=0)
    bathrooms: Mapped[int] = mapped_column(default=1)
    floor_area: Mapped[str] = mapped_column()
    style: Mapped[str | None] = mapped_column(String(100), nullable=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    
    units: Mapped[list["Unit"]] = relationship(back_populates="unit_type")
    
class Unit(Base):
    """An individual rentable or saleable unit in a building."""

    __tablename__ = "units"
    
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    building_id: Mapped[int] = mapped_column(ForeignKey("buildings.id"))
    unit_type_id: Mapped[int] = mapped_column(ForeignKey("unit_types.id"), nullable=False)
    
    unit_number: Mapped[str] = mapped_column(String(20))
    floor: Mapped[int | None] = mapped_column(nullable=True)
    price: Mapped[float | None] = mapped_column(nullable=True)
    status: Mapped[str] = mapped_column(String(50), default="available")
    
    bedrooms: Mapped[str | None] = mapped_column(String(50))
    floor_area: Mapped[float | None] = mapped_column(nullable=True)
    
    building: Mapped["Building"] = relationship(back_populates="units")
    unit_type: Mapped["UnitType | None"] = relationship(back_populates="units", nullable=True)