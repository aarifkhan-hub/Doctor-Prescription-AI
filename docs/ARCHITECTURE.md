# Architecture

## Overview

Doctor Prescription AI is a multi-tier SaaS with five decoupled planes:

- **Client**  — React SPA (Vercel)
- **App API** — Node.js + Express (Render)
- **AI API**  — FastAPI + PyTorch (Render / HF Space)
- **Data**   — MongoDB Atlas + Cloudinary
- **Model**  — Kaggle/Colab training → HuggingFace Hub

```
User → React → Node/Express → FastAPI (TrOCR + NER + Translate)
                        ↘ Cloudinary
                        ↘ MongoDB Atlas
```

## Flow

1. User uploads an image
2. Node persists metadata + sends URL to FastAPI
3. FastAPI preprocesses → OCR → NER → group → explain → translate
4. Node stores result in MongoDB
5. React renders medicine cards + EN/HI explanations

## Data model

See `apps/backend/src/models/*.js`.

## Security

- JWT (access 15m + rotating refresh 7d)
- bcrypt(12) hashing
- Helmet, CORS allowlist, rate limits, mongo sanitize, hpp
- Service-to-service Bearer token for FastAPI
- Cloudinary secure URLs
- 365-day audit log with TTL

## Scaling

- Backend + AI stateless — scale horizontally
- Add BullMQ for async OCR jobs on large workloads
- Cache popular medicine dictionary lookups in Redis
