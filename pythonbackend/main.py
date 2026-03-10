from fastapi import FastAPI, Request
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import sys
import os
sys.path.append(r"C:\Users\HP\OneDrive\Desktop\SafeSpace\backend")
from model_loader import predict_text

app = FastAPI(title="Outlook Email Tone Checker")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class EmailText(BaseModel):
    text: str

class ReportedEmail(BaseModel):
    sender: str = ""
    subject: str = ""
    body: str = ""


@app.post("/check-email")
async def check_email(email: EmailText):

    print("\n------ EMAIL RECEIVED ------")
    print(email.text)
    print("----------------------------\n")

    # ✅ Use AI model instead of keyword list
    result = predict_text(email.text)

    classification = result["classification"]  # safe / toxic / racist / sexist
    confidence = result["confidence"]

    is_offensive = classification != "safe"

    print(f"🤖 AI Result: {classification} ({confidence})")

    return {
        "offensive": is_offensive,
        "classification": classification,
        "confidence": confidence
    }


# -----------------------------
# REPORT EMAIL ENDPOINT
# Called when user clicks the Report button
# Logs the reported email details
# -----------------------------
@app.post("/report")
async def report_email(request: Request):
    raw = await request.json()
    print("RAW DATA RECEIVED:", raw)

    email = ReportedEmail(**raw)

    # Also run AI check on reported email for logging
    result = predict_text(email.body)

    print("\n🚨 ------ EMAIL REPORTED TO SAFESPACE ------")
    print(f"👤 Sender:  {email.sender}")
    print(f"📋 Subject: {email.subject}")
    print(f"📝 Body:\n{email.body}")
    print(f"🤖 AI Classification: {result['classification']} ({result['confidence']})")
    print("🚨 -----------------------------------------\n")

    return {
        "status": "reported",
        "message": "Email successfully reported to SafeSpace",
        "classification": result["classification"],
        "confidence": result["confidence"]
    }