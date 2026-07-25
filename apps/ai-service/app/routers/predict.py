"""
Public inference endpoints.
"""
from fastapi import APIRouter, Depends, Request

from app.core.config import settings
from app.core.security import require_service_token
from app.schemas.predict import (
    PredictRequest, PredictResponse, PredictData, PredictMeta,
    OcrOnlyRequest, NerOnlyRequest, TranslateRequest,
)
from app.utils.image_io import load_image
from app.services.pipeline import run_pipeline
from app.services.preprocess import preprocess
from app.services.ocr import run_ocr
from app.services.text_clean import basic_clean, spell_correct
from app.services.ner import extract_entities, group_medicines
from app.services.translate import translate_en_to_hi

router = APIRouter(tags=["inference"], dependencies=[Depends(require_service_token)])


@router.post("/predict", response_model=PredictResponse)
async def predict(body: PredictRequest, request: Request):
    registry = request.app.state.models
    image = await load_image(body.image_url, body.image_base64)
    result = run_pipeline(image, registry, language=body.language)

    return {
        "success": True,
        "requestId": body.request_id,
        "data": {
            "ocr": result["ocr"],
            "entities": result["entities"],
            "medicines": result["medicines"],
            "explanation": result["explanation"],
            "requiresReview": result["requiresReview"],
        },
        "meta": {
            "modelVersion": settings.MODEL_VERSION,
            "processingMs": result["processingMs"],
        },
    }


@router.post("/ocr")
async def ocr_only(body: OcrOnlyRequest, request: Request):
    registry = request.app.state.models
    image = await load_image(body.image_url, body.image_base64)
    processed = preprocess(image)
    text, conf = run_ocr(processed, registry)
    return {"success": True, "data": {"text": text, "confidence": conf}}


@router.post("/ner")
def ner_only(body: NerOnlyRequest, request: Request):
    registry = request.app.state.models
    cleaned = spell_correct(basic_clean(body.text))
    entities = extract_entities(cleaned, registry)
    return {
        "success": True,
        "data": {"entities": entities, "medicines": group_medicines(entities), "cleanedText": cleaned},
    }


@router.post("/translate")
def translate(body: TranslateRequest, request: Request):
    registry = request.app.state.models
    if body.target != "hi":
        return {"success": True, "data": {"text": body.text}}
    return {"success": True, "data": {"text": translate_en_to_hi(body.text, registry)}}


@router.get("/models")
def models():
    return {
        "success": True,
        "data": {
            "modelVersion": settings.MODEL_VERSION,
            "ocr": settings.OCR_MODEL_ID,
            "ner": settings.NER_MODEL_ID,
            "translate": settings.TRANSLATE_MODEL_ID,
        },
    }
