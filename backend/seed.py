"""Demo data so the website has something to show.   Run:  uv run python -m app.seed

Everything here is SAMPLE content (fictional project names, generic nearby places, placeholder SVG pictures).
Replace it with real DECA HOMES data. Safe to re-run: existing rows are reused, never duplicated.
"""
import asyncio
import selectors
import sys
from decimal import Decimal

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.db.session import SessionLocal, engine
from backend.app.models import Amenity, Building, NearbyPlace, Property, Unit, UnitType

COMMUNITY_AMENITIES = [
    ("Swimming Pool", "pool", "outdoor"), ("Playground", "playground", "outdoor"), ("Covered Court", "court", "outdoor"),
    ("Landscaped Garden", "garden", "outdoor"), ("Function Room", "room", "indoor"), ("Fitness Gym", "gym", "indoor"),
    ("24/7 Security", "shield", "indoor"),
]

# Reusable blueprints (your UnitType). The price is NOT here: it lives on each Unit.
BLUEPRINTS = [
    dict(code="STU-24", name="Studio", bedrooms=0, bathrooms=1, sqm="24.00", base=1_850_000, style="Open plan",
         images=["/images/studio-1.svg", "/images/studio-2.svg"],
         description="A smart open-plan home for starters, solo professionals and investors.",
         amenities=["Open-plan living and sleeping area", "Compact kitchenette with counter", "Tiled bathroom",
                    "Provision for split-type aircon", "Window with natural light"]),
    dict(code="1BR-32", name="1 Bedroom", bedrooms=1, bathrooms=1, sqm="32.50", base=2_650_000, style="Classic",
         images=["/images/1br-1.svg", "/images/1br-2.svg"],
         description="Room to breathe: a separate bedroom and a living area that fits a small family or a couple.",
         amenities=["Separate bedroom with closet space", "Living and dining area", "Kitchen with counter and sink",
                    "Tiled bathroom", "Balcony or utility area (selected units)"]),
    dict(code="2BR-46", name="2 Bedroom", bedrooms=2, bathrooms=2, sqm="46.00", base=3_800_000, style="Family",
         images=["/images/2br-1.svg", "/images/2br-2.svg"],
         description="Made for growing families, with two bedrooms and generous shared space.",
         amenities=["Two bedrooms", "Spacious living and dining area", "Full kitchen with provision for appliances",
                    "Tiled bathroom", "Balcony or utility area (selected units)"]),
]

# (name, category, distance text, km). Categories: school | hospital | government | primary_need | mall
NEARBY = [
    ("Public elementary and high school", "school", "5 to 10 mins", 1.0),
    ("Private school and daycare", "school", "10 mins", 2.0),
    ("Community hospital", "hospital", "10 mins", 3.0),
    ("Health center and clinics", "hospital", "5 mins", 0.8),
    ("Municipal hall", "government", "10 mins", 2.5),
    ("Barangay hall and police station", "government", "5 mins", 0.6),
    ("Public market", "primary_need", "5 mins", 0.9),
    ("Supermarket and pharmacy", "primary_need", "8 mins", 1.4),
    ("Neighborhood mall", "mall", "15 mins", 4.5),
]

STATUS_CYCLE = ["available", "available", "reserved", "available", "sold", "available"]

PROPERTIES = [
    dict(slug="deca-aurora-heights", name="DECA Aurora Heights", tagline="Everyday comfort, within reach.",
         location="San Jose del Monte, Bulacan", vibes=["family", "practical"], factor=1.0,
         images=["/images/aurora-1.svg", "/images/aurora-2.svg", "/images/aurora-3.svg"],
         amenities=["Playground", "Covered Court", "24/7 Security", "Landscaped Garden"],
         description="A community built around family routines: short walks to the essentials, space for kids to play and homes priced for real budgets.\n\nSample description. Replace this with the official project overview.",
         buildings=["Tower A", "Tower B"]),
    dict(slug="deca-marigold-grove", name="DECA Marigold Grove", tagline="Bright, modern and easy to live in.",
         location="Imus, Cavite", vibes=["contemporary", "modern"], factor=1.12,
         images=["/images/marigold-1.svg", "/images/marigold-2.svg", "/images/marigold-3.svg"],
         amenities=["Swimming Pool", "Function Room", "24/7 Security", "Fitness Gym"],
         description="Clean lines, warm colors and thoughtful layouts, close to the roads and services you use every day.\n\nSample description. Replace this with the official project overview.",
         buildings=["Tower A", "Tower B"]),
    dict(slug="deca-solana-vista", name="DECA Solana Vista", tagline="A stylish address that stays practical.",
         location="Mabalacat, Pampanga", vibes=["stylish", "modern"], factor=1.25,
         images=["/images/solana-1.svg", "/images/solana-2.svg", "/images/solana-3.svg"],
         amenities=["Swimming Pool", "Fitness Gym", "Landscaped Garden", "24/7 Security"],
         description="Skyline views, a modern look and homes that still make financial sense.\n\nSample description. Replace this with the official project overview.",
         buildings=["Tower A"]),
]


