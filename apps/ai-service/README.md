# AI Service — Doctor Prescription AI

FastAPI + PyTorch inference microservice.

## Run locally

```bash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000
```

The service downloads models from HuggingFace on first boot (~1–2 GB).

## Endpoints

| Method | Path             | Purpose                          |
|--------|------------------|----------------------------------|
| POST   | `/v1/predict`    | Full pipeline (OCR + NER + EN/HI)|
| POST   | `/v1/ocr`        | OCR only                         |
| POST   | `/v1/ner`        | NER on plain text                |
| POST   | `/v1/translate`  | EN → HI translation              |
| GET    | `/v1/models`     | Active model versions            |
| GET    | `/healthz`       | Liveness                         |
| GET    | `/readyz`        | Readiness (models loaded?)       |

All `/v1/*` endpoints require `Authorization: Bearer <SERVICE_TOKEN>`.

## Docker

```bash
docker build -t dprai-ai .
docker run -p 8000:8000 --env-file .env dprai-ai
```
