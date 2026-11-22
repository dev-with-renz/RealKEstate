from sqlalchemy import delete, func, select

from backend.app.models import Amenity, Building, NearbyPlace, Property, Unit, UnitType
from backend.seed_urban_deca import seed_urban_deca_data


async def test_urban_deca_seed_has_requested_inventory_and_prices(session_factory):
    async with session_factory() as session:
        assert await seed_urban_deca_data(session) == 3
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
        manila_buildings = await session.scalar(
            select(func.count(Building.id))
            .join(Property)
            .where(Property.slug == "urban-deca-homes-manila")
        )
        assert ortigas_buildings == 22
        assert cubao_buildings == 1
        assert manila_buildings == 13

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

        manila_prices = (
            await session.execute(
                select(func.min(Unit.price), func.max(Unit.price), func.count(Unit.id))
                .join(Building)
                .join(Property)
                .where(Property.slug == "urban-deca-homes-manila")
            )
        ).one()
        assert manila_prices == (1_640_000, 3_550_000, 13 * 6)

        manila_types = (
            await session.execute(
                select(UnitType.name, UnitType.floor_area)
                .join(Unit)
                .join(Building)
                .join(Property)
                .where(Property.slug == "urban-deca-homes-manila")
                .distinct()
            )
        ).all()
        assert {(name, str(area)) for name, area in manila_types} == {
            ("Studio", "22.95"),
            ("1 Bedroom", "27.42"),
            ("2 Bedroom A", "32.17"),
            ("2 Bedroom B", "30.60"),
            ("2 Bedroom C", "45.90"),
            ("2 Bedroom D", "34.42"),
        }

        manila_amenities = set(
            (
                await session.scalars(
                    select(Amenity.name)
                    .join(Amenity.properties)
                    .where(Property.slug == "urban-deca-homes-manila")
                )
            ).all()
        )
        assert "Deca Mall" in manila_amenities
        assert "24/7 Security with RFID Elevator Access" in manila_amenities

        nearby_categories = set(
            (
                await session.scalars(
                    select(NearbyPlace.category)
                    .join(Property)
                    .where(Property.slug == "urban-deca-homes-manila")
                )
            ).all()
        )
        assert nearby_categories == {"transport", "school", "hospital", "mall", "government"}

        for slug, expected_count in (
            ("urban-deca-homes-ortigas", 23),
            ("urban-deca-homes-cubao", 24),
        ):
            property_places = (
                await session.execute(
                    select(NearbyPlace.name, NearbyPlace.category)
                    .join(Property)
                    .where(Property.slug == slug)
                )
            ).all()
            assert len(property_places) == expected_count
            assert {category for _, category in property_places} == {
                "transport",
                "school",
                "hospital",
                "government",
                "primary_need",
                "mall",
            }

        assert await session.scalar(
            select(func.max(func.length(NearbyPlace.distance_text))).where(
                NearbyPlace.property_id.in_(
                    select(Property.id).where(
                        Property.slug.in_(
                            ["urban-deca-homes-ortigas", "urban-deca-homes-cubao"]
                        )
                    )
                )
            )
        ) <= 50

        await session.execute(
            delete(NearbyPlace).where(
                NearbyPlace.property_id.in_(
                    select(Property.id).where(
                        Property.slug.in_(
                            ["urban-deca-homes-ortigas", "urban-deca-homes-cubao"]
                        )
                    )
                )
            )
        )
        await session.commit()
        assert await seed_urban_deca_data(session) == 0
        assert await session.scalar(
            select(func.count(NearbyPlace.id))
            .join(Property)
            .where(Property.slug == "urban-deca-homes-ortigas")
        ) == 23
        assert await session.scalar(
            select(func.count(NearbyPlace.id))
            .join(Property)
            .where(Property.slug == "urban-deca-homes-cubao")
        ) == 24


async def test_property_list_prioritizes_ortigas_cubao_then_manila(client, session_factory, seeded):
    async with session_factory() as session:
        await seed_urban_deca_data(session)

    properties = (await client.get("/api/v1/properties")).json()
    assert [property["slug"] for property in properties[:3]] == [
        "urban-deca-homes-ortigas",
        "urban-deca-homes-cubao",
        "urban-deca-homes-manila",
    ]
    manila = (await client.get("/api/v1/properties/urban-deca-homes-manila")).json()
    assert "Deca Mall" in manila["amenities"]
    assert "Transit & Major Road Access" in manila["nearby"]
    ortigas = (await client.get("/api/v1/properties/urban-deca-homes-ortigas")).json()
    cubao = (await client.get("/api/v1/properties/urban-deca-homes-cubao")).json()
    assert "Transit & Major Road Access" in ortigas["nearby"]
    assert "Primary Needs" in ortigas["nearby"]
    assert "Transit & Major Road Access" in cubao["nearby"]
