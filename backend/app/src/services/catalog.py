from dataclasses import dataclass

from sqlalchemy import and_, exists, or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from backend.app.src.models.catalog import Building, NearbyPlace, Property, Unit, UnitType
from backend.app.src.schemas.catalog import PropertyDetail, PropertySummary, BuildingOut, UnitTypeOut

ESC = "\\"

LIST_EAGER = (selectinload(Property.buildings).selectinload(Building.units).selectinload(Unit.unit_type),)
DETAIL_EAGER = (
    selectinload(Property.amenities),
    selectinload(Property.nearby_places),
    selectinload(Property.buildings)
    .selectinload(Building.units)
    .selectinload(Unit.unit_type)
    .selectinload(UnitType.amenities),
)

# NearbyPlace.category -> heading on the website. Unknown categories fall back to a Title Case heading.
NEARBY_LABELS = {
    "school": "Schools",
    "hospital": "Hospitals",
    "government": "Government Agencies",
    "primary_need": "Primary Needs",
    "mall": "Malls",
}


@dataclass(slots=True)
class PropertyFilters:
    q: str | None = None  # property, building, unit type or unit number
    location: str | None = None
    bedrooms: int | None = None  # 0 = studio
    min_price: float | None = None
    max_price: float | None = None
    limit: int = 24
    offset: int = 0


def _like(term: str) -> str:
    """Escape LIKE wildcards so a search for '50%' is literal."""
    escaped = term.strip().replace(ESC, ESC + ESC).replace("%", ESC + "%").replace("_", ESC + "_")
    return f"%{escaped}%"


def _is_available(unit: Unit) -> bool:
    return unit.status == "available"


def _starting_price(units: list[Unit]) -> float | None:
    """Cheapest priced unit, preferring ones still available."""
    priced = [u for u in units if u.price is not None]
    pool = [u for u in priced if _is_available(u)] or priced
    return float(min(u.price for u in pool)) if pool else None


def _all_units(p: Property) -> list[Unit]:
    return [u for b in p.buildings for u in b.units]


def _summary(p: Property) -> PropertySummary:
    units = _all_units(p)
    prices = [float(u.price) for u in units if u.price is not None]
    return PropertySummary(
        id=p.id,
        slug=p.slug,
        name=p.name,
        tagline=p.tagline,
        location=p.location,
        vibes=list(p.vibes or []),
        cover_image=(p.images or [None])[0],
        # An explicit Property.price_from wins; otherwise it is computed from the units.
        price_from=float(p.price_from) if p.price_from is not None else _starting_price(units),
        price_to=max(prices) if prices else None,
        bedrooms=sorted({u.unit_type.bedrooms for u in units}),
        building_count=len(p.buildings),
        available_units=sum(1 for u in units if _is_available(u)),
    )


def _nearby(places: list[NearbyPlace]) -> dict[str, list[str]]:
    order = list(NEARBY_LABELS)
    ranked = sorted(
        places,
        key=lambda n: (order.index(n.category) if n.category in order else len(order),
                       n.distance_km if n.distance_km is not None else 999),
    )
    grouped: dict[str, list[str]] = {}
    for n in ranked:
        label = NEARBY_LABELS.get(n.category, n.category.replace("_", " ").title())
        extra = n.distance_text or (f"{n.distance_km:g} km" if n.distance_km is not None else None)
        grouped.setdefault(label, []).append(f"{n.name} ({extra})" if extra else n.name)
    return grouped


def _building_out(b: Building) -> BuildingOut:
    """Group the building's units by blueprint: that is what the listing page shows as 'unit types'."""
    by_type: dict[int, list[Unit]] = {}
    for unit in b.units:
        by_type.setdefault(unit.unit_type_id, []).append(unit)

    unit_types = []
    for units in by_type.values():
        ut = units[0].unit_type
        unit_types.append(
            UnitTypeOut(
                id=ut.id,
                name=ut.name,
                bedrooms=ut.bedrooms,
                bathrooms=ut.bathrooms,
                floor_area_sqm=float(ut.floor_area) if ut.floor_area is not None else None,
                price=_starting_price(units),
                description=ut.description or "",
                amenities=[a.name for a in sorted(ut.amenities, key=lambda a: a.id)],
                images=list(ut.images or []),
                available_units=sum(1 for u in units if _is_available(u)),
            )
        )
    unit_types.sort(key=lambda t: (t.bedrooms, t.name))
    return BuildingOut(id=b.id, name=b.name, description=b.description or "", floors=b.floors,
                    images=list(b.images or []), unit_types=unit_types)


def _detail(p: Property) -> PropertyDetail:
    return PropertyDetail(
        **_summary(p).model_dump(),
        description=p.description or "",
        address=p.address,
        images=list(p.images or []),
        amenities=[a.name for a in sorted(p.amenities, key=lambda a: a.id)],
        nearby=_nearby(p.nearby_places),
        buildings=[_building_out(b) for b in p.buildings],
    )


async def search_properties(session: AsyncSession, f: PropertyFilters) -> list[PropertySummary]:
    stmt = select(Property).where(Property.is_published.is_(True))
    in_property = Building.property_id == Property.id
    in_building = Unit.building_id == Building.id
    of_type = Unit.unit_type_id == UnitType.id

    if f.location:
        like = _like(f.location)
        stmt = stmt.where(or_(Property.location.ilike(like, escape=ESC), Property.address.ilike(like, escape=ESC)))

    if f.q:
        like = _like(f.q)
        stmt = stmt.where(
            or_(
                Property.name.ilike(like, escape=ESC),
                exists().where(in_property, Building.name.ilike(like, escape=ESC)),
                exists().where(in_property, in_building, Unit.unit_number.ilike(like, escape=ESC)),
                exists().where(in_property, in_building, of_type, UnitType.name.ilike(like, escape=ESC)),
            )
        )

    # Bedrooms and price must match the SAME unit (and sold units never count), so one EXISTS clause.
    unit_conditions = []
    if f.bedrooms is not None:
        unit_conditions.append(UnitType.bedrooms == f.bedrooms)
    if f.min_price is not None:
        unit_conditions.append(Unit.price >= f.min_price)
    if f.max_price is not None:
        unit_conditions.append(Unit.price <= f.max_price)
    if unit_conditions:
        match = exists().where(in_property, in_building, of_type, Unit.status != "sold", *unit_conditions)
        if f.bedrooms is None:  # price-only search can also match an advertised Property.price_from
            advertised = [Property.price_from.is_not(None)]
            if f.min_price is not None:
                advertised.append(Property.price_from >= f.min_price)
            if f.max_price is not None:
                advertised.append(Property.price_from <= f.max_price)
            match = or_(match, and_(*advertised))
        stmt = stmt.where(match)

    stmt = stmt.options(*LIST_EAGER).order_by(Property.sort_order, Property.name).limit(f.limit).offset(f.offset)
    return [_summary(p) for p in (await session.scalars(stmt)).all()]


async def get_property_by_slug(session: AsyncSession, slug: str) -> PropertyDetail | None:
    stmt = select(Property).where(Property.slug == slug, Property.is_published.is_(True)).options(*DETAIL_EAGER)
    prop = await session.scalar(stmt)
    return _detail(prop) if prop else None
