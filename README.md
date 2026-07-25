# Doctor Prescription AI

Production-grade AI SaaS that reads handwritten doctor prescriptions and returns structured, human-friendly explanations in **English + Hindi**.

## Monorepo Layout

```
doctor-prescription-ai/
├── apps/
│   ├── frontend/     # React + Vite + Tailwind SPA         (Vercel)
│   ├── backend/      # Node.js + Express + MongoDB API     (Render)
│   └── ai-service/   # FastAPI + PyTorch inference service (Render / HF Spaces)
├── ml/               # Training pipelines & Kaggle notebook
├── infra/            # Docker, CI/CD, deployment configs
└── docs/             # Architecture & API docs
```

## Quick Start (Local Dev)

```bash
# 1. Backend
cd apps/backend
cp .env.example .env      # fill Mongo, JWT, Cloudinary keys
npm install
npm run dev               # http://localhost:5000

# 2. AI Service
cd apps/ai-service
cp .env.example .env
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

# 3. Frontend
cd apps/frontend
cp .env.example .env
npm install
npm run dev               # http://localhost:5173
```

## Environment Variables

See `.env.example` inside each app folder.

## Deployment

| Component  | Platform         |
|------------|------------------|
| Frontend   | Vercel           |
| Backend    | Render (Web)     |
| AI Service | Render / HF Space|
| Database   | MongoDB Atlas    |
| Images     | Cloudinary       |
| Models     | HuggingFace Hub  |

Detailed steps: `docs/DEPLOYMENT.md`.

## License

MIT
