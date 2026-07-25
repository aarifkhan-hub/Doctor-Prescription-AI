"""
Pydantic settings loaded from environment variables.
"""
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True, extra="ignore")

    APP_ENV: str = "development"
    LOG_LEVEL: str = "INFO"

    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000

    SERVICE_TOKEN: str = "change_me"

    HF_TOKEN: str = ""
    OCR_MODEL_ID: str = "microsoft/trocr-base-handwritten"
    NER_MODEL_ID: str = "d4data/biomedical-ner-all"
    TRANSLATE_MODEL_ID: str = "Helsinki-NLP/opus-mt-en-hi"
    MODEL_VERSION: str = "v1.0.0"

    DEVICE: str = "auto"
    LOW_CONF_THRESHOLD: float = 0.55
    MAX_IMAGE_MB: int = 8


settings = Settings()
