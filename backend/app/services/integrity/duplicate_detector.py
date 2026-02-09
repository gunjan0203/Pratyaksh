from PIL import Image
import imagehash

HASH_DB = set()

def compute_hash(file_path: str) -> str:
    image = Image.open(file_path)
    return str(imagehash.phash(image))

def is_duplicate(file_path: str) -> bool:
    img_hash = compute_hash(file_path)
    duplicate = img_hash in HASH_DB
    HASH_DB.add(img_hash)
    return bool(duplicate)
