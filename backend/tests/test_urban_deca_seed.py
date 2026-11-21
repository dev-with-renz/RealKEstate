from sqlalchemy import func, select

from backend.app.models import Building, Property, Unit, UnitType
from backend.seed_urban_deca import seed_urban_deca_data


async def test_urban_deca_seed_has_requested_inventory_and_prices(session_factory):
    async with session_factory() as session:
        assert await seed_urban_deca_data(session) == 2
        assert await seed_urban_deca_data(session) == 0

        ortigas_buildings = await session.scalar(
            select(func.count(Building.id))
            .join(Property)
            .where(Property.slug == "urban-deca-homes-ortigas")
        )
        cubao_buildings = await session.scalar(
            select(func.count(Building.id))
            .join(Property)
            .where(Property.slug == "urban-deca-homes-cubao")
        )
        assert ortigas_buildings == 22
        assert cubao_buildings == 1

        ortigas_prices = (
            await session.execute(
                select(UnitType.bedrooms, func.min(Unit.price), func.max(Unit.price), func.count(Unit.id))
                .join(Unit)
                .join(Building)
                .join(Property)
                .where(Property.slug == "urban-deca-homes-ortigas")
                .group_by(UnitType.bedrooms)
            )
        ).all()
        cubao_prices = (
            await session.execute(
                select(UnitType.name, func.min(Unit.price), func.max(Unit.price))
                .join(Unit)
                .join(Building)
                .join(Property)
                .where(Property.slug == "urban-deca-homes-cubao")
                .group_by(UnitType.name)
            )
        ).all()
        assert {bedrooms: (minimum, maximum, count) for bedrooms, minimum, maximum, count in ortigas_prices} == {
            2: (3_312_000, 3_968_000, 66),
            3: (4_320_000, 4_638_000, 22),
        }
        assert {(name, minimum, maximum) for name, minimum, maximum in cubao_prices} == {
            ("Studio", 1_987_500, 2_572_000),
            ("1 Bedroom", 4_145_100, 4_767_000),
        }

        ortigas_types = (
            await session.execute(
                select(UnitType.name, UnitType.floor_area)
                .join(Unit)
                .join(Building)
                .join(Property)
                .where(Property.slug == "urban-deca-homes-ortigas")
                .distinct()
            )
        ).all()
        assert {(name, str(area)) for name, area in ortigas_types} == {
            ("2 Bedroom A", "35.56"),
            ("2 Bedroom B", "30.60"),
            ("2 Bedroom C", "35.57"),
            ("3 Bedroom A", "42.07"),
        }


async def test_property_list_prioritizes_ortigas_cubao_then_manila(client, session_factory, seeded):
    async with session_factory() as session:
        await seed_urban_deca_data(session)
        session.add(
            Property(
                name="Manila Community",
                slug="manila-community",
                location="Manila",
            )
        )
        await session.commit()

    properties = (await client.get("/api/v1/properties")).json()
    assert [property["slug"] for property in properties[:3]] == [
        "urban-deca-homes-ortigas",
        "urban-deca-homes-cubao",
        "manila-community",
    ]
