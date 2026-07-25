"""
Albumentations-based augmentation for prescription images.
Kept mild to preserve legibility.
"""
import numpy as np
from PIL import Image
import albumentations as A


def build_augmenter():
    transform = A.Compose([
        A.OneOf([
            A.MotionBlur(blur_limit=3, p=0.3),
            A.GaussianBlur(blur_limit=3, p=0.3),
            A.MedianBlur(blur_limit=3, p=0.3),
        ], p=0.3),
        A.RandomBrightnessContrast(brightness_limit=0.15, contrast_limit=0.15, p=0.5),
        A.CLAHE(clip_limit=2.0, p=0.3),
        A.ShiftScaleRotate(shift_limit=0.02, scale_limit=0.05, rotate_limit=3, p=0.4, border_mode=0, value=(255, 255, 255)),
        A.ImageCompression(quality_lower=75, quality_upper=95, p=0.3),
    ])

    def apply(pil_image: Image.Image) -> Image.Image:
        arr = np.array(pil_image)
        out = transform(image=arr)["image"]
        return Image.fromarray(out)

    return apply
