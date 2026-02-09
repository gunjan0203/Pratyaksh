from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Optional
import os

# Services import
from app.services.integrity.tamper_detector import detect_tampering
from app.services.satellite.sentinel_client import check_satellite_area
from app.services.vision_ai.reverse_search import get_image_history
from app.services.vision_ai.authenticity_engine import analyze_authenticity

router = APIRouter()

@router.post("/verify")
async def verify_media(
    file: UploadFile = File(...),
    lat: Optional[str] = Form(None),
    lon: Optional[str] = Form(None)
):
    current_file_path = f"temp_{file.filename}"
    
    # Debugging prints to track coordinate flow
    print(f"\n--- Processing New Request ---")
    print(f"File: {file.filename}")
    print(f"Raw Input -> Lat: {lat}, Lon: {lon}")
    
    try:
        # Safe conversion of coordinates
        safe_lat = float(lat) if lat and lat.strip() else None
        safe_lon = float(lon) if lon and lon.strip() else None

        # 1. Save Image Locally
        contents = await file.read()
        with open(current_file_path, "wb") as f:
            f.write(contents)

        # 2. AI Content Check (Origin)
        ai_check = analyze_authenticity(current_file_path)

        # 3. Tampering Check (Integrity)
        tamper = detect_tampering(current_file_path)

        # 4. Satellite Ground Truth Check (Context)
        satellite = {"status": "skipped"}
        if safe_lat is not None and safe_lon is not None:
            print(f"Cross-referencing with Satellite at: {safe_lat}, {safe_lon}")
            satellite = check_satellite_area(safe_lat, safe_lon)
            print(f"Satellite Match Result: {satellite.get('status')}")

        # 5. Reverse Search Check
        history = get_image_history(current_file_path)

        # 6. Compute Cross-Matched Verdict
        verdict = compute_cross_matched_verdict(ai_check, tamper, satellite, history)

        # Cleanup
        if os.path.exists(current_file_path):
            os.remove(current_file_path)

        return {
            "status": "success",
            "verdict": verdict,
            "details": {
                "ai_check": ai_check,
                "tamper": tamper,
                "satellite": satellite,
                "history": history
            }
        }

    except Exception as e:
        if os.path.exists(current_file_path):
            os.remove(current_file_path)
        print(f"Error: {str(e)}")
        return {"status": "error", "message": str(e)}

def compute_cross_matched_verdict(ai_check, tamper, satellite, history):
    ai_label = ai_check.get("label")
    ai_conf = ai_check.get("confidence", 0)
    sat_status = satellite.get("status") # 'match', 'mismatch', or 'skipped'
    is_tampered = tamper.get("suspicious", False)

    # --- THE CROSS-MATCHING LOGIC ---

    # 1. TAMPERING IS AN IMMEDIATE RED FLAG
    if is_tampered:
        return {"label": "Manipulated", "color": "red", "reason": "Digital tampering detected in image pixels."}

    # 2. SATELLITE MISMATCH (The "Liar" Check)
    # Even if AI thinks it's human, if Satellite shows no disaster area, it's a mismatch.
    if sat_status == "mismatch":
        return {
            "label": "Misleading", 
            "color": "red", 
            "reason": "Satellite data does not confirm disaster activity at these coordinates."
        }

    # 3. SUCCESSFUL MATCH (High Confidence)
    # Both AI and Satellite agree.
    if ai_label in ["human", "real"] and ai_conf >= 0.80 and sat_status == "match":
        return {
            "label": "Authentic", 
            "color": "green", 
            "reason": "Confirmed: Image origin verified and Ground Truth matched by satellite."
        }

    # 4. AI FAKE DETECTION
    if ai_label in ["ai_generated", "artificial"] and ai_conf > 0.40:
        return {"label": "Fake (AI)", "color": "red", "reason": "AI-generated patterns detected in media."}

    # 5. UNCERTAIN (Fallback)
    # If coordinates were skipped or AI confidence is mid-range
    return {
        "label": "Uncertain", 
        "color": "yellow", 
        "reason": f"Insufficient verification data ({int(ai_conf*100)}% AI confidence). Verify manually."
    }