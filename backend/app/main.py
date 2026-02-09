from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles # Zaroori hai images ke liye
from app.api.routes import media, analysis, alerts
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI(title="Disaster Authenticity & Analysis System")

# Static files setup (Heatmaps save karne ke liye)
if not os.path.exists("static"):
    os.makedirs("static")
app.mount("/static", StaticFiles(directory="static"), name="static")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Backend Version 2.0: Image-to-Image Damage Analysis Active"}

# Routes include karna
app.include_router(media.router, prefix="/media", tags=["Media Verification"])
app.include_router(analysis.router, prefix="/analysis", tags=["Damage Analysis"])
app.include_router(alerts.router, prefix="/alerts", tags=["Alerts"])