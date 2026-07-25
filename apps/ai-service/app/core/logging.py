import sys
from loguru import logger


def setup_logging(level: str = "INFO") -> None:
    logger.remove()
    logger.add(
        sys.stdout,
        level=level,
        serialize=False,
        format="<green>{time:HH:mm:ss}</green> | <level>{level:<8}</level> | "
               "{extra[request_id]} | {message}",
        enqueue=False,
    )
    logger.configure(extra={"request_id": "-"})
