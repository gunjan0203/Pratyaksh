from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import Table, TableStyle
import os

def create_relief_pdf(data, filename="Relief_Plan.pdf"):
    c = canvas.Canvas(filename, pagesize=letter)
    width, height = letter

    # Header
    c.setFont("Helvetica-Bold", 18)
    c.setFillColor(colors.red)
    c.drawString(50, height - 50, "GOVERNMENT OF INDIA - RELIEF BLUEPRINT")
    
    c.setFont("Helvetica", 10)
    c.setFillColor(colors.black)
    c.drawString(50, height - 70, f"Disaster: {data['disaster']} | Target Population: {data['estimated_impact']}")
    c.line(50, height - 80, width - 50, height - 80)

    # Table Header
    table_data = [["Item Description", "Quantity", "Total Est.", "Nodal Source"]]
    for item in data['aid_items']:
        table_data.append([item['item'], item['quantity'], f"₹{item['total_cost']:,}", item['source']])

    # Styling Table
    relief_table = Table(table_data, colWidths=[200, 100, 80, 150])
    style = TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.darkgrey),
        ('TEXTCOLOR', (0,0), (-1,0), colors.whitesmoke),
        ('GRID', (0,0), (-1,-1), 0.5, colors.black),
        ('FONTSIZE', (0,0), (-1,-1), 8)
    ])
    relief_table.setStyle(style)
    relief_table.wrapOn(c, width, height)
    relief_table.drawOn(c, 40, height - 400)

    # Footer
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, 80, f"TOTAL BUDGET ESTIMATE: {data['total_budget']}")
    c.drawString(50, 60, f"EMERGENCY HELPLINE: {data['official_helpline']}")
    
    c.save()
    return filename