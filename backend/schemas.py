from pydantic import BaseModel

class TextRequest(BaseModel):
    text: str


class PredictionResponse(BaseModel):
    prediction: int