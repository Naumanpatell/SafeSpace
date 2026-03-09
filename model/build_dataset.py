import pandas as pd

print("Loading dataset...")

url = "https://raw.githubusercontent.com/t-davidson/hate-speech-and-offensive-language/master/data/labeled_data.csv"

df = pd.read_csv(url)

print("Dataset loaded:", len(df))


def convert_label(row):
    if row["class"] == 2:
        return 0   # safe
    elif row["class"] == 1:
        return 1   # toxic
    elif row["class"] == 0:
        return 2   # racist / hate speech
    else:
        return 0


dataset = pd.DataFrame()

dataset["text"] = df["tweet"]
dataset["label"] = df.apply(convert_label, axis=1)

print("Processing dataset...")

# Add some manual sexist examples
sexist_examples = [
    "Women belong in the kitchen",
    "Women are bad drivers",
    "Girls are too emotional to lead",
    "A woman's place is at home"
]

sexist_df = pd.DataFrame({
    "text": sexist_examples,
    "label": [3]*len(sexist_examples)
})

dataset = pd.concat([dataset, sexist_df])

dataset = dataset.dropna()

print("Saving dataset...")

dataset.to_csv("dataset.csv", index=False)

print("Dataset saved:", len(dataset))
print("Labels:")
print("0 = safe")
print("1 = toxic")
print("2 = racist")
print("3 = sexist")