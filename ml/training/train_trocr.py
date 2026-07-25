"""
Fine-tune TrOCR on a prescription-handwriting dataset.

Example:
    python train_trocr.py \
        --train ../datasets/train.csv \
        --val   ../datasets/val.csv \
        --images ../datasets/images \
        --epochs 8 --batch 4
"""
import argparse
import os
from pathlib import Path

import torch
from transformers import (
    TrOCRProcessor,
    VisionEncoderDecoderModel,
    Seq2SeqTrainer,
    Seq2SeqTrainingArguments,
    default_data_collator,
)
from evaluate import load as load_metric

from config import TrainConfig
from dataset import PrescriptionOCRDataset
from preprocess import build_augmenter


def parse_args():
    p = argparse.ArgumentParser()
    p.add_argument("--train", required=True)
    p.add_argument("--val", required=True)
    p.add_argument("--images", required=True)
    p.add_argument("--out", default="./out")
    p.add_argument("--base", default="microsoft/trocr-base-handwritten")
    p.add_argument("--epochs", type=int, default=8)
    p.add_argument("--batch", type=int, default=4)
    p.add_argument("--lr", type=float, default=5e-5)
    return p.parse_args()


def main():
    args = parse_args()
    cfg = TrainConfig(
        manifest_train=args.train,
        manifest_val=args.val,
        image_root=args.images,
        output_dir=args.out,
        base_model=args.base,
        epochs=args.epochs,
        batch_size=args.batch,
        lr=args.lr,
    )
    Path(cfg.output_dir).mkdir(parents=True, exist_ok=True)

    processor = TrOCRProcessor.from_pretrained(cfg.base_model)
    model = VisionEncoderDecoderModel.from_pretrained(cfg.base_model)

    # Special token config for generation
    model.config.decoder_start_token_id = processor.tokenizer.cls_token_id
    model.config.pad_token_id = processor.tokenizer.pad_token_id
    model.config.vocab_size = model.config.decoder.vocab_size
    model.config.eos_token_id = processor.tokenizer.sep_token_id
    model.config.max_length = cfg.max_target_length
    model.config.early_stopping = True
    model.config.no_repeat_ngram_size = 3
    model.config.length_penalty = 2.0
    model.config.num_beams = 4

    augmenter = build_augmenter()
    train_ds = PrescriptionOCRDataset(cfg.manifest_train, cfg.image_root, processor, augment=augmenter,
                                     max_target_length=cfg.max_target_length)
    val_ds = PrescriptionOCRDataset(cfg.manifest_val, cfg.image_root, processor,
                                    max_target_length=cfg.max_target_length)

    cer_metric = load_metric("cer")
    wer_metric = load_metric("wer")

    def compute_metrics(pred):
        labels_ids = pred.label_ids
        pred_ids = pred.predictions
        labels_ids[labels_ids == -100] = processor.tokenizer.pad_token_id

        pred_str = processor.batch_decode(pred_ids, skip_special_tokens=True)
        label_str = processor.batch_decode(labels_ids, skip_special_tokens=True)

        cer = cer_metric.compute(predictions=pred_str, references=label_str)
        wer = wer_metric.compute(predictions=pred_str, references=label_str)
        return {"cer": cer, "wer": wer}

    training_args = Seq2SeqTrainingArguments(
        output_dir=cfg.output_dir,
        num_train_epochs=cfg.epochs,
        per_device_train_batch_size=cfg.batch_size,
        per_device_eval_batch_size=cfg.batch_size,
        gradient_accumulation_steps=cfg.grad_accum_steps,
        learning_rate=cfg.lr,
        weight_decay=cfg.weight_decay,
        warmup_ratio=cfg.warmup_ratio,
        fp16=cfg.fp16 and torch.cuda.is_available(),
        eval_strategy="steps",
        eval_steps=cfg.eval_steps,
        save_strategy="steps",
        save_steps=cfg.save_steps,
        logging_steps=cfg.logging_steps,
        save_total_limit=2,
        predict_with_generate=True,
        generation_max_length=cfg.max_target_length,
        metric_for_best_model="cer",
        greater_is_better=False,
        load_best_model_at_end=True,
        report_to=["none"],
        seed=cfg.seed,
        dataloader_num_workers=cfg.num_workers,
    )

    trainer = Seq2SeqTrainer(
        model=model,
        args=training_args,
        train_dataset=train_ds,
        eval_dataset=val_ds,
        data_collator=default_data_collator,
        tokenizer=processor.feature_extractor,
        compute_metrics=compute_metrics,
    )

    trainer.train()

    best_dir = os.path.join(cfg.output_dir, "best")
    trainer.save_model(best_dir)
    processor.save_pretrained(best_dir)
    print(f"✅ Model saved to {best_dir}")


if __name__ == "__main__":
    main()
