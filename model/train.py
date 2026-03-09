import pandas as pd
from datasets import Dataset
from transformers import DistilBertTokenizer
from transformers import DistilBertForSequenceClassification
from transformers import TrainingArguments, Trainer

print("Loading dataset...")

df = pd.read_csv("dataset.csv")

dataset = Dataset.from_pandas(df)

tokenizer = DistilBertTokenizer.from_pretrained("distilbert-base-uncased")

def tokenize(example):
    return tokenizer(example["text"], truncation=True, padding="max_length", max_length=128)

dataset = dataset.map(tokenize)

dataset = dataset.train_test_split(test_size=0.1)

train_dataset = dataset["train"]
test_dataset = dataset["test"]

model = DistilBertForSequenceClassification.from_pretrained(
    "distilbert-base-uncased",
    num_labels=4
)

training_args = TrainingArguments(
    output_dir="./results",
    num_train_epochs=1,
    per_device_train_batch_size=16,
    logging_steps=50,
    save_steps=500,
    max_steps=1000
)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,  
    eval_dataset=test_dataset
)

print("Starting training...")

trainer.train()

print("Saving model...")

model.save_pretrained("saved_model")
tokenizer.save_pretrained("saved_model")

print("Training complete")