"""Request/response schemas."""
from typing import List, Optional, Literal
from pydantic import BaseModel, Field


class PredictRequest(BaseModel):
    image_url: Optional[str] = Field(default=None, description="Publicly accessible image URL")
    image_base64: Optional[str] = Field(default=None, description="Alternative to image_url")
    request_id: Optional[str] = Field(default=None)
    language: Literal["en", "hi"] = "en"


class Entity(BaseModel):
    kind: str
    text: str
    normalized: Optional[str] = None
    rxnormId: Optional[str] = None
    confidence: float = 0.0
    span: Optional[dict] = None


class Medicine(BaseModel):
    name: str
    normalizedName: Optional[str] = None
    dosage: Optional[str] = None
    frequency: Optional[str] = None
    duration: Optional[str] = None
    route: Optional[str] = None
    instructions: Optional[str] = None
    warnings: List[str] = []


class OcrBlock(BaseModel):
    rawText: str
    cleanedText: str
    confidence: float


class Explanation(BaseModel):
    en: str
    hi: str


class PredictData(BaseModel):
    ocr: OcrBlock
    entities: List[Entity]
    medicines: List[Medicine]
    explanation: Explanation
    requiresReview: bool = False


class PredictMeta(BaseModel):
    modelVersion: str
    processingMs: int


class PredictResponse(BaseModel):
    success: bool = True
    requestId: Optional[str] = None
    data: PredictData
    meta: PredictMeta


class OcrOnlyRequest(BaseModel):
    image_url: Optional[str] = None
    image_base64: Optional[str] = None


class NerOnlyRequest(BaseModel):
    text: str


class TranslateRequest(BaseModel):
    text: str
    target: Literal["en", "hi"] = "hi"
