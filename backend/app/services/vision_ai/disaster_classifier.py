import torch
from torchvision import models, transforms
from PIL import Image
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent
LABELS_PATH = BASE_DIR / "imagenet_classes.txt"

model = models.resnet50(weights=models.ResNet50_Weights.DEFAULT)
model.eval()

preprocess = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
])

IMAGENET_CLASSES =  LABELS_PATH.read_text().splitlines()

def classify_disaster(image_path: str):
    img = Image.open(image_path).convert("RGB")
    tensor = preprocess(img).unsqueeze(0)

    with torch.no_grad():
        outputs = model(tensor)
        probs = torch.nn.functional.softmax(outputs[0], dim=0)

    top5 = probs.topk(5)
    results = [
        {"label": IMAGENET_CLASSES[i], "confidence": float(top5.values[j])}
        for j, i in enumerate(top5.indices)
    ]

    return {
        "predictions": results,
        "model": "resnet50-imagenet"
    }
