from fastapi import APIRouter
from backend.app.src.api.v1 import properties, inquiries

api_router = APIRouter()
api_router.include_router(properties.router)
api_router.include_router(inquiries.router)


@api_router.get("/health", tags=["meta"])
async def health():
    return {"status": "ok"}
