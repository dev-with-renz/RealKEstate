from collections.abc import AsyncIterator
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from backend.app.core.config import settings

engine = create_async_engine(settings.sqlalchemy_database_url, echo=settings.debug, future=True)
SessionLocal = async_sessionmaker(engine, expire_on_commit=False)

async def get_session() -> AsyncIterator[AsyncSession]:
    """One DB session per request, always closed afterwards"""
    async with SessionLocal() as session:
        yield session