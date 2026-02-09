from pydantic_settings import BaseSettings
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent

class Settings(BaseSettings):
    # Core app
    DATABASE_URL: str = "sqlite:///./disaster_response.db"
    SECRET_KEY: str = "dev-secret"
    DEBUG: bool = True
    ALLOWED_ORIGINS: str = "*"
    UPLOAD_DIR: str = "./uploads"
    MAX_UPLOAD_SIZE: int = 104857600  # 100MB

    # # Satellite / APIs (free-only stack)
    # SENTINEL_CLIENT_ID: str | None = None
    # SENTINEL_CLIENT_SECRET: str | None = None
    # NASA_EARTHDATA_TOKEN: str | None = None
    # SERPAPI_KEY: str | None = None
    # OPENWEATHER_API_KEY: str | None = None

    ZENSERP_KEY: str = "cc3d80e0-030f-11f1-b8d7-59d43d8eaa2c" 
    GEE_PROJECT_ID: str = "pratyaksh0-486603"
    SERVICE_ACCOUNT_EMAIL: str = "disaster-bot@pratyaksh0-486603.iam.gserviceaccount.com"

    class Config:
        env_file = ".env"
        extra = "ignore"   # 👈 This prevents crash if extra env vars exist

settings = Settings()
