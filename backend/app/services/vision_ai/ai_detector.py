from transformers import pipeline

detector = pipeline(
    "image-classification",
    model="umm-maybe/AI-image-detector",
    device=-1
)

def detect_ai_generated(image_path: str):
    preds = detector(image_path)

    top = preds[0]
    label = top["label"].lower()
    score = float(top["score"])

    if "ai" in label or "artificial" in label or "fake" in label:
        final_label = "artificial"
    else:
        final_label = "human"

    return {
        "provider": "umm-maybe-ai-detector",
        "label": final_label,
        "confidence": score,
        "raw": preds,
    }
