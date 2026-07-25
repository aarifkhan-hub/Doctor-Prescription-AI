"""
Classical CV preprocessing pipeline to improve OCR of handwritten scripts:
  1. Grayscale
  2. CLAHE for local contrast
  3. Bilateral denoise
  4. Deskew via Hough / minAreaRect
  5. Adaptive threshold (optional binarisation)
  6. Resize to a max dimension
"""
import cv2
import numpy as np


MAX_DIM = 1600


def _deskew(gray: np.ndarray) -> np.ndarray:
    coords = np.column_stack(np.where(gray < 200))
    if coords.size < 500:
        return gray
    angle = cv2.minAreaRect(coords)[-1]
    if angle < -45:
        angle = -(90 + angle)
    else:
        angle = -angle
    if abs(angle) < 0.5:
        return gray
    h, w = gray.shape
    M = cv2.getRotationMatrix2D((w // 2, h // 2), angle, 1.0)
    return cv2.warpAffine(gray, M, (w, h), flags=cv2.INTER_CUBIC,
                          borderMode=cv2.BORDER_REPLICATE)


def preprocess(image_rgb: np.ndarray) -> np.ndarray:
    """Return a cleaned RGB image suitable for TrOCR."""
    if image_rgb.ndim == 2:
        gray = image_rgb
    else:
        gray = cv2.cvtColor(image_rgb, cv2.COLOR_RGB2GRAY)

    # 1. CLAHE
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    gray = clahe.apply(gray)

    # 2. Denoise
    gray = cv2.bilateralFilter(gray, d=7, sigmaColor=55, sigmaSpace=55)

    # 3. Deskew
    gray = _deskew(gray)

    # 4. Resize (aspect-preserving)
    h, w = gray.shape
    scale = MAX_DIM / max(h, w)
    if scale < 1.0:
        gray = cv2.resize(gray, (int(w * scale), int(h * scale)), interpolation=cv2.INTER_AREA)

    return cv2.cvtColor(gray, cv2.COLOR_GRAY2RGB)
