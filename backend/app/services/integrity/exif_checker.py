from PIL import Image
from PIL.ExifTags import TAGS, GPSTAGS

def extract_exif(file_path: str) -> dict:
    try:
        image = Image.open(file_path)
        exif_raw = image._getexif()
        if not exif_raw:
            return {"available": False}

        exif = {}
        for tag, value in exif_raw.items():
            decoded = TAGS.get(tag, tag)
            exif[decoded] = value

        gps_data = {}
        if "GPSInfo" in exif:
            for key in exif["GPSInfo"]:
                decoded = GPSTAGS.get(key, key)
                gps_data[decoded] = exif["GPSInfo"][key]
            exif["GPSInfo"] = gps_data

        return {
            "available": True,
            "data": exif
        }
    except Exception as e:
        return {"available": False, "error": str(e)}
