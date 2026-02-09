from fastapi import APIRouter, Query
from typing import Optional
from app.services.alerts.india_monitor import get_comprehensive_india_alerts

router = APIRouter()

@router.get("/india-all-disasters")
async def full_report(
    month: Optional[str] = Query(None),
    category: Optional[str] = Query(None)
):
    data = get_comprehensive_india_alerts(target_month=month)
    
    # Soft Filter: Agar category mangi hai toh title ya category mein dhundo
    if category:
        c = category.lower()
        data = [d for d in data if c in d['category'].lower() or c in d['title'].lower()]

    return {
        "status": "success",
        "total": len(data),
        "incidents": data
    }