from pathlib import Path
from urllib.parse import urlsplit
from pydantic import SecretStr, HttpUrl, Field
from pydantic_settings import BaseSettings, SettingsConfigDict

# Dynamic resolution of the absolute path to your root level .env
ROOT_DIR = Path(__file__).resolve().parent.parent.parent

DEFAULT_CORS_ORIGINS = [
    "http://localhost:8000", "http://127.0.0.1:8000", "http://192.168.0.137:8000", "http://192.168.1.12:8000",
    "http://localhost:5173", "http://127.0.0.1:5173", "http://192.168.0.137:5173", "http://192.168.1.12:5173",
]
DEFAULT_CSP = (
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; "
    "connect-src 'self' http://localhost:8000"
)
DEPLOYED_CSP = "default-src 'self'; script-src 'self'; style-src 'self'; connect-src 'self' https://realkestate-ds4v.onrender.com"


class Settings(BaseSettings):
    """Unified application configuration validating standard, staging, and production specs."""
    
    # ── Application Environment State ──────────────────────────────
    app_name: str = "RealKEstate API"
    fastapi_env: str = Field(default="development", validation_alias="FASTAPI_ENV")
    debug: bool = False

    # ── Database Configurations ────────────────────────────────────
    sqlalchemy_database_url: str = Field(..., validation_alias="DATABASE_URL")

    # ── Authentication and Security ────────────────────────────────
    jwt_secret: SecretStr = SecretStr("dev_secret")
    jwt_algorithm: str = "HS256"
    jwt_access_ttl_minutes: int = 60
    cookie_secure: bool = False

    # ── Social OAuth Providers ─────────────────────────────────────
    oauth_google_client_id: str | None = None
    oauth_google_client_secret: SecretStr | None = None
    oauth_github_client_id: str | None = None
    oauth_github_client_secret: SecretStr | None = None

    # ── Security & Origin Configurations ───────────────────────────
    frontend_url: HttpUrl | None = None
    cors_origins: list[str] = DEFAULT_CORS_ORIGINS
    csp: str = DEFAULT_CSP

    # ── Orchestrator Configuration ────────────────────────────────
    model_config = SettingsConfigDict(
        env_file=ROOT_DIR / ".env",
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=False
    )

    def model_post_init(self, __context) -> None:
        """Dynamic adjustments triggered right after Pydantic finishes initial data injection."""

        if self.fastapi_env == "production":
            self.debug = False
            self.cookie_secure = True
            if self.csp == DEFAULT_CSP:
                self.csp = DEPLOYED_CSP

        elif self.fastapi_env == "staging":
            self.debug = False
            if self.csp == DEFAULT_CSP:
                self.csp = DEPLOYED_CSP

        if self.fastapi_env in {"staging", "production"} and "cors_origins" not in self.model_fields_set:
            if self.frontend_url is None:
                raise ValueError(
                    "Set FRONTEND_URL or CORS_ORIGINS for staging and production."
                )
            frontend = urlsplit(str(self.frontend_url))
            self.cors_origins = [f"{frontend.scheme}://{frontend.netloc}"]

settings = Settings()
