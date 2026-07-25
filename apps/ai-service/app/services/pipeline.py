"""
End-to-end pipeline: image → OCR → NER → grouping → explanation → translation.
"""
from __future__ import annotations
import time
from typing import Dict

import numpy as np
from loguru import logger

from app.core.config import settings
from app.services.preprocess import preprocess
from app.services.ocr import run_ocr
from app.services.text_clean import basic_clean, spell_correct
from app.services.ner import extract_entities, group_medicines
from app.services.explain import build_explanation
from app.services.translate import translate_en_to_hi


def run_pipeline(image_rgb: np.ndarray, registry, language: str = "en") -> Dict:
    t0 = time.time()

    # 1. Preprocess
    processed = preprocess(image_rgb)

    # 2. OCR
    raw_text, conf = run_ocr(processed, registry)
    logger.info("OCR: conf={:.3f} chars={}", conf, len(raw_text))

    # 3. Clean + spell correct
    cleaned = spell_correct(basic_clean(raw_text))

    # 4. NER
    entities = extract_entities(cleaned, registry)

    # 5. Group into medicines
    medicines = group_medicines(entities)

    # 6. Build explanations
    en_explanation = build_explanation(medicines)
    hi_explanation = translate_en_to_hi(en_explanation, registry)

    requires_review = conf < settings.LOW_CONF_THRESHOLD or not medicines
    processing_ms = int((time.time() - t0) * 1000)

    return {
        "ocr": {"rawText": raw_text, "cleanedText": cleaned, "confidence": conf},
        "entities": entities,
        "medicines": medicines,
        "explanation": {"en": en_explanation, "hi": hi_explanation},
        "requiresReview": requires_review,
        "processingMs": processing_ms,
    }
