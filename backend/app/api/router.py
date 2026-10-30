from fastapi import APIRouter
from backend.app.api.v1 import properties
from backend.app.api.v1 import inquiries

api_router = APIRouter()
api_router.include_router(properties.router)
api_router.include_router(inquiries.router)


@api_router.get("/health", tags=["meta"])
async def health():
    return {"status": "ok"}
