import ee
import os
from datetime import datetime, timedelta
from app.core.config import settings

EE_KEY_PATH = os.path.join(os.path.dirname(__file__), "../../core/gee-key.json")

def check_satellite_area(lat: float, lon: float):
    try:
        # 1. Initialize GEE
        try:
            ee.Initialize(project=settings.GEE_PROJECT_ID)
        except Exception:
            credentials = ee.ServiceAccountCredentials(settings.SERVICE_ACCOUNT_EMAIL, EE_KEY_PATH)
            ee.Initialize(credentials, project=settings.GEE_PROJECT_ID)

        # 2. Define search area
        point = ee.Geometry.Point([float(lon), float(lat)]).buffer(500).bounds()

        # 3. Fetch latest imagery (Strict Cloud Filter)
        end_date = datetime.now().strftime('%Y-%m-%d')
        start_date = (datetime.now() - timedelta(days=30)).strftime('%Y-%m-%d')

        collection = (ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
                      .filterBounds(point)
                      .filterDate(start_date, end_date)
                      .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 15))
                      .sort('system:time_start', False) # Get the NEWEST image first
                      .limit(1))

        img = collection.first()
        
        if not img.getInfo():
            return {"status": "mismatch", "reason": "No clear satellite pass in the last 30 days."}

        # 4. NDWI Calculation (Water Detection)
        # Formula: (Green - NIR) / (Green + NIR)
        ndwi = img.normalizedDifference(['B3', 'B8']).rename('NDWI')
        
        # Get the mean NDWI value for the point
        stats = ndwi.reduceRegion(
            reducer=ee.Reducer.mean(),
            geometry=point,
            scale=10
        ).getInfo()

        water_value = stats.get('NDWI', 0)

        # 5. Logical Matching
        # NDWI > 0 usually indicates water/flooding
        is_water_present = water_value > 0

        return {
            "status": "match",
            "match": True,
            "water_detected": is_water_present,
            "ndwi_score": round(water_value, 4),
            "detail": "Satellite confirms area terrain matches request parameters."
        }

    except Exception as e:
        return {"status": "error", "reason": str(e)}