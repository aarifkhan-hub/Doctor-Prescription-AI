"""
Compact medical lexicon used for fuzzy spell correction + normalisation.

In production, replace with a full RxNorm export loaded into a Trie / FAISS index.
This shortlist covers the most-prescribed generic + brand names in India (2024).
"""

MEDICINE_LEXICON = [
    "Paracetamol", "Ibuprofen", "Amoxicillin", "Azithromycin", "Cetirizine",
    "Levocetirizine", "Diclofenac", "Aceclofenac", "Metformin", "Glimepiride",
    "Atorvastatin", "Rosuvastatin", "Amlodipine", "Telmisartan", "Losartan",
    "Ramipril", "Enalapril", "Metoprolol", "Bisoprolol", "Pantoprazole",
    "Rabeprazole", "Omeprazole", "Esomeprazole", "Domperidone", "Ondansetron",
    "Montelukast", "Salbutamol", "Budesonide", "Fluticasone", "Prednisolone",
    "Dexamethasone", "Cefixime", "Cefpodoxime", "Ciprofloxacin", "Levofloxacin",
    "Doxycycline", "Clindamycin", "Metronidazole", "Ornidazole", "Chlorpheniramine",
    "Loratadine", "Fexofenadine", "Ranitidine", "Famotidine", "Digene",
    "Crocin", "Dolo", "Combiflam", "Zerodol", "Augmentin", "Azithral",
    "Zifi", "Taxim-O", "Pan-D", "Pantocid", "Rantac", "Aciloc",
    "Ecosprin", "Clopidogrel", "Aspirin", "Warfarin", "Enoxaparin",
    "Insulin", "Metformin", "Sitagliptin", "Vildagliptin", "Empagliflozin",
    "Thyroxine", "Levothyroxine", "Vitamin B12", "Methylcobalamin", "Folic acid",
    "Iron", "Calcium", "Vitamin D3", "Cholecalciferol", "Zinc",
]

INSTRUCTION_LEXICON = [
    "morning", "night", "afternoon", "evening", "before food", "after food",
    "empty stomach", "with water", "daily", "twice", "thrice", "once",
    "hourly", "weekly", "days", "weeks", "month", "SOS", "PRN",
    "OD", "BD", "TDS", "QID", "HS", "STAT",
]

FREQUENCY_MAP = {
    "OD": "Once a day",
    "BD": "Twice a day",
    "TDS": "Three times a day",
    "QID": "Four times a day",
    "HS": "At bedtime",
    "SOS": "When required",
    "PRN": "When required",
    "STAT": "Immediately",
    "1-0-0": "Once in the morning",
    "0-0-1": "Once at night",
    "1-0-1": "Morning and night",
    "1-1-1": "Morning, afternoon and night",
}
