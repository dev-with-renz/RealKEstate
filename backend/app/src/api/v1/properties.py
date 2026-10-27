from typing import Annotated

from fastapi import APIRouter, HTTPException, Query

from backend.app.src.api.deps import SessionDep
from backend.app.src.schemas.catalog import PropertyDetail, PropertySummary
from backend.app.src.services.catalog import PropertyFilters, get_property_by_slug, search_properties

router = APIRouter(prefix="/properties", tags=["properties"])


@router.get("", response_model=list[PropertySummary])
async def list_properties(
    session: SessionDep,
    q: Annotated[str | None, Query(max_length=80, description="Property, building, unit type or unit number")] = None,
    location: Annotated[str | None, Query(max_length=80)] = None,
    bedrooms: Annotated[int | None, Query(ge=0, le=5, description="0 = studio")] = None,
    min_price: Annotated[float | None, Query(ge=0)] = None,
    max_price: Annotated[float | None, Query(ge=0)] = None,
    limit: Annotated[int, Query(ge=1, le=100)] = 24,
    offset: Annotated[int, Query(ge=0)] = 0,
):
    if min_price is not None and max_price is not None and min_price > max_price:
        raise HTTPException(status_code=422, detail="min_price cannot be greater than max_price")
    filters = PropertyFilters(q=q, location=location, bedrooms=bedrooms, min_price=min_price,
                              max_price=max_price, limit=limit, offset=offset)
    return await search_properties(session, filters)


@router.get("/{slug}", response_model=PropertyDetail)
async def get_property(slug: str, session: SessionDep):
    prop = await get_property_by_slug(session, slug)
    if prop is None:
        raise HTTPException(status_code=404, detail="Property not found")
    return prop
