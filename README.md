# SafeSpace

AI moderation for Outlook, built at a hackathon (2026).

SafeSpace checks messages in Outlook with a machine learning model before they cause harm.
We reverse engineered Outlook's web frontend to hook the moderation into it, fine-tuned a
DistilBERT model to classify messages, and served the model from a FastAPI backend.
