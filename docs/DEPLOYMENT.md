# Deployment

## 1. MongoDB Atlas

1. Create a free cluster
2. Add DB user + password
3. Whitelist Render outbound IPs (or 0.0.0.0/0 for testing)
4. Copy the SRV URI → `MONGO_URI`

## 2. Cloudinary

1. Create account → Dashboard
2. Copy: cloud_name, api_key, api_secret → backend `.env`

## 3. HuggingFace Hub

1. Create an access token (`Read` for pulling models, `Write` for pushing training checkpoints)
2. Set `HF_TOKEN` on the AI service

## 4. AI Service on Render

- New → Web Service → Docker
- Root directory: `apps/ai-service`
- Add env vars from `.env.example`
- Plan: **Standard** (needs ≥ 2 GB RAM for TrOCR CPU)
- Endpoint URL → paste into backend `AI_SERVICE_URL`

## 5. Backend on Render

- New → Web Service → Node
- Root: `apps/backend`
- Build: `npm ci`
- Start: `node src/server.js`
- Add env vars

## 6. Frontend on Vercel

- Import GitHub repo
- Root: `apps/frontend`
- Framework: Vite
- Env: `VITE_API_BASE_URL=https://<backend-host>/api/v1`

## 7. Verify

```bash
curl https://<backend>/api/v1/health
curl https://<ai>/healthz
```

## Alternative: Docker Compose (local prod-like)

```bash
cd infra/docker
docker compose up --build
```

Frontend → http://localhost:3000
Backend  → http://localhost:5000
AI       → http://localhost:8000
