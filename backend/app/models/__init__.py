# Importing every model here guarantees Base.metadata knows all tables - Alembic
from backend.app.models.catalog import (
    Amenity, Building, NearbyPlace, Property, Unit, UnitType, property_amenity, unit_type_amenity,
)
from backend.app.models.inquiry import Inquiry
from backend.app.models.user import User

__all__ = [
    "User", "Amenity", "Property", "NearbyPlace", "Building", "UnitType", "Unit", "Inquiry",
    "property_amenity", "unit_type_amenity",
]
