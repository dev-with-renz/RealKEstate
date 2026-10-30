from fastapi import APIRouter, status
from sqlalchemy import select

from backend.app.src.api.deps import SessionDep
from backend.app.src.models.catalog import Property
from backend.app.src.models.inquiry import Inquiry
from backend.app.src.schemas.inquiry import InquiryCreate, InquiryOut

router = APIRouter(prefix="/inquiries", tags=["inquiries"])


@router.post("", response_model=InquiryOut, status_code=status.HTTP_201_CREATED)
async def create_inquiry(payload: InquiryCreate, session: SessionDep):
    if payload.website:  # honeypot tripped: pretend success, store nothing
        from datetime import datetime, timezone

        return InquiryOut(id=0, created_at=datetime.now(timezone.utc))

    property_id = None
    if payload.property_slug:
        property_id = await session.scalar(select(Property.id).where(Property.slug == payload.property_slug))

    inquiry = Inquiry(
        kind=payload.kind,
        first_name=payload.first_name,
        last_name=payload.last_name,
        email=str(payload.email),
        phone=payload.phone,
        message=payload.message,
        unit_type_pref=payload.unit_type_pref,
        property_id=property_id,
    )
    session.add(inquiry)
    await session.commit()
    await session.refresh(inquiry)
    return inquiry
