import numpy as np


def compute_severity(
    tumor_class: str,
    confidence: float,
    tumor_area_pct: float,
    binary_mask: np.ndarray = None
) -> dict:

    class_risk = {
        "glioma":     0.90,
        "meningioma": 0.55,
        "pituitary":  0.45,
        "notumor":    0.00,  # fixed — no underscore
    }

    base_risk = class_risk.get(tumor_class, 0.5)

    area_score = min(tumor_area_pct / 30.0, 1.0) if tumor_area_pct else 0.0

    if tumor_class == "notumor":  # fixed
        severity_score = 0.0
    else:
        severity_score = round(
            (base_risk * 0.5) + (confidence * 0.3) + (area_score * 0.2), 3
        )

    if severity_score == 0.0:
        level = "None"
        color = "#22c55e"
        recommendations = [
            "No tumor detected.",
            "Routine annual MRI recommended.",
            "Consult neurologist if symptoms persist."
        ]
    elif severity_score < 0.4:
        level = "Low"
        color = "#84cc16"
        recommendations = [
            "Small or benign lesion suspected.",
            "Follow-up MRI in 6 months.",
            "Neurology consultation advised."
        ]
    elif severity_score < 0.65:
        level = "Moderate"
        color = "#f59e0b"
        recommendations = [
            "Significant tumor presence detected.",
            "Immediate neurology referral required.",
            "Consider contrast-enhanced MRI.",
            "Biopsy may be needed for definitive diagnosis."
        ]
    else:
        level = "High"
        color = "#ef4444"
        recommendations = [
            "High-risk tumor detected — urgent intervention required.",
            "Emergency neurosurgery consultation.",
            "Full brain MRI with contrast + CT scan.",
            "Begin treatment planning immediately."
        ]

    if tumor_area_pct == 0 or tumor_class == "notumor":  # fixed
        size_category = "N/A"
    elif tumor_area_pct < 2:
        size_category = "Micro (<2% of scan)"
    elif tumor_area_pct < 8:
        size_category = "Small (2–8%)"
    elif tumor_area_pct < 20:
        size_category = "Medium (8–20%)"
    else:
        size_category = "Large (>20%)"

    return {
        "severity_score": severity_score,
        "severity_level": level,
        "severity_color": color,
        "tumor_area_pct": tumor_area_pct,
        "size_category": size_category,
        "recommendations": recommendations
    }