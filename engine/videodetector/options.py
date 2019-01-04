import typing
import json
import os

dir_path = os.path.dirname(os.path.realpath(__file__))

class DetectorOptionsException(Exception):
    pass

class DetectorOptions:

    DEFAULT_MODEL = os.path.join(dir_path, "cfg\\yolo.cfg")
    DEFAULT_LABELS = os.path.join(dir_path, "cfg\\coco.names")
    DEFAULT_WEIGHTS = os.path.join(dir_path, "bin\\yolo.weights")
    DEFAULT_THRESHOLD = 0.1
    DEFAULT_GPU = 0.7
    DEFAULT_COUNTING_LINE = "horizontal"

    def __init__(self):
        self.model = DetectorOptions.DEFAULT_MODEL
        self.weights = DetectorOptions.DEFAULT_WEIGHTS
        self.labels = DetectorOptions.DEFAULT_LABELS
        self.confidence_threshold = DetectorOptions.DEFAULT_THRESHOLD
        self.gpu = DetectorOptions.DEFAULT_GPU
        self.counting_line = DetectorOptions.DEFAULT_COUNTING_LINE
        self.tfnet = None
        self.roi = None
        self.filter = None

    def set_model(self, model: str):
        if self.tfnet:
            raise DetectorOptionsException("Neural network already built")
        self.model = model
        return self

    def set_weights(self, weights: str):
        if self.tfnet:
            raise DetectorOptionsException("Neural network already built")
        self.weights = weights
        return self

    def set_confidence_threshold(self, confidence_threshold: float):
        if self.tfnet:
            raise DetectorOptionsException("Neural network already built")
        if confidence_threshold < 0 or confidence_threshold > 1:
            raise ValueError(
                "'confidence_threshold' must be a floating point number between 0 and 1 inclusive")
        self.confidence_threshold = confidence_threshold
        return self

    def set_gpu(self, gpu: float):
        if self.tfnet:
            raise DetectorOptionsException("Neural network already built")
        if gpu < 0 or gpu > 1:
            raise ValueError(
                "'gpu' must be a floating point number between 0 and 1 inclusive")
        self.gpu = gpu
        return self

    def set_roi(self, roi: typing.Dict[str, typing.Dict[str, int]]):
        if self.tfnet:
            raise DetectorOptionsException("Neural network already built")
        self.roi = roi
        return self

    def set_counting_line(self, type: str):
        if self.tfnet:
            raise DetectorOptionsException("Neural network already built")
        if type not in ['vertical', 'horizontal']:
            raise ValueError(
                "'type' must be either 'vertical' or 'horizontal'")
        self.counting_line = type
        return self

    def set_filter(self, labels: typing.List[str]):
        if self.tfnet:
            raise DetectorOptionsException("Neural network already built")
        self.filter = labels
        return self

    def store_model(self, dir):
        pass

    def build_model(self, verbose_level=0):
        if verbose_level == 1:
            print("TF_START")
        elif verbose_level >= 2:
            print("Importing tensorflow...")
        
        from darkflow.net.build import TFNet
        from darkflow.defaults import argHandler

        if verbose_level == 1:
            print("TF_END")
        elif verbose_level >= 2:
            print("Tensorflow imported")

        options = {
            "model": self.model,
            "load": self.weights,
            "labels": self.labels,
            "threshold": self.confidence_threshold,
            "gpu": self.gpu,
        }

        old_options_path = os.path.join(dir_path, ".built_graph/options.json")
        old_pb_path = os.path.join(dir_path, ".built_graph/yolo.pb")
        old_meta_path = os.path.join(dir_path, ".built_graph/yolo.meta")
        
        if verbose_level == 1:
            print("MODEL_START")
        elif verbose_level >= 2:
            print("Building model...")
        
        old = False
        if os.path.isfile(old_pb_path) and os.path.isfile(old_meta_path) and os.path.isfile(old_options_path):
            with open(old_options_path) as f:
                old_options = json.load(old_options_path)
            if old_options == options:
                if verbose_level >= 2:
                    print("Loading model from identical model in storage")
                options = argHandler()
                options.setDefaults()
                options.pbLoad = old_pb_path
                options.metaLoad = old_meta_path
                old = True
        
        print(options)

        self.tfnet = TFNet(options)
        if not old:
            self.store_model(os.path.join(dir_path, ".built_graph"))

        if verbose_level == 1:
            print("MODEL_END")
        elif verbose_level >= 2:
            print("Model finished building")
        
        return self