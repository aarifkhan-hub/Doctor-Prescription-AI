"""
Central configuration for TrOCR fine-tuning.
"""
from dataclasses import dataclass, field
from typing import Tuple


@dataclass
class TrainConfig:
    # Data
    manifest_train: str = "../datasets/train.csv"
    manifest_val: str = "../datasets/val.csv"
    image_root: str = "../datasets/images"

    # Model
    base_model: str = "microsoft/trocr-base-handwritten"

    # Training
    epochs: int = 8
    batch_size: int = 4
    grad_accum_steps: int = 4
    lr: float = 5e-5
    weight_decay: float = 0.01
    warmup_ratio: float = 0.1
    max_target_length: int = 128

    # Preprocessing
    image_size: Tuple[int, int] = (384, 384)

    # I/O
    output_dir: str = "./out"
    logging_steps: int = 50
    eval_steps: int = 500
    save_steps: int = 500
    seed: int = 42

    # Hardware
    fp16: bool = True
    num_workers: int = 4

    def __post_init__(self):
        pass
