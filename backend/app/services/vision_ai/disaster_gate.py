from app.services.vision_ai.floods import detect_flood

def is_disaster_image(image_path: str):
    # Pehle flood model se check karo
    flood_res = detect_flood(image_path)
    if flood_res["detected"] and flood_res["confidence"] > 0.7:
        return {"is_disaster": True, "type": "flood", "confidence": flood_res["confidence"]}
    
    # Agar flood nahi hai, tab generic classifier par jao
    # ... baki logic ...