# import ee
# import os
# from app.core.config import settings

# # Path to your JSON key
# EE_KEY_PATH = os.path.join(os.path.dirname(__file__), "../../core/gee-key.json")

# def estimate_damage(lat: float, lon: float, disaster_date: str):
#     try:
#         # STEP 1: Strict Initialization
#         # Agar EE initialize nahi hai, toh credentials ke saath karo
#         if not ee.data._auth: 
#             creds = ee.ServiceAccountCredentials(settings.SERVICE_ACCOUNT_EMAIL, EE_KEY_PATH)
#             ee.Initialize(creds, project=settings.GEE_PROJECT_ID)
        
#         # Area define karo (2km radius around the point)
#         point = ee.Geometry.Point([lon, lat])
#         area = point.buffer(2000).bounds()

#         # STEP 2: Before Image (Disaster se pehle ki clean photo)
#         before_col = (ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
#                       .filterBounds(area)
#                       .filterDate('2024-01-01', disaster_date)
#                       .sort('CLOUDY_PIXEL_PERCENTAGE'))
        
#         before_img = before_col.first()

#         # STEP 3: After Image (Disaster ke baad ki photo)
#         after_col = (ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
#                      .filterBounds(area)
#                      .filterDate(disaster_date, '2026-12-31')
#                      .sort('CLOUDY_PIXEL_PERCENTAGE'))
        
#         after_img = after_col.first()

#         # Check if imagery is available
#         if not before_img.getInfo() or not after_img.getInfo():
#             return {"status": "error", "reason": "Satellite imagery not available for the selected dates."}

#         # STEP 4: Damage Calculation (NDVI Difference)
#         # NDVI green pixels ko measure karta hai. Agar green pixels kam hue = Damage.
#         def get_ndvi(img):
#             return img.normalizedDifference(['B8', 'B4'])

#         before_ndvi = get_ndvi(before_img)
#         after_ndvi = get_ndvi(after_img)
        
#         # Dono ka difference
#         diff = before_ndvi.subtract(after_ndvi)
        
#         # Poore area ka average nikalna
#         stats = diff.reduceRegion(
#             reducer=ee.Reducer.mean(),
#             geometry=area,
#             scale=30 # 30m resolution is stable
#         ).getInfo()

#         # Logic: 0.1 to 0.5 ka difference matlab significant damage
#         raw_score = stats.get('nd', 0)
#         damage_percent = min(max(raw_score * 200, 5), 98) # Normalize to %
        
#         severity = "High" if damage_percent > 60 else "Medium" if damage_percent > 30 else "Low"

#         return {
#             "status": "success",
#             "damage_percentage": round(damage_percent, 2),
#             "severity_score": severity,
#             "analysis": f"Satellite analysis detects {severity} impact on vegetation and soil structure."
#         }

#     except Exception as e:
#         return {"status": "error", "reason": f"GEE Logic Error: {str(e)}"}
    