"""Seed Urban Deca Homes Ortigas, Cubao, and Manila.

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

ORTIGAS_NEARBY_PLACES = [
    ("Ortigas Ave. Extension - jeepneys, PUVs, UV Express vans and buses", "transport", "24/7 west to Ortigas/Quiapo; east to Rizal", None),
    ("C-5 Road & Marcos Highway", "transport", "Minutes via Ortigas Ave. or Amang Rodriguez Ave.", None),
    ("Santolan LRT-2 & Ortigas MRT-3 Stations", "transport", "One jeepney/UV via Amang Rodriguez or Ortigas Ave.", None),
    ("Future MRT-4 - proposed Rosario and SM City East Ortigas stations", "transport", "Planned along Ortigas Ave. Extension", None),
    ("NU East Ortigas", "school", "Next to SM City East Ortigas; minutes away", None),
    ("Pasig City Institute of Science and Technology - Manggahan", "school", "Nearby TESDA-registered tech-voc campus", None),
    ("Rizal Technological University (RTU) - Pasig Campus", "school", "Eusebio Ave.; engineering/architecture/tech", None),
    ("University of Asia and the Pacific (UA&P)", "school", "About 20 min drive from Ortigas Center", None),
    ("Holylife Hospital", "hospital", "24/7 community hospital in Lifehomes/Rosario", None),
    ("Mission Hospital", "hospital", "24/7 emergency/general; Km 17, Ortigas Ave. Ext.", None),
    ("Ortigas Hospital & Healthcare Center", "hospital", "Level 2 tertiary; Km 21, Cainta", None),
    ("The Medical City", "hospital", "Tertiary hospital along Ortigas Ave. in Pasig", None),
    ("Choice Market Ortigas Satellite Offices", "government", "NBI, Pag-IBIG, LTO and National ID counters", None),
    ("SSS Pasig - Rosario Branch", "government", "About 10 min drive; Dr. Sixto Antonio Ave.", None),
    ("Pag-IBIG Fund - Ayala Malls The 30th & Pasig BOSS", "government", "Meralco Ave.; service centers open Tue-Sat", None),
    ("Robinsons Galleria Government Centers", "government", "DFA Passport and NBI satellite offices", None),
    ("Choice Market Ortigas - market and supermarket", "primary_need", "About 5 min drive; wet/dry market and eateries", None),
    ("Cainta Public Market", "primary_need", "About 6 min drive; wet/dry market", None),
    ("Pasig Mega Market (Pasig Palengke)", "primary_need", "About 20 min drive; three-level public market", None),
    ("Super 8 Grocery Warehouse & on-site commercial strip", "primary_need", "Bulk groceries, convenience stores and dining", None),
    ("SM City East Ortigas (supermarket, cinema and dining)", "mall", "Short jeepney/tricycle ride", None),
    ("Robinsons Galleria", "mall", "EDSA-Ortigas; near MRT-3, supermarkets and retail", None),
    ("Estancia (Capitol Commons)", "mall", "Meralco Ave.; Unimart, cinemas and park dining", None),
]

CUBAO_NEARBY_PLACES = [
    ("MRT-3 & LRT-2 Araneta Center-Cubao Stations", "transport", "Short walk; north-south and east-west rail", None),
    ("EDSA Carousel & provincial bus terminals", "transport", "Immediate access in Araneta City and Aurora Blvd.", None),
    ("EDSA, Aurora Blvd., P. Tuazon Blvd. & C-5", "transport", "Direct EDSA frontage; routes across Metro Manila", None),
    ("Samson College of Science and Technology", "school", "Walking distance in Cubao", None),
    ("Technological Institute of the Philippines (T.I.P.) - Quezon City", "school", "Nearby along Aurora Blvd.", None),
    ("National College of Business and Arts (NCBA) - Cubao & AMA Computer College", "school", "Minutes along Aurora/P. Tuazon Blvd.", None),
    ("UERM & Central Colleges of the Philippines (CCP)", "school", "Short jeepney/LRT-2 ride west on Aurora Blvd.", None),
    ("World Citi Medical Center", "hospital", "Along Aurora Blvd. in Cubao", None),
    ("PNP General Hospital", "hospital", "Camp Crame", None),
    ("Victoriano Luna Medical Center (AFP Medical Center)", "hospital", "V. Luna Road", None),
    ("Quirino Memorial Medical Center", "hospital", "Project 4, Quezon City", None),
    ("St. Luke's Medical Center - Quezon City", "hospital", "Short drive", None),
    ("East Avenue Medical Center", "hospital", "Short drive", None),
    ("Ali Mall Government Express Center (DFA, SSS, Pag-IBIG, PhilHealth, NBI, PRC)", "government", "Inside Ali Mall; walking distance", None),
    ("LTO Araneta City Licensing Center", "government", "Within the Araneta City commercial district", None),
    ("Camp Crame & Camp Aguinaldo", "government", "PNP and AFP headquarters south along EDSA", None),
    ("Quezon City Hall", "government", "Short ride north via EDSA and East Avenue", None),
    ("Farmers Market", "primary_need", "Across EDSA; fresh seafood, meat and produce", None),
    ("Arayat Market (Cubao Public Market)", "primary_need", "Along P. Arayat St.; local wet/dry market", None),
    ("Shopwise, Puregold & SaveMore Araneta City", "primary_need", "Supermarkets within walking distance", None),
    ("On-site commercial spaces", "primary_need", "Tower retail and commercial laundromat", None),
    ("Farmers Plaza & SM Araneta City", "mall", "Across EDSA; bridgeway access to MRT-3", None),
    ("Gateway Mall 1 & 2 (retail, dining, cinemas and Coliseum)", "mall", "Walking distance in Araneta City", None),
    ("Ali Mall & Spark Place", "mall", "Along P. Tuazon Blvd.; easy walking distance", None),
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


async def _ensure_nearby_places(
    session: AsyncSession,
    property_id: int,
    places: list[tuple[str, str, str | None, float | None]],
) -> None:
    existing = set(
        (
            await session.execute(
                select(NearbyPlace.name, NearbyPlace.category).where(
                    NearbyPlace.property_id == property_id
                )
            )
        ).all()
    )
    session.add_all(
        NearbyPlace(
            property_id=property_id,
            name=name,
            category=category,
            distance_text=distance_text,
            distance_km=distance_km,
        )
        for name, category, distance_text, distance_km in places
        if (name, category) not in existing
    )


async def _seed_ortigas(session: AsyncSession) -> bool:
    slug = "urban-deca-homes-ortigas"
    existing = await session.scalar(select(Property).where(Property.slug == slug))
    if existing is not None:
        await _ensure_nearby_places(session, existing.id, ORTIGAS_NEARBY_PLACES)
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

    await _ensure_nearby_places(session, prop.id, ORTIGAS_NEARBY_PLACES)
    return True


async def _seed_cubao(session: AsyncSession) -> bool:
    slug = "urban-deca-homes-cubao"
    existing = await session.scalar(select(Property).where(Property.slug == slug))
    if existing is not None:
        await _ensure_nearby_places(session, existing.id, CUBAO_NEARBY_PLACES)
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
    await _ensure_nearby_places(session, prop.id, CUBAO_NEARBY_PLACES)
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
