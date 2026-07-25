"""Image download / decode helpers."""
import base64
import io
from typing import Optional

import httpx
import numpy as np
from PIL import Image

from app.core.config import settings
from app.core.errors import AppError


async def load_image(image_url: Optional[str], image_base64: Optional[str]) -> np.ndarray:
    if not image_url and not image_base64:
        raise AppError(400, "IMAGE_MISSING", "image_url or image_base64 is required")

    if image_url:
        async with httpx.AsyncClient(timeout=30.0) as client:
            r = await client.get(image_url)
        if r.status_code != 200:
            raise AppError(400, "IMAGE_DOWNLOAD_FAILED", f"Cannot download image: {r.status_code}")
        data = r.content
    else:
        try:
            data = base64.b64decode(image_base64)
        except Exception as exc:  # noqa: BLE001
            raise AppError(400, "IMAGE_DECODE_FAILED", "Invalid base64") from exc

    if len(data) > settings.MAX_IMAGE_MB * 1024 * 1024:
        raise AppError(413, "IMAGE_TOO_LARGE", f"Image exceeds {settings.MAX_IMAGE_MB} MB")

    try:
        pil = Image.open(io.BytesIO(data)).convert("RGB")
    except Exception as exc:  # noqa: BLE001
        raise AppError(400, "IMAGE_DECODE_FAILED", "Cannot decode image") from exc

    return np.array(pil)
