"""
Singleton-style model registry — loaded once at startup.
Uses HuggingFace Transformers pipelines with graceful CPU/GPU selection.
"""
from __future__ import annotations

import os
from typing import Optional

import torch
from loguru import logger

from app.core.config import settings


def _resolve_device() -> str:
    if settings.DEVICE == "cuda" and torch.cuda.is_available():
        return "cuda"
    if settings.DEVICE == "cpu":
        return "cpu"
    return "cuda" if torch.cuda.is_available() else "cpu"


class ModelRegistry:
    def __init__(self) -> None:
        self.device = _resolve_device()
        self.trocr_processor = None
        self.trocr_model = None
        self.ner_pipeline = None
        self.translator = None
        self.easyocr_reader = None
        if settings.HF_TOKEN:
            os.environ["HUGGINGFACE_HUB_TOKEN"] = settings.HF_TOKEN

    # ------------------------------------------------------------------
    # Loading
    # ------------------------------------------------------------------
    def load_all(self) -> None:
        self._load_trocr()
        self._load_ner()
        self._load_translator()
        self._load_easyocr_fallback()

    def _load_trocr(self) -> None:
        from transformers import TrOCRProcessor, VisionEncoderDecoderModel
        logger.info("Loading TrOCR: {}", settings.OCR_MODEL_ID)
        self.trocr_processor = TrOCRProcessor.from_pretrained(settings.OCR_MODEL_ID)
        self.trocr_model = VisionEncoderDecoderModel.from_pretrained(settings.OCR_MODEL_ID).to(self.device)
        self.trocr_model.eval()

    def _load_ner(self) -> None:
        from transformers import AutoTokenizer, AutoModelForTokenClassification, pipeline
        logger.info("Loading NER: {}", settings.NER_MODEL_ID)
        tok = AutoTokenizer.from_pretrained(settings.NER_MODEL_ID)
        mdl = AutoModelForTokenClassification.from_pretrained(settings.NER_MODEL_ID)
        self.ner_pipeline = pipeline(
            "ner",
            model=mdl,
            tokenizer=tok,
            aggregation_strategy="simple",
            device=0 if self.device == "cuda" else -1,
        )

    def _load_translator(self) -> None:
        from transformers import pipeline
        logger.info("Loading translator: {}", settings.TRANSLATE_MODEL_ID)
        self.translator = pipeline(
            "translation",
            model=settings.TRANSLATE_MODEL_ID,
            device=0 if self.device == "cuda" else -1,
        )

    def _load_easyocr_fallback(self) -> None:
        try:
            import easyocr  # noqa: WPS433
            logger.info("Loading EasyOCR fallback")
            self.easyocr_reader = easyocr.Reader(["en"], gpu=(self.device == "cuda"), verbose=False)
        except Exception as exc:  # noqa: BLE001
            logger.warning("EasyOCR unavailable: {}", exc)
            self.easyocr_reader = None
