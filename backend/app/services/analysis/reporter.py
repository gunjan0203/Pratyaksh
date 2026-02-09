from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
import os

def create_pdf_report(data, filename="Damage_Report.pdf"):
    # Pehle purani report delete karo agar exist karti hai
    if os.path.exists(filename):
        os.remove(filename)

    c = canvas.Canvas(filename, pagesize=letter)
    
    # Title
    c.setFont("Helvetica-Bold", 18)
    c.drawString(100, 750, "Post-Disaster Damage Assessment Report")
    
    # Details
    c.setFont("Helvetica", 12)
    c.drawString(100, 710, f"Damage Percentage: {data['damage_percent']}%")
    c.drawString(100, 690, f"Severity Score: {data['severity']}")
    
    # Yahan dhyan dena: data['estimated_cost'] mein ₹ processor.py se aa raha hai
    c.drawString(100, 670, f"Estimated Repair Cost: {data['estimated_cost']}") 
    
    c.drawString(100, 650, f"Analysis Type: {data['type']}")
    
    # Heatmap image
    if os.path.exists(data['heatmap_url']):
        c.drawString(100, 610, "Damage Heatmap (Visual Analysis):")
        # Image placement
        c.drawImage(data['heatmap_url'], 100, 320, width=400, height=250)
    
    c.save()
    return filename