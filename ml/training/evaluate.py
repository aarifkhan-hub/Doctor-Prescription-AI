"""
Standalone evaluation script that reports CER + WER on a held-out manifest.

    python evaluate.py --checkpoint ./out/best --data ../datasets/test.csv --images ../datasets/images
"""
import argparse
import torch
from PIL import Image
import pandas as pd
from tqdm import tqdm
from transformers import TrOCRProcessor, VisionEncoderDecoderModel
from evaluate import load as load_metric


def parse_args():
    p = argparse.ArgumentParser()
    p.add_argument("--checkpoint", required=True)
    p.add_argument("--data", required=True)
    p.add_argument("--images", required=True)
    p.add_argument("--batch", type=int, default=8)
    return p.parse_args()


def main():
    args = parse_args()
    device = "cuda" if torch.cuda.is_available() else "cpu"
    processor = TrOCRProcessor.from_pretrained(args.checkpoint)
    model = VisionEncoderDecoderModel.from_pretrained(args.checkpoint).to(device)
    model.eval()

    df = pd.read_csv(args.data)
    preds, refs = [], []

    for i in tqdm(range(0, len(df), args.batch)):
        batch = df.iloc[i:i + args.batch]
        images = [Image.open(f"{args.images}/{p}").convert("RGB") for p in batch["image"]]
        inputs = processor(images=images, return_tensors="pt").to(device)
        with torch.no_grad():
            out = model.generate(**inputs, max_length=128, num_beams=4)
        preds.extend(processor.batch_decode(out, skip_special_tokens=True))
        refs.extend(batch["text"].tolist())

    cer = load_metric("cer").compute(predictions=preds, references=refs)
    wer = load_metric("wer").compute(predictions=preds, references=refs)
    print(f"CER: {cer:.4f}")
    print(f"WER: {wer:.4f}")


if __name__ == "__main__":
    main()
