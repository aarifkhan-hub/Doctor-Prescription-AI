# Complete Folder Structure

```
doctor-prescription-ai/
├── apps/
│   ├── frontend/                       React + Vite + Tailwind SPA
│   │   ├── public/logo.svg
│   │   ├── src/
│   │   │   ├── assets/                 static assets
│   │   │   ├── components/
│   │   │   │   ├── layout/             AppLayout, AuthLayout, Sidebar, Navbar
│   │   │   │   ├── prescription/       MedicineCard, ExplanationPanel, UploadDropzone
│   │   │   │   ├── ui/                 Card, Badge, LoadingScreen, ThemeToggle
│   │   │   │   └── ProtectedRoute.jsx
│   │   │   ├── context/                AuthContext, ThemeContext
│   │   │   ├── hooks/                  (extend as needed)
│   │   │   ├── i18n/                   (translation resources)
│   │   │   ├── pages/                  Landing, Login, Register, Dashboard,
│   │   │   │                           Upload, History, PrescriptionDetail,
│   │   │   │                           Profile, Settings, NotFound
│   │   │   ├── services/               api.js, authService, prescriptionService, settingsService
│   │   │   ├── styles/index.css
│   │   │   ├── utils/                  (helpers)
│   │   │   ├── App.jsx
│   │   │   └── main.jsx
│   │   ├── Dockerfile · nginx.conf
│   │   ├── tailwind.config.js · postcss.config.js · vite.config.js
│   │   ├── .env.example · .eslintrc.json · index.html · package.json
│   │
│   ├── backend/                        Node.js + Express API
│   │   ├── src/
│   │   │   ├── config/                 env.js, db.js, cloudinary.js
│   │   │   ├── controllers/            auth, user, prescription, settings, health
│   │   │   ├── middleware/             auth, error, rateLimit, requestId, upload, validate
│   │   │   ├── models/                 User, Prescription, UserSettings, AuditLog
│   │   │   ├── routes/                 index, auth, users, prescriptions, settings, health
│   │   │   ├── services/               tokenService, cloudinaryService, aiService, prescriptionService
│   │   │   ├── utils/                  ApiError, asyncHandler, logger, response
│   │   │   ├── validators/             auth.js, prescription.js
│   │   │   ├── app.js · server.js
│   │   ├── Dockerfile · package.json · .env.example · .eslintrc.json
│   │
│   └── ai-service/                     FastAPI + PyTorch
│       ├── app/
│       │   ├── core/                   config, logging, errors, security
│       │   ├── routers/                predict, health
│       │   ├── schemas/predict.py
│       │   ├── services/               preprocess, ocr, text_clean, med_dict,
│       │   │                           ner, translate, explain, pipeline,
│       │   │                           model_registry
│       │   ├── utils/image_io.py
│       │   └── main.py
│       ├── tests/test_smoke.py
│       ├── Dockerfile · requirements.txt · .env.example · README.md
│
├── ml/
│   ├── training/                       config, dataset, preprocess, train_trocr,
│   │                                   evaluate, push_to_hub, requirements.txt
│   ├── notebooks/kaggle_trocr_finetune.ipynb
│   ├── datasets/manifest_example.csv
│   └── evaluation/report_template.md
│
├── infra/
│   ├── docker/docker-compose.yml
│   ├── render/render.yaml
│   ├── vercel/vercel.json
│   └── github/workflows/ci.yml
│
├── docs/
│   ├── ARCHITECTURE.md
│   ├── API.md
│   ├── DEPLOYMENT.md
│   └── FOLDER_STRUCTURE.md
│
├── package.json                        npm workspaces
├── README.md
└── .gitignore
```
