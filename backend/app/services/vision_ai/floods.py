from transformers import pipeline

_flood_model = pipeline(
    "image-classification",
    model="prithivMLmods/Flood-Image-Detection"
)

def detect_flood(image_path: str):
    result = _flood_model(image_path)[0]

    return {
        "detected": "flood" in result["label"].lower(),
        "confidence": float(result["score"]),
        "label": result["label"]
    }
