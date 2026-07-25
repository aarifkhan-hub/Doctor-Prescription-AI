"""
OCR service — TrOCR (primary) + EasyOCR (fallback) ensemble.
"""
from __future__ import annotations

from typing import Tuple

import numpy as np
import torch
from PIL import Image
from loguru import logger


def _trocr_generate(image_rgb: np.ndarray, registry) -> Tuple[str, float]:
    pil = Image.fromarray(image_rgb)
    inputs = registry.trocr_processor(images=pil, return_tensors="pt").to(registry.device)
    with torch.no_grad():
        out = registry.trocr_model.generate(
            **inputs,
            max_length=256,
            num_beams=4,
            output_scores=True,
            return_dict_in_generate=True,
        )
    ids = out.sequences[0]
    text = registry.trocr_processor.batch_decode([ids], skip_special_tokens=True)[0]

    # Confidence proxy: mean top-token prob across beams
    try:
        probs = [torch.softmax(s[0], dim=-1).max().item() for s in out.scores]
        conf = float(sum(probs) / max(1, len(probs)))
    except Exception:  # noqa: BLE001
        conf = 0.6
    return text.strip(), conf


def _easyocr_generate(image_rgb: np.ndarray, registry) -> Tuple[str, float]:
    if registry.easyocr_reader is None:
        return "", 0.0
    results = registry.easyocr_reader.readtext(image_rgb, detail=1, paragraph=True)
    if not results:
        return "", 0.0
    parts = []
    confs = []
    for r in results:
        if len(r) == 3:
            _, txt, conf = r
        else:
            _, txt = r
            conf = 0.5
        parts.append(txt)
        confs.append(float(conf))
    text = "\n".join(parts).strip()
    conf = float(sum(confs) / len(confs)) if confs else 0.0
    return text, conf


def run_ocr(image_rgb: np.ndarray, registry) -> Tuple[str, float]:
    """
    Returns (text, confidence). Picks the higher-confidence result between TrOCR
    and EasyOCR (if available). TrOCR is preferred on ties.
    """
    text_a, conf_a = _trocr_generate(image_rgb, registry)
    logger.debug("TrOCR: conf={:.3f} chars={}", conf_a, len(text_a))

    text_b, conf_b = _easyocr_generate(image_rgb, registry)
    if text_b:
        logger.debug("EasyOCR: conf={:.3f} chars={}", conf_b, len(text_b))

    if conf_b > conf_a + 0.1 and text_b:
        return text_b, conf_b
    return text_a, conf_a
