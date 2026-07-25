# API Reference

Base: `https://<backend-host>/api/v1`

All responses use the envelope:

```json
{ "success": true, "requestId": "…", "data": { … }, "meta": { … } }
```

Errors:

```json
{ "success": false, "requestId": "…", "error": { "code": "…", "message": "…" } }
```

## Auth

### POST `/auth/register`
```json
{ "email": "a@b.com", "password": "12345678", "fullName": "Full Name", "phone": "+91…" }
```
→ `{ user, tokens: { accessToken, refreshToken } }`

### POST `/auth/login`
```json
{ "email": "a@b.com", "password": "…" }
```

### POST `/auth/refresh`
```json
{ "refreshToken": "…" }
```

### POST `/auth/logout` — requires JWT

### GET `/auth/me` — returns current user

## Users

### PATCH `/users/me` — update profile
### PATCH `/users/me/password` — change password

## Prescriptions

### POST `/prescriptions` — multipart, field `image`
Optional field `language` (`en`|`hi`).

→ full processed doc with `medicines`, `explanation`, `ocr`.

### GET `/prescriptions?page=1&limit=10&status=DONE` — paginated
### GET `/prescriptions/:id` — one
### DELETE `/prescriptions/:id` — soft delete + Cloudinary purge

## Settings

### GET `/settings`
### PUT `/settings`

## Health

### GET `/health` — liveness
### GET `/ready` — DB + AI readiness

---

# AI Service (internal)

Base: `https://<ai-host>/v1` — requires `Authorization: Bearer <SERVICE_TOKEN>`.

- `POST /predict` — full pipeline
- `POST /ocr`
- `POST /ner`
- `POST /translate`
- `GET  /models`
- `GET  /healthz`, `GET /readyz`
