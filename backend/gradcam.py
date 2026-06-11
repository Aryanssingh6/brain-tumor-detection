import torch
import torch.nn.functional as F
import numpy as np
import cv2
import base64
import io
from PIL import Image
import torchvision.transforms as transforms

class GradCAM:
    def __init__(self, model, device):
        self.model = model
        self.device = device
        self.gradients = None
        self.activations = None
        self._register_hooks()

    def _register_hooks(self):
        # EfficientNet-B0 ka last conv block — features[7] is the final conv stage
        target_layer = self.model.features[-1]

        def forward_hook(module, input, output):
            self.activations = output.detach()

        def backward_hook(module, grad_input, grad_output):
            self.gradients = grad_output[0].detach()

        target_layer.register_forward_hook(forward_hook)
        target_layer.register_full_backward_hook(backward_hook)

    def generate(self, image_bytes: bytes, class_idx: int = None):
        transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406],
                                 std=[0.229, 0.224, 0.225])
        ])

        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        original = image.resize((224, 224))
        input_tensor = transform(image).unsqueeze(0).to(self.device)

        # Forward pass
        self.model.zero_grad()
        output = self.model(input_tensor)
        probs = F.softmax(output, dim=1)[0]

        if class_idx is None:
            class_idx = probs.argmax().item()

        # Backward pass for target class
        score = output[0, class_idx]
        score.backward()

        # Grad-CAM computation
        grads = self.gradients[0]           # (C, H, W)
        acts = self.activations[0]          # (C, H, W)
        weights = grads.mean(dim=(1, 2))    # Global average pooling

        cam = torch.zeros(acts.shape[1:], device=self.device)
        for i, w in enumerate(weights):
            cam += w * acts[i]

        cam = F.relu(cam)
        cam = cam.cpu().numpy()

        # Normalize and resize
        cam = cv2.resize(cam, (224, 224))
        cam = (cam - cam.min()) / (cam.max() - cam.min() + 1e-8)
        heatmap = cv2.applyColorMap(np.uint8(255 * cam), cv2.COLORMAP_JET)
        heatmap = cv2.cvtColor(heatmap, cv2.COLOR_BGR2RGB)

        # Overlay on original image
        original_np = np.array(original)
        overlay = cv2.addWeighted(original_np, 0.5, heatmap, 0.5, 0)

        # Encode to base64
        _, buffer = cv2.imencode(".png", cv2.cvtColor(overlay, cv2.COLOR_RGB2BGR))
        heatmap_b64 = base64.b64encode(buffer).decode("utf-8")

        return heatmap_b64, class_idx, probs.tolist()