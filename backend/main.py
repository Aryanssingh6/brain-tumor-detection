import os
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn

from predict import predict_tumor, model, device
from gradcam import GradCAM
from segmentation import load_unet, segment_tumor
from severity import compute_severity
from model import CLASS_NAMES

app = FastAPI(
    title="Brain Tumor Detection API",
    description="MRI → Classification + Grad-CAM + Segmentation + Severity",
    version="3.0.0"
)

# CORS configuration backed by ALLOWED_ORIGINS env variable
origins_env = os.getenv("ALLOWED_ORIGINS", "*")
allowed_origins = [origin.strip() for origin in origins_env.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

gradcam_engine = GradCAM(model, device)
_, _ = load_unet(model_path=None, device=device)


@app.get("/")
def root():
    return {"message": "Brain Tumor Detection API v3.0 — Grad-CAM based segmentation"}


@app.get("/health")
def health():
    return {"status": "ok", "version": "3.0.0", "segmentation": "grad-cam-based"}


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        image_bytes = await file.read()
        result = predict_tumor(image_bytes)
        return JSONResponse(content=result)
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@app.post("/gradcam")
async def gradcam(file: UploadFile = File(...)):
    try:
        image_bytes = await file.read()
        clf_result = predict_tumor(image_bytes)
        pred_idx = CLASS_NAMES.index(clf_result["prediction"])
        heatmap_b64, _, _ = gradcam_engine.generate(image_bytes, class_idx=pred_idx)
        return JSONResponse(content={**clf_result, "heatmap_base64": heatmap_b64})
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):
    try:
        image_bytes = await file.read()

        # Step 1: Classification
        clf_result = predict_tumor(image_bytes)
        pred_class = clf_result["prediction"]
        confidence = clf_result["confidence"]
        pred_idx = CLASS_NAMES.index(pred_class)

        # Tumor check — fixed
        is_tumor = pred_class != "notumor"

        # Step 2: Grad-CAM heatmap
        if is_tumor:
            heatmap_b64, _, _ = gradcam_engine.generate(image_bytes, class_idx=pred_idx)
        else:
            tumor_classes = [c for c in CLASS_NAMES if c != "notumor"]
            alt_idx = max(
                (CLASS_NAMES.index(c) for c in tumor_classes),
                key=lambda i: clf_result["class_probabilities"].get(CLASS_NAMES[i], 0)
            )
            heatmap_b64, _, _ = gradcam_engine.generate(image_bytes, class_idx=alt_idx)

        # Step 3: Segmentation
        if is_tumor:
            mask_b64, tumor_area_pct, binary_mask = segment_tumor(
                image_bytes,
                unet_model=None,
                device=device,
                threshold=0.4,
                gradcam_engine=gradcam_engine,
                class_idx=pred_idx
            )
        else:
            mask_b64 = None
            tumor_area_pct = 0.0
            binary_mask = None

        # Step 4: Severity
        severity = compute_severity(pred_class, confidence, tumor_area_pct, binary_mask)

        return JSONResponse(content={
            "prediction": pred_class,
            "confidence": confidence,
            "class_probabilities": clf_result["class_probabilities"],
            "heatmap_base64": heatmap_b64,
            "segmentation_mask_base64": mask_b64,
            "tumor_area_pct": tumor_area_pct,
            **severity
        })

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


if __name__ == "__main__":
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", "8000"))
    reload = os.getenv("RELOAD", "true").lower() == "true"
    uvicorn.run("main:app", host=host, port=port, reload=reload)