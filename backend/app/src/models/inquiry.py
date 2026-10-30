from sqlalchemy import ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column
from backend.app.src.db.base import TimestampMixin, Base

class Inquiry(TimestampMixin, Base):
    """A website lead: either a normal inquiry or a 'free quote' request."""
    
    __tablename__ = "inquiries"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    kind: Mapped[str] = mapped_column(String(20), default="inquiry") # inquiry | quote
    first_name: Mapped[str] = mapped_column(String(80))
    last_name: Mapped[str] = mapped_column(String(80))
    email: Mapped[str] = mapped_column(String(255), index=True)
    phone: Mapped[str] = mapped_column(String(30))
    message: Mapped[str] = mapped_column(Text, default="")
    unit_type_pref: Mapped[str | None] = mapped_column(String(80))
    property_id: Mapped[int | None] = mapped_column(ForeignKey("properties.id", ondelete="SET NULL"))
