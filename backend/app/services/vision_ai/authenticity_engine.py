from app.services.vision_ai.ai_detector import detect_ai_generated

def analyze_authenticity(file_path: str):
    result = detect_ai_generated(file_path)
    label = result["label"] # 'artificial' or 'human'
    conf = result["confidence"]

    # Threshold Adjustment
    if label == "artificial" and conf >= 0.45:
        final = "ai_generated"
    elif label == "human" and conf >= 0.60: # 60% se upar human matlab Real
        final = "real"
    else:
        final = "uncertain"

    return {
        "label": final,
        "confidence": round(conf, 3)
    }