# ML Pipeline

Complete PyTorch pipeline to fine-tune TrOCR on medical handwriting.

## Contents

```
ml/
├── training/
│   ├── config.py              # hyperparameters
│   ├── dataset.py             # HF Dataset wrapper
│   ├── preprocess.py          # image augmentations
│   ├── train_trocr.py         # main training loop
│   ├── evaluate.py            # CER / WER metrics
│   ├── push_to_hub.py         # upload to HuggingFace
│   └── requirements.txt
├── notebooks/
│   └── kaggle_trocr_finetune.ipynb   # end-to-end Kaggle notebook
├── datasets/
│   └── manifest_example.csv   # image,text pairs
└── evaluation/
    └── report_template.md
```

## Quick start (local GPU)

```bash
cd ml/training
pip install -r requirements.txt
python train_trocr.py --data ../datasets/manifest.csv --epochs 5 --batch 4
python evaluate.py --checkpoint ./out/best --data ../datasets/val.csv
python push_to_hub.py --checkpoint ./out/best --repo your-org/trocr-prescription-v1
```

## Recommended datasets

| Dataset                     | Purpose                    |
|-----------------------------|----------------------------|
| IAM Handwriting             | General handwriting warm-up|
| Doctor's Handwritten Prescription BD | Domain fine-tuning         |
| Synthetic (TextRecognitionDataGenerator + drug names) | Augmentation |

## Metrics tracked

- CER (Character Error Rate)
- WER (Word Error Rate)
- Medicine-level F1 after NER
