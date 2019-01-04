from .options import DetectorOptions
from typing import Tuple, Callable

class TrafficDetector:
    def __init__(self, verbose_level=0):
        self.verbose_level = verbose_level

    def detect(self, videopath: str, options: DetectorOptions, algorithm: Callable) -> Tuple[str, str]:
        pass