import pytest
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError

from backend.app.models import Property, Unit

VALID = {"kind": "inquiry", "first_name": "Ana", "last_name": "Reyes", "email": "ana@example.com",
         "phone": "0917 123 4567", "message": "I would like to visit the model unit."}


async def test_health(client):
    assert (await client.get("/api/v1/health")).json() == {"status": "ok"}


async def test_list_and_filters(client, seeded):
    everything = (await client.get("/api/v1/properties")).json()
    assert len(everything) == 3
    assert everything[0]["price_from"] == 1_850_000 and everything[0]["bedrooms"] == [0, 1, 2]

    cavite = (await client.get("/api/v1/properties", params={"location": "cavite"})).json()
    assert [p["slug"] for p in cavite] == ["deca-marigold-grove"]

    by_building = (await client.get("/api/v1/properties", params={"q": "building b"})).json()
    assert {p["slug"] for p in by_building} == {"deca-aurora-heights", "deca-marigold-grove"}

    by_unit_number = (await client.get("/api/v1/properties", params={"q": "3B"})).json()
    assert len(by_unit_number) == 3

    by_type = (await client.get("/api/v1/properties", params={"q": "2 bedroom"})).json()
    assert len(by_type) == 3

    cheap_2br = (await client.get("/api/v1/properties", params={"bedrooms": 2, "max_price": 1_000_000})).json()
    assert cheap_2br == []

    studios = (await client.get("/api/v1/properties", params={"bedrooms": 0, "max_price": 2_000_000})).json()
    assert [p["slug"] for p in studios] == ["deca-aurora-heights"]

    assert (await client.get("/api/v1/properties", params={"min_price": 5, "max_price": 1})).status_code == 422


async def test_detail_shape(client, seeded):
    d = (await client.get("/api/v1/properties/deca-aurora-heights")).json()
    assert d["location"] == "San Jose del Monte, Bulacan"
    assert "Playground" in d["amenities"]
    assert list(d["nearby"])[:2] == ["Schools", "Hospitals"]  # grouped from NearbyPlace rows, in a fixed order
    assert len(d["buildings"]) == 2

    studio, one_br, two_br = d["buildings"][0]["unit_types"]
    assert [studio["name"], one_br["name"], two_br["name"]] == ["Studio", "1 Bedroom", "2 Bedroom"]
    assert studio["price"] == 1_850_000 and studio["floor_area_sqm"] == 24.0 and studio["bathrooms"] == 1
    assert studio["available_units"] == 4  # 6 units: 4 available, 1 reserved, 1 sold
    assert "Compact kitchenette with counter" in studio["amenities"]
    assert two_br["images"] and (await client.get("/api/v1/properties/nope")).status_code == 404


async def test_advertised_price_overrides_computed(client, seeded, session_factory):
    async with session_factory() as s:
        prop = await s.scalar(select(Property).where(Property.slug == "deca-aurora-heights"))
        prop.price_from = 999_000
        await s.commit()
    d = (await client.get("/api/v1/properties/deca-aurora-heights")).json()
    assert d["price_from"] == 999_000


async def test_unit_number_is_unique_per_building(seeded, session_factory):
    async with session_factory() as s:
        first = await s.scalar(select(Unit))
        s.add(Unit(building_id=first.building_id, unit_type_id=first.unit_type_id, unit_number=first.unit_number))
        with pytest.raises(IntegrityError):
            await s.commit()


async def test_seed_is_idempotent(session_factory, seeded):
    from backend.seed import seed_demo_data
    async with session_factory() as s:
        assert await seed_demo_data(s) == 0


async def test_inquiry_validation_and_honeypot(client):
    ok = await client.post("/api/v1/inquiries", json=VALID)
    assert ok.status_code == 201 and ok.json()["id"] > 0
    assert (await client.post("/api/v1/inquiries", json={**VALID, "email": "nope"})).status_code == 422
    assert (await client.post("/api/v1/inquiries", json={**VALID, "phone": "12345"})).status_code == 422
    assert (await client.post("/api/v1/inquiries", json={**VALID, "message": "hi"})).status_code == 422
    assert (await client.post("/api/v1/inquiries", json={**VALID, "kind": "quote", "message": ""})).status_code == 201
    bot = await client.post("/api/v1/inquiries", json={**VALID, "website": "http://spam"})
    assert bot.status_code == 201 and bot.json()["id"] == 0
