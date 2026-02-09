import cv2
import numpy as np
from PIL import Image, ImageChops
import os

def detect_tampering(file_path: str) -> dict:
    try:
        temp_file = "temp_ela.jpg"
        original = Image.open(file_path).convert('RGB')
        
        # 1. Image ko temporary save karo
        original.save(temp_file, 'JPEG', quality=90)
        temporary = Image.open(temp_file)
        
        # 2. Difference nikalo
        diff = ImageChops.difference(original, temporary)
        
        # 3. Scaling logic (Is line mein error tha)
        extrema = diff.getextrema()
        max_diff = max([ex[1] for ex in extrema])
        if max_diff == 0: max_diff = 1
        scale = 255.0 / max_diff
        
        # FIX: constant function ko sirf integer value chahiye
        diff = ImageChops.multiply(diff, Image.new('RGB', diff.size, (int(scale), int(scale), int(scale))))
        
        # 4. Score calculate karo
        stats = np.array(diff).mean()
        is_suspicious = bool(stats > 5.0) 
        
        # Cleanup
        if os.path.exists(temp_file):
            os.remove(temp_file)
            
        return {
            "suspicious": is_suspicious,
            "score": round(stats, 2),
            "method": "ELA Analysis"
        }
    except Exception as e:
        return {"suspicious": False, "error": str(e)}