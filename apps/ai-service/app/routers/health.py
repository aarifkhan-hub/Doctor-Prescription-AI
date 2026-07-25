from fastapi import APIRouter, Request

router = APIRouter(tags=["health"])


@router.get("/healthz")
def liveness():
    return {"status": "ok"}


@router.get("/readyz")
def readiness(request: Request):
    registry = getattr(request.app.state, "models", None)
    return {
        "ready": bool(registry and registry.trocr_model is not None),
        "device": registry.device if registry else None,
    }
