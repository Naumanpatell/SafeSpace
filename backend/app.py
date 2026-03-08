from fastapi import FastAPI
from schemas import TextRequest, PredictionResponse
from model_loader import predict
from database import save_log

app = FastAPI()

@app.get("/")
def root():
    return {"message": "SafeSpace AI API running"}


@app.post("/analyze", response_model=PredictionResponse)
def analyze_text(request: TextRequest):

    prediction = predict(request.text)

    save_log(request.text, prediction)

    return PredictionResponse(prediction=prediction)