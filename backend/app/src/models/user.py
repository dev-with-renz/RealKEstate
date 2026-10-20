from datetime import datetime
from sqlalchemy import String, DateTime, text, Index
from sqlalchemy.orm import Mapped, mapped_column
from backend.app.src.db.base import TimestampMixin, Base

class User(TimestampMixin, Base):
    """An application account, with optional OAuth profile details."""

    __tablename__ = "users"
    __table_args__ = (Index("ix_users_email_username", "email", "username"))
    
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    email: Mapped[str | None] = mapped_column(String(255), unique=True, index=True, nullable=True)
    username: Mapped[str | None] = mapped_column(String(100), index=True, nullable=True)
    hashed_password: Mapped[str | None] = mapped_column(String(255), nullable=True)
    role: Mapped[str] = mapped_column(String(50), nullable=False, server_default="user", index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=text("CURRENT_TIMESTAMP"))

    # OAuth fields are nullable so password-based accounts do not need them.
    oauth_provider: Mapped[str | None] = mapped_column(String(50), nullable=True)
    oauth_id: Mapped[str | None] = mapped_column(String(255), nullable=True)
    avatar_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    
    