"""
Template-based patient-friendly explanation generator.

We keep this rule-based to avoid hallucinations from a general LLM on
medical content. The output is deterministic and safe.
"""
from __future__ import annotations
from typing import Dict, List


def build_explanation(medicines: List[Dict]) -> str:
    if not medicines:
        return (
            "We could not confidently identify medicines from this prescription. "
            "Please review the extracted text and consult your doctor."
        )

    lines = ["Your doctor has prescribed the following medicines:"]
    for i, m in enumerate(medicines, start=1):
        parts = [f"{i}. {m.get('normalizedName') or m.get('name')}"]
        if m.get("dosage"):
            parts.append(f"Dose: {m['dosage']}")
        if m.get("frequency"):
            parts.append(f"Frequency: {m['frequency']}")
        if m.get("duration"):
            parts.append(f"Duration: {m['duration']}")
        if m.get("instructions"):
            parts.append(f"Instructions: {m['instructions']}")
        lines.append(" | ".join(parts))
    lines.append(
        "Please take the medicines exactly as instructed. "
        "Do not stop early even if you feel better. If you experience any side effects, "
        "contact your doctor immediately."
    )
    return "\n".join(lines)
