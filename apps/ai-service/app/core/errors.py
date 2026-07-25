"""Application error types + FastAPI handlers."""
from fastapi import Request
from fastapi.responses import JSONResponse
from loguru import logger


class AppError(Exception):
    def __init__(self, status: int, code: str, message: str, details=None):
        self.status = status
        self.code = code
        self.message = message
        self.details = details


async def app_error_handler(request: Request, exc: AppError):
    return JSONResponse(
        status_code=exc.status,
        content={
            "success": False,
            "error": {"code": exc.code, "message": exc.message, "details": exc.details},
        },
    )


async def unhandled_exception_handler(request: Request, exc: Exception):
    logger.exception("Unhandled error: {}", exc)
    return JSONResponse(
        status_code=500,
        content={"success": False, "error": {"code": "INTERNAL", "message": "Internal error"}},
    )
