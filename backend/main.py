from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.src.api.router import api_router
from backend.app.core.config import settings
from backend.app.src.db.session import engine

@asynccontextmanager
async def lifespan(_: FastAPI):
    yield
    await engine.dispose()

def create_app() -> FastAPI:
    is_prod = settings.fastapi_env == "production"

    application = FastAPI(
        title=settings.app_name,
        debug=settings.debug,
        lifespan=lifespan,
        docs_url=None if is_prod else "/docs",
        redoc_url=None if is_prod else "/redoc",
        openapi_url=None if is_prod else "/openapi.json",
    )

    application.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    application.include_router(api_router, prefix="/api/v1")
    return application


app = create_app()