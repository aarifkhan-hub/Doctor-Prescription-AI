"""
FastAPI entrypoint for the Doctor Prescription AI inference service.
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from loguru import logger

from app.core.config import settings
from app.core.logging import setup_logging
from app.core.errors import AppError, app_error_handler, unhandled_exception_handler
from app.routers import predict, health
from app.services.model_registry import ModelRegistry


@asynccontextmanager
async def lifespan(app: FastAPI):
    setup_logging(settings.LOG_LEVEL)
    logger.info("Starting AI service {} on {}", settings.MODEL_VERSION, settings.DEVICE)
    app.state.models = ModelRegistry()
    app.state.models.load_all()
    logger.info("Models loaded")
    yield
    logger.info("Shutting down AI service")


app = FastAPI(
    title="Doctor Prescription AI - Inference",
    version=settings.MODEL_VERSION,
    description="OCR + Medical NER + EN/HI translation pipeline",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def add_request_id(request: Request, call_next):
    rid = request.headers.get("x-request-id", "unknown")
    with logger.contextualize(request_id=rid):
        response = await call_next(request)
    response.headers["X-Request-Id"] = rid
    return response


app.add_exception_handler(AppError, app_error_handler)
app.add_exception_handler(Exception, unhandled_exception_handler)

app.include_router(health.router)
app.include_router(predict.router, prefix="/v1")


@app.get("/")
def root():
    return JSONResponse({"service": "dprai-ai", "version": settings.MODEL_VERSION})
