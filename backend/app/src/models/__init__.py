# Importing every model here guarantees Base.metadata knows all tables - Alembic
from backend.app.src.models.catalog import (
    Amenity, Building, NearbyPlace, Property, Unit, UnitType, property_amenity, unit_type_amenity,
)
from backend.app.src.models.inquiry import Inquiry
from backend.app.src.models.user import User

__all__ = [
    "User", "Amenity", "Property", "NearbyPlace", "Building", "UnitType", "Unit", "Inquiry",
    "property_amenity", "unit_type_amenity",
]
