"""
Custom PyTorch Dataset for a manifest CSV of (image_path, text) pairs.
"""
import os
from pathlib import Path
from typing import Callable, Optional

import pandas as pd
from PIL import Image
from torch.utils.data import Dataset


class PrescriptionOCRDataset(Dataset):
    def __init__(
        self,
        manifest_csv: str,
        image_root: str,
        processor,
        augment: Optional[Callable] = None,
        max_target_length: int = 128,
    ):
        self.df = pd.read_csv(manifest_csv)
        self.image_root = Path(image_root)
        self.processor = processor
        self.augment = augment
        self.max_target_length = max_target_length

        required = {"image", "text"}
        if not required.issubset(self.df.columns):
            raise ValueError(f"Manifest must contain columns: {required}")

    def __len__(self) -> int:
        return len(self.df)

    def __getitem__(self, idx: int):
        row = self.df.iloc[idx]
        img_path = self.image_root / row["image"]
        image = Image.open(img_path).convert("RGB")

        if self.augment is not None:
            image = self.augment(image)

        pixel_values = self.processor(images=image, return_tensors="pt").pixel_values.squeeze(0)

        labels = self.processor.tokenizer(
            row["text"],
            padding="max_length",
            max_length=self.max_target_length,
            truncation=True,
            return_tensors="pt",
        ).input_ids.squeeze(0)

        # Replace pad tokens with -100 so they are ignored by CE loss
        labels[labels == self.processor.tokenizer.pad_token_id] = -100

        return {"pixel_values": pixel_values, "labels": labels}
