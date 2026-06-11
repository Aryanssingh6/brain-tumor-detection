import torch
import torch.nn.functional as F
import numpy as np
import cv2
import base64
import io
from PIL import Image


def load_unet(model_path=None, device=None):
    """
    Grad-CAM based segmentation — no separate U-Net needed.
    Returns None, False as placeholder for API compatibility.
    """
    return None, False


def segment_tumor(image_bytes: bytes, unet_model, device, threshold: float = 0.4, gradcam_engine=None, class_idx: int = None):
    """
    Derives tumor segmentation mask from Grad-CAM activation maps.

    IMPORTANT: Call gradcam_engine.generate() BEFORE calling this function.
    This function reuses the activations/gradients already stored by the last
    generate() call so we avoid a redundant second forward+backward pass,
    which would otherwise corrupt the shared hook state and produce wrong masks.

    Only call this when a tumor class is predicted — passing class_idx for a
    "no_tumor" prediction will threshold healthy-tissue activations and produce
    a false non-zero tumor area (the 29.93% bug).
    """
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    original = np.array(image.resize((256, 256)))

    # Reuse activations & gradients already populated by the preceding generate() call.
    # This avoids a second .backward() that would overwrite the shared hook buffers.
    grads = gradcam_engine.gradients[0]   # (C, H, W)
    acts  = gradcam_engine.activations[0] # (C, H, W)
    weights = grads.mean(dim=(1, 2))

    cam = torch.zeros(acts.shape[1:], device=device)
    for i, w in enumerate(weights):
        cam += w * acts[i]

    cam = F.relu(cam)
    cam = cam.cpu().detach().numpy()

    # Normalize
    cam = cv2.resize(cam, (256, 256))
    cam = (cam - cam.min()) / (cam.max() - cam.min() + 1e-8)

    # Threshold to binary mask
    binary_mask = (cam > threshold).astype(np.uint8)

    # Morphological cleanup — remove noise
    kernel = np.ones((5, 5), np.uint8)
    binary_mask = cv2.morphologyEx(binary_mask, cv2.MORPH_CLOSE, kernel)
    binary_mask = cv2.morphologyEx(binary_mask, cv2.MORPH_OPEN, kernel)

    tumor_area_pct = round(float(binary_mask.sum()) / (256 * 256) * 100, 2)

    # Color overlay
    overlay = original.copy()
    overlay[binary_mask == 1] = [255, 50, 50]
    blended = cv2.addWeighted(original, 0.55, overlay, 0.45, 0)

    # Contours
    contours, _ = cv2.findContours(binary_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    cv2.drawContours(blended, contours, -1, (255, 220, 0), 2)

    _, buffer = cv2.imencode(".png", cv2.cvtColor(blended, cv2.COLOR_RGB2BGR))
    mask_b64 = base64.b64encode(buffer).decode("utf-8")

    return mask_b64, tumor_area_pct, binary_mask