import pandas as pd
from transformers import DistilBertTokenizer, DistilBertForSequenceClassification, Trainer, TrainingArguments
from datasets import Dataset

MODEL_PATH = "./saved_model"

print("Loading trained model...")

tokenizer = DistilBertTokenizer.from_pretrained(MODEL_PATH)
model = DistilBertForSequenceClassification.from_pretrained(MODEL_PATH)

print("Loading new dataset...")

df = pd.read_csv("sexist_dataset.csv") 

dataset = Dataset.from_pandas(df)

def tokenize(example):
    return tokenizer(
        example["text"],
        truncation=True,
        padding="max_length",
        max_length=64
    )

dataset = dataset.map(tokenize)

dataset = dataset.rename_column("label", "labels")
dataset.set_format(type="torch", columns=["input_ids", "attention_mask", "labels"])

training_args = TrainingArguments(
    output_dir="./results",
    num_train_epochs=2,
    per_device_train_batch_size=8,
    logging_steps=10,
)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=dataset
)

print("Fine tuning...")

trainer.train()

print("Saving improved model...")

trainer.save_model("./saved_model_v2")       
tokenizer.save_pretrained("./saved_model_v2") 

print("Done.")