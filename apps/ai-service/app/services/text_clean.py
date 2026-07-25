"""
Post-OCR text cleanup + spelling correction against a medical dictionary.
"""
from __future__ import annotations

import re
from typing import List

from rapidfuzz import process, fuzz

from app.services.med_dict import MEDICINE_LEXICON, INSTRUCTION_LEXICON


_WHITESPACE = re.compile(r"[ \t]+")
_NEWLINES = re.compile(r"\n{3,}")


def basic_clean(text: str) -> str:
    text = text.replace("\r", "\n")
    text = _WHITESPACE.sub(" ", text)
    text = _NEWLINES.sub("\n\n", text)
    return text.strip()


def _fuzzy_correct(word: str, lexicon: List[str], threshold: int = 88) -> str:
    if len(word) < 4 or word.isnumeric():
        return word
    match = process.extractOne(word, lexicon, scorer=fuzz.WRatio)
    if match and match[1] >= threshold:
        return match[0]
    return word


def spell_correct(text: str) -> str:
    lex = MEDICINE_LEXICON + INSTRUCTION_LEXICON
    out_tokens = []
    for token in re.findall(r"\S+|\s+", text):
        if token.strip() == "":
            out_tokens.append(token)
            continue
        core = re.sub(r"[^A-Za-z]", "", token)
        if not core:
            out_tokens.append(token)
            continue
        corrected = _fuzzy_correct(core, lex)
        if corrected.lower() != core.lower():
            token = token.replace(core, corrected)
        out_tokens.append(token)
    return "".join(out_tokens)
