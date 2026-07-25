"""
Medical entity extraction — combines a fine-tuned biomedical NER model with
deterministic regex rules for dosage / frequency / duration which handwriting
NER models regularly miss.
"""
from __future__ import annotations

import re
from typing import Dict, List

from rapidfuzz import process, fuzz

from app.services.med_dict import MEDICINE_LEXICON, FREQUENCY_MAP


DOSE_RE = re.compile(
    r"(?P<dose>\d+(?:\.\d+)?)(?:\s*)(?P<unit>mg|mcg|g|ml|iu|units?|tab|cap|puff|drops?)",
    re.IGNORECASE,
)
FREQ_PATTERN_RE = re.compile(r"\b([01](?:\s*-\s*[01]){1,2})\b")
FREQ_ABBR_RE = re.compile(r"\b(OD|BD|TDS|QID|HS|SOS|PRN|STAT)\b", re.IGNORECASE)
DURATION_RE = re.compile(r"(?:for|x)\s*(\d+)\s*(day|days|week|weeks|month|months)", re.IGNORECASE)
ROUTE_RE = re.compile(r"\b(oral|iv|im|sc|topical|inhaler|nasal|sublingual)\b", re.IGNORECASE)


def _normalize_medicine(candidate: str) -> str | None:
    match = process.extractOne(candidate, MEDICINE_LEXICON, scorer=fuzz.WRatio)
    if match and match[1] >= 85:
        return match[0]
    return None


def _regex_entities(text: str) -> List[Dict]:
    ents: List[Dict] = []
    for m in DOSE_RE.finditer(text):
        ents.append({
            "kind": "DOSAGE",
            "text": m.group(0),
            "normalized": f"{m.group('dose')} {m.group('unit').lower()}",
            "confidence": 0.9,
            "span": {"start": m.start(), "end": m.end()},
        })
    for m in FREQ_PATTERN_RE.finditer(text):
        pat = re.sub(r"\s+", "", m.group(1))
        ents.append({
            "kind": "FREQUENCY",
            "text": m.group(0),
            "normalized": FREQUENCY_MAP.get(pat, pat),
            "confidence": 0.85,
            "span": {"start": m.start(), "end": m.end()},
        })
    for m in FREQ_ABBR_RE.finditer(text):
        key = m.group(1).upper()
        ents.append({
            "kind": "FREQUENCY",
            "text": m.group(0),
            "normalized": FREQUENCY_MAP.get(key, key),
            "confidence": 0.88,
            "span": {"start": m.start(), "end": m.end()},
        })
    for m in DURATION_RE.finditer(text):
        ents.append({
            "kind": "DURATION",
            "text": m.group(0),
            "normalized": f"{m.group(1)} {m.group(2).lower()}",
            "confidence": 0.9,
            "span": {"start": m.start(), "end": m.end()},
        })
    for m in ROUTE_RE.finditer(text):
        ents.append({
            "kind": "INSTRUCTION",
            "text": m.group(0),
            "normalized": m.group(0).lower(),
            "confidence": 0.8,
            "span": {"start": m.start(), "end": m.end()},
        })
    return ents


def _model_entities(text: str, registry) -> List[Dict]:
    ents: List[Dict] = []
    try:
        raw = registry.ner_pipeline(text[:2000])
    except Exception:  # noqa: BLE001
        return ents
    for e in raw:
        kind = "MEDICINE" if "drug" in e["entity_group"].lower() or "medic" in e["entity_group"].lower() else e["entity_group"]
        norm = _normalize_medicine(e["word"]) if kind == "MEDICINE" else None
        ents.append({
            "kind": "MEDICINE" if kind == "MEDICINE" else "INSTRUCTION",
            "text": e["word"],
            "normalized": norm,
            "confidence": float(e["score"]),
            "span": {"start": int(e["start"]), "end": int(e["end"])},
        })
    return ents


def _lexicon_medicines(text: str) -> List[Dict]:
    """Regex + fuzzy pass to catch medicines the ML model missed."""
    ents: List[Dict] = []
    for token in re.finditer(r"[A-Za-z][A-Za-z\-]{3,}", text):
        norm = _normalize_medicine(token.group(0))
        if norm:
            ents.append({
                "kind": "MEDICINE",
                "text": token.group(0),
                "normalized": norm,
                "confidence": 0.75,
                "span": {"start": token.start(), "end": token.end()},
            })
    return ents


def _dedupe(entities: List[Dict]) -> List[Dict]:
    seen = set()
    out = []
    for e in sorted(entities, key=lambda x: -x["confidence"]):
        key = (e["kind"], (e.get("normalized") or e["text"]).lower())
        if key in seen:
            continue
        seen.add(key)
        out.append(e)
    return out


def extract_entities(text: str, registry) -> List[Dict]:
    combined = []
    combined.extend(_regex_entities(text))
    combined.extend(_model_entities(text, registry))
    combined.extend(_lexicon_medicines(text))
    return _dedupe(combined)


def group_medicines(entities: List[Dict]) -> List[Dict]:
    """
    Group entities into medicine cards. Heuristic: for each medicine entity,
    attach the nearest DOSAGE/FREQUENCY/DURATION on the same line.
    """
    meds = [e for e in entities if e["kind"] == "MEDICINE"]
    others = [e for e in entities if e["kind"] != "MEDICINE"]

    cards: List[Dict] = []
    for m in meds:
        card = {
            "name": m["text"],
            "normalizedName": m.get("normalized") or m["text"],
            "dosage": None,
            "frequency": None,
            "duration": None,
            "route": None,
            "instructions": None,
            "warnings": [],
        }
        m_pos = (m.get("span") or {}).get("start", 0)
        nearest = sorted(
            others,
            key=lambda e: abs((e.get("span") or {}).get("start", 0) - m_pos),
        )
        for o in nearest:
            if o["kind"] == "DOSAGE" and not card["dosage"]:
                card["dosage"] = o.get("normalized") or o["text"]
            elif o["kind"] == "FREQUENCY" and not card["frequency"]:
                card["frequency"] = o.get("normalized") or o["text"]
            elif o["kind"] == "DURATION" and not card["duration"]:
                card["duration"] = o.get("normalized") or o["text"]
            elif o["kind"] == "INSTRUCTION" and not card["instructions"]:
                card["instructions"] = o.get("normalized") or o["text"]
        cards.append(card)
    return cards
