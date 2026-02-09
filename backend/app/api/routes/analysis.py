from fastapi import APIRouter, UploadFile, File, Form
from fastapi.responses import FileResponse
import shutil, os
from app.services.analysis.processor import run_deep_analysis
from app.services.analysis.reporter import create_pdf_report
from app.services.relief.aid_calculator import calculate_relief_needs
from app.services.relief.relief_reporter import create_relief_pdf

router = APIRouter()

@router.post("/deep-damage-assessment")
async def analyze_damage(
    before_img: UploadFile = File(...), 
    after_img: UploadFile = File(...)
):
    # 1. Temporary save images to disk
    b_path, a_path = "temp_before.png", "temp_after.png"
    
    with open(b_path, "wb") as b:
        shutil.copyfileobj(before_img.file, b)
        
    with open(a_path, "wb") as a:
        shutil.copyfileobj(after_img.file, a)

    # 2. Run Image-to-Image Analysis (OpenCV Logic)
    try:
        results = run_deep_analysis(b_path, a_path)
        
        # 3. Create PDF Report
        create_pdf_report(results)

        return {
            "status": "success",
            "results": results,
            "report_link": "http://127.0.0.1:8000/analysis/download-report"
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}

@router.get("/download-report")
async def download_report():
    report_path = "Damage_Report.pdf"
    if os.path.exists(report_path):
        return FileResponse(report_path, media_type="application/pdf", filename="Impact_Report.pdf")
    return {"error": "Report file not found."}


@router.post("/relief-translator")
async def get_relief_aid(
    disaster_type: str = Form(...), 
    location_context: str = Form(...), 
    population_count: int = Form(...)
):
    # 1. Logic call
    relief_data = calculate_relief_needs(disaster_type, location_context, population_count)
    
    # 2. PDF Report create
    create_relief_pdf(relief_data)
    
    return {
        "status": "success",
        "data": relief_data,
        "report_link": "http://127.0.0.1:8000/analysis/download-relief-report"
    }

@router.get("/download-relief-report")
async def download_relief():
    report_path = "Relief_Plan.pdf"
    if os.path.exists(report_path):
        return FileResponse(report_path, media_type="application/pdf", filename="Relief_Blueprint.pdf")
    return {"error": "Report file not found."}