"""
Push a fine-tuned checkpoint to the HuggingFace Hub.

    python push_to_hub.py --checkpoint ./out/best --repo your-org/trocr-prescription-v1
"""
import argparse
import os
from huggingface_hub import HfApi, login
from transformers import TrOCRProcessor, VisionEncoderDecoderModel


def parse_args():
    p = argparse.ArgumentParser()
    p.add_argument("--checkpoint", required=True)
    p.add_argument("--repo", required=True, help="e.g. your-org/trocr-prescription-v1")
    p.add_argument("--private", action="store_true")
    return p.parse_args()


def main():
    args = parse_args()
    token = os.getenv("HF_TOKEN")
    if not token:
        raise SystemExit("Please set HF_TOKEN env var")
    login(token=token)

    api = HfApi()
    api.create_repo(args.repo, private=args.private, exist_ok=True)

    processor = TrOCRProcessor.from_pretrained(args.checkpoint)
    model = VisionEncoderDecoderModel.from_pretrained(args.checkpoint)
    model.push_to_hub(args.repo, token=token)
    processor.push_to_hub(args.repo, token=token)
    print(f"✅ Pushed to https://huggingface.co/{args.repo}")


if __name__ == "__main__":
    main()
