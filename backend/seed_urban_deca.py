"""Seed Urban Deca Homes Ortigas and Cubao.

Run from the repository root with:
    uv run --project backend python -m backend.seed_urban_deca
"""
from decimal import Decimal
import asyncio
import selectors
import sys

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.db.session import SessionLocal, engine
from backend.app.models import Amenity, Building, NearbyPlace, Property, Unit, UnitType

ORTIGAS_UNIT_TYPES = [
    ("UDHO-2BR-A", "2 Bedroom A", 2, "35.56", "A"),
    ("UDHO-2BR-B", "2 Bedroom B", 2, "30.60", "B"),
    ("UDHO-2BR-C", "2 Bedroom C", 2, "35.57", "C"),
    ("UDHO-3BR-A", "3 Bedroom A", 3, "42.07", "D"),
]

ORTIGAS_PRICE_RANGES = {
    2: (3_312_000, 3_968_000),
    3: (4_320_000, 4_638_000),
}

CUBAO_UNIT_TYPES = [
    ("UDHC-STU", "Studio", 0, None, "STU", 1_987_500, 2_572_000),
    ("UDHC-1BR", "1 Bedroom", 1, None, "1BR", 4_145_100, 4_767_000),
]

MANILA_UNIT_TYPES = [
    ("UDHM-STU", "Studio", 0, "22.95", "STU"),
    ("UDHM-1BR", "1 Bedroom", 1, "27.42", "1BR"),
    ("UDHM-2BR-A", "2 Bedroom A", 2, "32.17", "2BRA"),
    ("UDHM-2BR-B", "2 Bedroom B", 2, "30.60", "2BRB"),
    ("UDHM-2BR-C", "2 Bedroom C", 2, "45.90", "2BRC"),
    ("UDHM-2BR-D", "2 Bedroom D", 2, "34.42", "2BRD"),
]

MANILA_AMENITIES = [
    ("Deca Mall", "mall", "mall"),
    ("Swimming Pool", "outdoor", "pool"),
    ("Covered Basketball Court", "outdoor", "court"),
    ("Clubhouse", "indoor", "home"),
    ("Children's Playground", "outdoor", "playground"),
    ("Landscaped Pocket Parks", "outdoor", "garden"),
    ("24/7 Security with RFID Elevator Access", "indoor", "shield"),
]

MANILA_NEARBY_PLACES = [
    ("Tayuman LRT Station", "transport", "13-15 min drive or short jeepney ride", None),
    ("Abad Santos LRT Station", "transport", "13-15 min drive or short jeepney ride", None),
    ("R-10 (Mel Lopez Blvd) & NLEX Harbor Link", "transport", "Direct coastal highway access", None),
    ("Immaculate Conception Academy", "school", "Walking distance (~900 m)", 0.9),
    ("Emilio Jacinto Elementary School", "school", "Walking distance (~900 m)", 0.9),
    ("Chiang Kai Shek College", "school", "About 15 min drive", None),
    ("University Belt (Sampaloc)", "school", "About 15-20 min drive or LRT-1/jeepney", None),
    ("Mapúa University", "school", "About 18 min via Mel Lopez Blvd (R-10)", None),
    ("Tondo Medical Center", "hospital", "About 5 min drive", None),
    ("Ospital ng Tondo", "hospital", None, None),
    ("Gat Andres Bonifacio Memorial Medical Center", "hospital", "About 15 min drive", None),
    ("Metropolitan Medical Center", "hospital", "About 16-17 min drive", None),
    ("Chinese General Hospital", "hospital", "About 16-17 min drive", None),
    ("Deca Mall", "mall", "Inside the community", None),
    ("SM City San Lazaro", "mall", "Short jeepney ride along Tayuman", None),
    ("Tutuban Center", "mall", "About 15 min", None),
    ("Lucky Chinatown Mall", "mall", "About 15 min", None),
    ("PHLPost Tondo", "government", None, None),
    ("Raxabago Police Station (PS-1)", "government", None, None),
    ("Moriones-Tondo Police Station (PS-2)", "government", None, None),
    ("Tondo Health Center (Health District II Office)", "government", None, None),
]


async def _unit_type(
    session: AsyncSession,
    code: str,
    name: str,
    bedrooms: int,
    floor_area: str | None,
) -> UnitType:
    found = await session.scalar(select(UnitType).where(UnitType.code == code))
    if found is None:
        found = UnitType(
            code=code,
            name=name,
            bedrooms=bedrooms,
            floor_area=Decimal(floor_area) if floor_area is not None else None,
        )
        session.add(found)
        await session.flush()
    return found


async def _amenity(
    session: AsyncSession,
    name: str,
    category: str,
    icon: str,
) -> Amenity:
    found = await session.scalar(select(Amenity).where(Amenity.name == name))
    if found is None:
        found = Amenity(name=name, category=category, icon=icon)
        session.add(found)
        await session.flush()
    return found


def _price_in_range(minimum: int, maximum: int, index: int, count: int) -> Decimal:
    if count <= 1:
        return Decimal(minimum)
    price = minimum + (maximum - minimum) * index / (count - 1)
    return Decimal(int(round(price / 1_000)) * 1_000)


def _manila_price(floor_area: str) -> Decimal:
    min_area, max_area = Decimal("22.95"), Decimal("45.90")
    min_price, max_price = Decimal(1_640_000), Decimal(3_550_000)
    proportion = (Decimal(floor_area) - min_area) / (max_area - min_area)
    price = min_price + proportion * (max_price - min_price)
    return (price / 1_000).quantize(Decimal("1")) * 1_000


