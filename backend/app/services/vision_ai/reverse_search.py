import requests
from app.core.config import settings

def get_image_history(file_path: str):
    if not settings.ZENSERP_KEY:
        return {"is_old": False, "error": "API Key missing"}

    # Ye API tab kaam karegi jab aap image ko public URL pe daloge
    # Demo ke liye hum dummy true/false return kar sakte hain ya API call setup kar sakte hain
    try:
        # Actual API call logic (requires public URL)
        return {"is_old": False, "msg": "No previous records found"}
    except:
        return {"is_old": False}