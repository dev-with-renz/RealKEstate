"""Seed Urban Deca Homes Ortigas and Cubao.

Run from the repository root with:
    uv run --project backend python -m backend.seed_urban_deca
"""
from decimal import Decimal
import asyncio
import selectors
import sys

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.db.session import SessionLocal, engine
from backend.app.models import Building, Property, Unit, UnitType

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


def _price_in_range(minimum: int, maximum: int, index: int, count: int) -> Decimal:
    if count <= 1:
        return Decimal(minimum)
    price = minimum + (maximum - minimum) * index / (count - 1)
    return Decimal(int(round(price / 1_000)) * 1_000)


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


async def seed_urban_deca_data(session: AsyncSession) -> int:
    created = int(await _seed_ortigas(session))
    created += int(await _seed_cubao(session))
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
