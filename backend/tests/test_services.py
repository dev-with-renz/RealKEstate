from decimal import Decimal

from backend.app.models import NearbyPlace, Unit
from backend.app.schemas.inquiry import InquiryCreate
from backend.app.services.catalog import _like, _nearby, _starting_price


def test_like_escapes_wildcards_and_trims_whitespace():
    assert _like(r" 50%_off\\today ") == r"%50\%\_off\\\\today%"


def test_starting_price_prefers_available_units():
    units = [
        Unit(unit_number="1A", unit_type_id=1, status="available", price=Decimal("1200000")),
        Unit(unit_number="2A", unit_type_id=1, status="reserved", price=Decimal("900000")),
    ]

    assert _starting_price(units) == 1_200_000


def test_starting_price_falls_back_to_cheapest_priced_unit():
    units = [
        Unit(unit_number="1A", unit_type_id=1, status="sold", price=Decimal("1200000")),
        Unit(unit_number="2A", unit_type_id=1, status="reserved", price=Decimal("900000")),
    ]

    assert _starting_price(units) == 900_000
    assert _starting_price([Unit(unit_number="3A", unit_type_id=1, status="available")]) is None


def test_nearby_groups_known_categories_in_display_order():
    places = [
        NearbyPlace(name="Market", category="primary_need", distance_text="5 mins"),
        NearbyPlace(name="Clinic", category="hospital", distance_km=0.8),
        NearbyPlace(name="School", category="school"),
        NearbyPlace(name="Transit stop", category="transport_hub"),
    ]

    assert list(_nearby(places)) == ["Schools", "Hospitals", "Primary Needs", "Transport Hub"]
    assert _nearby(places)["Hospitals"] == ["Clinic (0.8 km)"]


def test_inquiry_normalizes_phone_and_text():
    inquiry = InquiryCreate(
        first_name=" Ana ",
        last_name=" Reyes ",
        email="ana@example.com",
        phone="+63 917-123-4567",
        message=" I want to schedule a visit. ",
    )

    assert inquiry.first_name == "Ana"
    assert inquiry.last_name == "Reyes"
    assert inquiry.phone == "+639171234567"
    assert inquiry.message == "I want to schedule a visit."
