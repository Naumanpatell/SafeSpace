from transformers import DistilBertTokenizer, DistilBertForSequenceClassification
import torch

MODEL_PATH = "../model/saved_model"

print("Loading SafeSpace model...")

tokenizer = DistilBertTokenizer.from_pretrained(MODEL_PATH)
model = DistilBertForSequenceClassification.from_pretrained(MODEL_PATH)

model.eval()

labels = ["safe", "toxic", "racist", "sexist"]

print("Model loaded successfully")

def predict_text(text: str):

    inputs = tokenizer(
        text,
        return_tensors="pt",
        truncation=True,
        padding=True,
        max_length=128
    )

    with torch.no_grad():
        outputs = model(**inputs)

    logits = outputs.logits

    prediction = torch.argmax(logits).item()

    probabilities = torch.softmax(logits, dim=1)
    confidence = probabilities[0][prediction].item()

    return {
        "classification": labels[prediction],
        "confidence": round(confidence, 3)
    }