logs = []

def save_log(text, prediction):

    logs.append({
        "text": text,
        "prediction": prediction
    })