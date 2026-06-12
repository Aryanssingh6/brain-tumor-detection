# 🧠 NeuroScan AI — Brain Tumor Detection & Analysis System

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=nextdotjs)
![FastAPI](https://img.shields.io/badge/FastAPI-0.110-009688?style=flat-square&logo=fastapi)
![PyTorch](https://img.shields.io/badge/PyTorch-EfficientNet-EE4C2C?style=flat-square&logo=pytorch)
![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=flat-square&logo=python)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

> Clinical-grade brain tumor classification powered by EfficientNet-B0 — with Grad-CAM explainability, severity scoring, and real-time MRI analysis.

🔗 [Live Demo](#) • 🐛 [Report Bug](../../issues) • ✨ [Request Feature](../../issues)

---

## 📌 Table of Contents
- [🚀 Overview](#-overview)
- [✨ Key Features](#-key-features)
- [🏗 Architecture](#-architecture)
- [🧠 Model & Math](#-model--math)
- [🚀 Getting Started](#-getting-started)
- [📂 Project Structure](#-project-structure)
- [🎯 Results](#-results)
- [🔮 Roadmap](#-roadmap)
- [📄 License](#-license)

---

## 🚀 Overview

**NeuroScan AI** is a full-stack medical AI system that classifies brain tumors from MRI scans using deep learning — not pixel filters, not lookup tables. Real EfficientNet-B0 inference on actual image tensors.

It goes beyond classification:

- 🧬 **Detects** 4 tumor classes: `Glioma`, `Meningioma`, `Pituitary`, `No Tumor`
- 🔍 **Explains** predictions with Grad-CAM heatmaps (visual saliency)
- 🗺️ **Segments** tumor regions using Grad-CAM-derived masks
- ⚠️ **Scores** severity and generates clinical recommendations
- 🖥️ **Displays** everything on a dark-theme medical dashboard

You're not applying a filter. You're running a convolutional neural network.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🎯 **4-Class Classification** | Glioma, Meningioma, Pituitary Tumor, No Tumor |
| 🔥 **Grad-CAM Explainability** | Heatmap overlay showing what the model focused on |
| 🗺️ **Tumor Segmentation** | Grad-CAM-derived binary mask (no over-segmentation) |
| ⚠️ **Severity Scoring** | Risk level + clinical recommendations per prediction |
| ⚡ **FastAPI Backend** | High-performance async inference endpoint |
| 🖥️ **Medical Dashboard** | Next.js dark UI with real-time results display |
| 📊 **Confidence Scores** | Per-class probability breakdown |

---

## 🏗 Architecture

NeuroScan follows a compute-separated client/server pipeline.

```
MRI Upload → Next.js Frontend
                  ↓
           FastAPI Backend
                  ↓
        EfficientNet-B0 (PyTorch)
                  ↓
     ┌────────────┬────────────┐
     ↓            ↓            ↓
 Prediction   Grad-CAM    Segmentation
 + Confidence  Heatmap      Mask
     └────────────┴────────────┘
                  ↓
         Severity Scoring
                  ↓
         JSON Response → Dashboard
```

### Frontend
- **Next.js 15** (App Router)
- **React 18** + TypeScript
- **Tailwind CSS** — dark medical theme
- Drag-and-drop MRI upload
- Real-time heatmap + segmentation visualization

### Backend
- **Python 3.10+**
- **FastAPI** REST API
- **PyTorch** + **EfficientNet-B0**
- **OpenCV** for Grad-CAM rendering
- **NumPy** for matrix operations

---

## 🧠 Model & Math

### EfficientNet-B0
Pretrained on ImageNet, fine-tuned on brain MRI dataset.

- **Input:** 224×224 RGB MRI scan
- **Output:** 4-class softmax probabilities
- **Validation Accuracy:** ~94.56%
- **Optimizer:** Adam | **Loss:** CrossEntropyLoss

### Grad-CAM (Gradient-weighted Class Activation Mapping)

```
L_Grad-CAM = ReLU( Σ αk · Ak )
```

Where:
- `αk` = global average pooled gradients of target class w.r.t. feature map `k`
- `Ak` = activation map from last conv layer

Result → heatmap showing **which pixels influenced the prediction most**.

### Tumor Segmentation
Grad-CAM mask is threshold-binarized (no pretrained U-Net — avoids over-segmentation):

```python
_, mask = cv2.threshold(heatmap_gray, threshold, 255, cv2.THRESH_BINARY)
```

### Severity Scoring
Based on predicted class + confidence score:

| Class | Base Severity | Confidence Modifier |
|---|---|---|
| Glioma | High | +weight if conf > 0.85 |
| Meningioma | Medium | proportional |
| Pituitary | Medium-Low | proportional |
| No Tumor | None | — |

---

## 🚀 Getting Started

### ✅ Prerequisites
- Node.js v18+
- Python v3.10+
- CUDA (optional, for GPU inference)

### 1️⃣ Clone Repository
```bash
git clone https://github.com/Aryanssingh6/brain-tumor-detection.git
cd brain-tumor-detection
```

### 2️⃣ Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate

pip install fastapi uvicorn torch torchvision opencv-python numpy pillow python-multipart

# Download model weights (if not included)
# Place model.pth in backend/models/

uvicorn main:app --reload --port 8000
```
Backend: 👉 `http://localhost:8000`

### 3️⃣ Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend: 👉 `http://localhost:3000`

---

## 📂 Project Structure

```
/
├── backend/
│   ├── main.py              # FastAPI app + routes
│   ├── model/
│   │   ├── efficientnet.py  # Model loading + inference
│   │   └── gradcam.py       # Grad-CAM implementation
│   ├── utils/
│   │   ├── preprocess.py    # Image preprocessing
│   │   └── severity.py      # Severity scoring logic
│   └── models/
│       └── model.pth        # Trained weights
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   └── page.tsx     # Main dashboard
│   │   └── components/
│   │       ├── UploadZone/
│   │       ├── ResultCard/
│   │       └── HeatmapView/
│   └── public/
│
└── landing/                 # Landing page
```

---

## 🎯 Results

| Metric | Value |
|---|---|
| Validation Accuracy | **94.56%** |
| Model | EfficientNet-B0 |
| Dataset | Brain MRI (Kaggle) |
| Classes | 4 (Glioma, Meningioma, Pituitary, No Tumor) |
| Training Platform | Kaggle (GPU T4) |

---

## 🔮 Roadmap

- [x] EfficientNet-B0 classification (4 classes)
- [x] Grad-CAM explainability heatmaps
- [x] Grad-CAM-derived tumor segmentation
- [x] Severity scoring + clinical recommendations
- [x] Next.js medical dashboard
- [ ] Live deployment (Render + Vercel)
- [ ] DICOM file support
- [ ] Multi-modal MRI input (T1, T2, FLAIR)
- [ ] Patient history tracking

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.

---

## 👨‍💻 Author

**Aryan Singh** — B.Tech CSE (AI & ML), RCOEM Nagpur  
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=flat-square&logo=linkedin)](https://linkedin.com/in/aryan-singh-580882291)
[![Codolio](https://img.shields.io/badge/Codolio-Profile-orange?style=flat-square)](https://codolio.com/profile/AryanSingh10)

---

> *"Not filters. Not approximations. Real deep learning inference on medical imaging data."*

Built with ❤️ using PyTorch, FastAPI & Next.js
