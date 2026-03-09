from fastapi import FastAPI, HTTPException
from schemas import TextRequest
from model_loader import predict_text
from datetime import datetime

app = FastAPI(
    title="SafeSpace Moderation API",
    description="AI powered content moderation system that detects toxic, racist, and sexist text.",
    version="1.0.0"
)


@app.get("/")
def home():
    return {
        "message": "SafeSpace API is running",
        "status": "online",
        "timestamp": datetime.utcnow()
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "SafeSpace AI Moderation",
        "timestamp": datetime.utcnow()
    }


@app.post("/predict")
def predict(data: TextRequest):

    if not data.text or len(data.text.strip()) == 0:
        raise HTTPException(
            status_code=400,
            detail="Text input cannot be empty"
        )

    try:
        result = predict_text(data.text)

        return {
            "input_text": data.text,
            "classification": result["classification"],
            "confidence": result["confidence"],
            "timestamp": datetime.utcnow()
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(e)}"
        )