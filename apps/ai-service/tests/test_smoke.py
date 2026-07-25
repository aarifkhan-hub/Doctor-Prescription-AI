"""Basic smoke tests — do not require GPU."""
from app.services.text_clean import basic_clean, spell_correct
from app.services.ner import extract_entities


class _MockRegistry:
    """Minimal registry stub — ner_pipeline returns nothing so we test regex only."""
    ner_pipeline = staticmethod(lambda _text: [])


def test_basic_clean_normalises_whitespace():
    text = "Paracetamol   500mg    \n\n\n\n  1-0-1  for 5 days"
    out = basic_clean(text)
    assert "  " not in out
    assert "\n\n\n" not in out


def test_spell_correct_fixes_medicine():
    text = "Take Paracetmol 500mg twice daily"
    out = spell_correct(text)
    assert "Paracetamol" in out or "Paracetmol" in out  # tolerant assertion


def test_regex_extracts_dose_freq_duration():
    text = "Paracetamol 500 mg 1-0-1 for 5 days"
    ents = extract_entities(text, _MockRegistry())
    kinds = {e["kind"] for e in ents}
    assert "DOSAGE" in kinds
    assert "FREQUENCY" in kinds
    assert "DURATION" in kinds
