import csv
import random

subjects = [
    "women", "girls", "female employees", "female leaders",
    "women in tech", "women in politics", "female drivers"
]

roles = [
    "leaders", "engineers", "scientists", "managers",
    "programmers", "politicians", "decision makers"
]

templates = [
    "{} should not be {}",
    "{} are not good {}",
    "{} are not suited to be {}",
    "{} cannot handle being {}",
    "{} should avoid becoming {}",
    "{} are not capable of being {}",
]

extra_phrases = [
    "in serious jobs",
    "in leadership roles",
    "in technical fields",
    "in demanding environments",
    "in high pressure careers"
]

rows = []

for _ in range(500):

    subject = random.choice(subjects)
    role = random.choice(roles)
    template = random.choice(templates)

    sentence = template.format(subject, role)

    if random.random() > 0.5:
        sentence += " " + random.choice(extra_phrases)

    rows.append([sentence, 3])

with open("sexist_dataset.csv", "w", newline="", encoding="utf-8") as f:

    writer = csv.writer(f)
    writer.writerow(["text", "label"])

    for r in rows:
        writer.writerow(r)

print("Generated 500 sexist training examples.")