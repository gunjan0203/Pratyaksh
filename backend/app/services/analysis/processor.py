import cv2
import numpy as np
from skimage.metrics import structural_similarity as ssim
import os

def run_deep_analysis(before_path, after_path):
    img1 = cv2.imread(before_path)
    img2 = cv2.imread(after_path)
    img2 = cv2.resize(img2, (img1.shape[1], img1.shape[0]))
    
    gray1 = cv2.cvtColor(img1, cv2.COLOR_BGR2GRAY)
    gray2 = cv2.cvtColor(img2, cv2.COLOR_BGR2GRAY)
    
    (score, diff) = ssim(gray1, gray2, full=True)
    damage_percent = (1 - score) * 100
    
    # Heatmap logic
    diff = (diff * 255).astype("uint8")
    heatmap = cv2.applyColorMap(diff, cv2.COLORMAP_JET)
    os.makedirs("static", exist_ok=True)
    heatmap_path = "static/heatmap_output.png"
    cv2.imwrite(heatmap_path, heatmap)
    
    # Severity & Type
    severity = "Critical" if damage_percent > 50 else "Moderate" if damage_percent > 20 else "Low"
    
    # --- YAHAN CHANGES HAIN ---
    # Example: ₹50,000 per 1% damage logic
    estimated_cost_in_rupees = damage_percent * 50000 
    
    return {
        "damage_percent": round(damage_percent, 2),
        "severity": severity,
        "type": "Structural/Terrain Change",
        "estimated_cost": f"₹ {round(estimated_cost_in_rupees, 2)}", # Symbol updated to ₹
        "heatmap_url": heatmap_path
    }