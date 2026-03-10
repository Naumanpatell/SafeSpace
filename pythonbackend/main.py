from fastapi import FastAPI,Request
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Outlook Email Tone Checker")

# Allow CORS for your extension
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class EmailText(BaseModel):
    text: str

OFFENSIVE_WORDS = ["idiot", "stupid", "hate", "dumb"]

@app.post("/check-email")
async def check_email(email: EmailText):

    print("\n------ EMAIL RECEIVED ------")
    print(email.text)
    print("----------------------------\n")

    text_lower = email.text.lower()
    offensive_found = any(word in text_lower for word in OFFENSIVE_WORDS)

    return {"offensive": offensive_found}


# @app.post("/report-email")
# async def report_email(email: EmailText):

#     print("\n🚨 ------ EMAIL REPORTED TO SAFESPACE ------")
#     print(email.text)
#     print("🚨 -----------------------------------------\n")

#     return {
#         "status": "reported",
#         "message": "Email successfully reported to SafeSpace"
#     }


class ReportedEmail(BaseModel):
    sender: str = ""
    subject: str = ""
    body: str = ""

@app.post("/report")
async def report_email(request: Request):
    raw = await request.json()
    print("RAW DATA RECEIVED:", raw)

    email = ReportedEmail(**raw)

    print("\n🚨 ------ EMAIL REPORTED TO SAFESPACE ------")
    print(f"👤 Sender:  {email.sender}")
    print(f"📋 Subject: {email.subject}")
    print(f"📝 Body:\n{email.body}")
    print("🚨 -----------------------------------------\n")

    return {
        "status": "reported",
        "message": "Email successfully reported to SafeSpace"
    }