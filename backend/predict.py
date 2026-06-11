import torch
import torch.nn.functional as F
import torchvision.transforms as transforms
from PIL import Image
import numpy as np
import base64
import io
from model import load_model, CLASS_NAMES

model, device = load_model("best_model.pth")

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])

def predict_tumor(image_bytes: bytes) -> dict:
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    input_tensor = transform(image).unsqueeze(0).to(device)

    with torch.no_grad():
        output = model(input_tensor)
        probabilities = F.softmax(output, dim=1)[0]

    pred_idx = probabilities.argmax().item()
    pred_class = CLASS_NAMES[pred_idx]
    confidence = probabilities[pred_idx].item()

    class_probs = {
        CLASS_NAMES[i]: round(probabilities[i].item(), 4)
        for i in range(len(CLASS_NAMES))
    }

    return {
        "prediction": pred_class,
        "confidence": round(confidence, 4),
        "class_probabilities": class_probs
    }