async def _amenity(session: AsyncSession, name: str, category: str, icon: str | None = None) -> Amenity:
    found = await session.scalar(select(Amenity).where(Amenity.name == name))
    if found is None:
        found = Amenity(name=name, category=category, icon=icon)
        session.add(found)
        await session.flush()
    return found


async def _blueprint(session: AsyncSession, spec: dict) -> UnitType:
    found = await session.scalar(select(UnitType).where(UnitType.code == spec["code"]))
    if found is None:
        found = UnitType(
            code=spec["code"], name=spec["name"], bedrooms=spec["bedrooms"], bathrooms=spec["bathrooms"],
            floor_area=Decimal(spec["sqm"]), style=spec["style"], description=spec["description"], images=spec["images"],
        )
        found.amenities = [await _amenity(session, n, "unit") for n in spec["amenities"]]
        session.add(found)
        await session.flush()
    return found


async def seed_demo_data(session: AsyncSession) -> int:
    for name, icon, category in COMMUNITY_AMENITIES:
        await _amenity(session, name, category, icon)
    blueprints = [(spec, await _blueprint(session, spec)) for spec in BLUEPRINTS]

    created = 0
    for spec in PROPERTIES:
        if await session.scalar(select(Property.id).where(Property.slug == spec["slug"])):
            continue  # already seeded: never create duplicates
        prop = Property(
            slug=spec["slug"], name=spec["name"], tagline=spec["tagline"], description=spec["description"],
            location=spec["location"], address=spec["location"], vibes=spec["vibes"], images=spec["images"],
        )
        prop.amenities = [await _amenity(session, n, "outdoor") for n in spec["amenities"]]
        prop.nearby_places = [
            NearbyPlace(name=n, category=c, distance_text=t, distance_km=km) for n, c, t, km in NEARBY
        ]
        for b_index, building_name in enumerate(spec["buildings"]):
            building = Building(
                name=building_name, floors=12 + 2 * b_index, sort_order=b_index,
                images=[f"/images/tower-{(b_index % 3) + 1}.svg"],
                description=f"{building_name} with elevators, secured lobby and ground-floor commercial spaces. Sample description.",
            )
            for bp_index, (bp_spec, bp) in enumerate(blueprints):
                for n, status in enumerate(STATUS_CYCLE):
                    floor = n + 2
                    price = round(bp_spec["base"] * spec["factor"] * (1 + 0.04 * b_index) + 15_000 * n, -3)
                    building.units.append(
                        Unit(unit_type_id=bp.id, unit_number=f"{floor}{'ABC'[bp_index]}", floor=floor,
                             status=status, price=Decimal(str(int(price))))
                    )
            prop.buildings.append(building)
        session.add(prop)
        created += 1
    await session.commit()
    return created


async def main() -> None:
    try:
        async with SessionLocal() as session:
            created = await seed_demo_data(session)
    finally:
        await engine.dispose()
    print(f"Seed complete: {created} new propert{'y' if created == 1 else 'ies'} added.")


def run() -> None:
    if sys.platform == "win32":
        asyncio.run(
            main(),
            loop_factory=lambda: asyncio.SelectorEventLoop(selectors.SelectSelector()),
        )
    else:
        asyncio.run(main())


if __name__ == "__main__":
    run()
