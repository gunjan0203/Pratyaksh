import os
from uuid import uuid4
from fastapi import UploadFile
from app.core.config import settings

async def save_upload(file: UploadFile) -> str:
    ext = os.path.splitext(file.filename)[1]
    filename = f"{uuid4().hex}{ext}"
    file_path = os.path.join(settings.UPLOAD_DIR, filename)

    contents = await file.read()
    if len(contents) > settings.MAX_UPLOAD_SIZE:
        raise ValueError("File too large")

    with open(file_path, "wb") as f:
        f.write(contents)

    return file_path
