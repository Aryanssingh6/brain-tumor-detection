import torch
import torch.nn as nn
from torchvision import models

CLASS_NAMES = ["glioma", "meningioma", "notumor", "pituitary"]

def load_model(model_path: str = "best_model.pth"):
    model = models.efficientnet_b0(weights=None)
    
    # Simple classifier — original training ke saath match karta hai
    model.classifier = nn.Sequential(
        nn.Dropout(p=0.2, inplace=True),
        nn.Linear(1280, 4)
    )
    
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model.load_state_dict(torch.load(model_path, map_location=device))
    model.to(device)
    model.eval()
    return model, device