async def _seed_ortigas(session: AsyncSession) -> bool:
    slug = "urban-deca-homes-ortigas"
    if await session.scalar(select(Property.id).where(Property.slug == slug)):
        return False

    prop = Property(
        slug=slug,
        name="Urban Deca Homes Ortigas",
        location="Ortigas",
        address="Ortigas",
        description="A multi-building mid-rise residential community along the Ortigas corridor featuring compact 2- and 3-bedroom layouts, shared open spaces, and convenient access to business districts, schools, retail, and public transit.",
        tagline="Mid-rise family and commuter living near Ortigas.",
        vibes=["family", "practical"],
        images=[],
    )
    session.add(prop)
    await session.flush()
    unit_types = [
        await _unit_type(session, code, name, bedrooms, area)
        for code, name, bedrooms, area, _ in ORTIGAS_UNIT_TYPES
    ]

    for building_index in range(22):
        building_number = building_index + 1
        units = []
        for spec_index, (code, name, bedrooms, _, suffix) in enumerate(ORTIGAS_UNIT_TYPES):
            matching_specs = [
                i for i, spec in enumerate(ORTIGAS_UNIT_TYPES) if spec[2] == bedrooms
            ]
            price_index = building_index * len(matching_specs) + matching_specs.index(spec_index)
            minimum, maximum = ORTIGAS_PRICE_RANGES[bedrooms]
            price = _price_in_range(
                minimum,
                maximum,
                price_index,
                22 * len(matching_specs),
            )
            units.append(
                Unit(
                    unit_type=unit_types[spec_index],
                    unit_number=f"{building_number}-{suffix}",
                    price=price,
                    status="available",
                )
            )
        session.add(
            Building(
                property_id=prop.id,
                name=f"Building {building_number}",
                sort_order=building_index,
                description=f"Building {building_number} of Urban Deca Homes Ortigas.",
                images=[],
                units=units,
            )
        )

    return True


async def _seed_cubao(session: AsyncSession) -> bool:
    slug = "urban-deca-homes-cubao"
    if await session.scalar(select(Property.id).where(Property.slug == slug)):
        return False

    prop = Property(
        slug=slug,
        name="Urban Deca Homes Cubao",
        location="Cubao",
        address="Cubao",
        description="A vertical residential development in Cubao, Quezon City tailored for students, working professionals, and city dwellers who want studio or one-bedroom living close to MRT/LRT lines, malls, offices, and daily essentials.",
        tagline="City living steps from Cubao's transit and hubs.",
        vibes=["family", "practical"],
        images=[],
    )
    session.add(prop)
    await session.flush()
    units = []
    unit_types = [
        await _unit_type(session, code, name, bedrooms, area)
        for code, name, bedrooms, area, _, _, _ in CUBAO_UNIT_TYPES
    ]
    for spec_index, (code, name, bedrooms, area, suffix, minimum, maximum) in enumerate(
        CUBAO_UNIT_TYPES
    ):
        unit_type = unit_types[spec_index]
        for sample_index, price in enumerate((minimum, maximum), start=1):
            units.append(
                Unit(
                    unit_type=unit_type,
                    unit_number=f"{suffix}-{sample_index}",
                    price=Decimal(price),
                    status="available",
                )
            )
    session.add(
        Building(
            property_id=prop.id,
            name="Building 1",
            sort_order=0,
            description="Building 1 of Urban Deca Homes Cubao.",
            images=[],
            units=units,
        )
    )
    return True


async def _seed_manila(session: AsyncSession) -> bool:
    slug = "urban-deca-homes-manila"
    if await session.scalar(select(Property.id).where(Property.slug == slug)):
        return False

    unit_types = [
        await _unit_type(session, code, name, bedrooms, area)
        for code, name, bedrooms, area, _ in MANILA_UNIT_TYPES
    ]
    amenities = [
        await _amenity(session, name, category, icon)
        for name, category, icon in MANILA_AMENITIES
    ]

    buildings = []
    for building_index in range(13):
        building_number = building_index + 1
        units = [
            Unit(
                unit_type=unit_types[spec_index],
                unit_number=f"{building_number}-{suffix}",
                price=_manila_price(area),
                status="available",
            )
            for spec_index, (_, _, _, area, suffix) in enumerate(MANILA_UNIT_TYPES)
        ]
        buildings.append(
            Building(
                name=f"Building {building_number}",
                sort_order=building_index,
                description=f"Building {building_number} of Urban Deca Homes Manila.",
                images=[],
                units=units,
            )
        )

    prop = Property(
        slug=slug,
        name="Urban Deca Homes Manila",
        location="Tondo, Manila",
        address="Tondo, Manila",
        tagline="City living close to transit and daily essentials.",
        description="A residential community in Tondo, Manila with studio, one-bedroom, and two-bedroom homes, an on-site Deca Mall, shared amenities, and access to LRT-1, major roads, schools, hospitals, and daily services.",
        vibes=["urban", "practical"],
        images=[],
        amenities=amenities,
        nearby_places=[
            NearbyPlace(name=name, category=category, distance_text=text, distance_km=km)
            for name, category, text, km in MANILA_NEARBY_PLACES
        ],
        buildings=buildings,
    )
    session.add(prop)
    return True


async def seed_urban_deca_data(session: AsyncSession) -> int:
    created = int(await _seed_ortigas(session))
    created += int(await _seed_cubao(session))
    created += int(await _seed_manila(session))
    await session.commit()
    return created


async def main() -> None:
    try:
        async with SessionLocal() as session:
            created = await seed_urban_deca_data(session)
    finally:
        await engine.dispose()
    print(f"Seed complete: {created} new Urban Deca Homes propert{'y' if created == 1 else 'ies'} added.")


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
