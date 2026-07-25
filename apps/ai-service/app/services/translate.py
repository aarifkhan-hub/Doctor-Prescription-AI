"""
EN → HI translation via HuggingFace pipeline.
Chunks input on paragraphs to respect the 512-token model limit.
"""
from __future__ import annotations
from typing import List
from loguru import logger


def _chunk(text: str, max_chars: int = 400) -> List[str]:
    parts, current = [], []
    length = 0
    for line in text.split("\n"):
        if length + len(line) + 1 > max_chars and current:
            parts.append("\n".join(current))
            current, length = [], 0
        current.append(line)
        length += len(line) + 1
    if current:
        parts.append("\n".join(current))
    return parts


def translate_en_to_hi(text: str, registry) -> str:
    if not text.strip():
        return ""
    try:
        chunks = _chunk(text)
        out = []
        for c in chunks:
            r = registry.translator(c, max_length=512)
            out.append(r[0]["translation_text"])
        return "\n".join(out)
    except Exception as exc:  # noqa: BLE001
        logger.warning("Translation failed: {}", exc)
        return ""
