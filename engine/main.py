# from objectdetect import ObjectDetect
import os
import sys
import json
import traceback
import argparse
import time

from videodetector.options import DetectorOptions
from videodetector.object import ObjectDetector
from videodetector.traffic import TrafficDetector
from videodetector.algorithms import Madeleine
from videodetector.algorithms import Andrew


def main(args):
    verbose_level = args.verbose or 0
    invoker_path = os.getcwd()
    target_dir = os.path.join(invoker_path, ".ylab")
    if not os.path.exists(target_dir) or not os.path.isdir(target_dir):
        os.mkdir(target_dir)
    
    if verbose_level < 3:
        os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

    """
    Load default parameters:
    - DEFAULT_MODEL: path to YOLO's .cfg file
    - DEFAULT_WEIGHTS: path to YOLO's .weights file
    - DEFAULT_THRESHOLD: confidence threshold, floating point number between 0 and 1 inclusive
    - DEFAULT_GPU: gpu usage percentage, floating point number between 0 and 1 inclusive
    - DEFAULT_PIXEL_THRESHOLD
    - DEFAULT_TIME_THRESHOLD
    """
    dir_path = os.path.dirname(os.path.realpath(__file__))
    with open(os.path.join(dir_path, 'defaults.json')) as f:
        defaults = json.load(f)

    try:
        DEFAULT_MODEL = defaults["DEFAULT_MODEL"]
        DEFAULT_WEIGHTS = defaults["DEFAULT_WEIGHTS"]
        DEFAULT_THRESHOLD = defaults["DEFAULT_THRESHOLD"]
        DEFAULT_GPU = defaults["DEFAULT_GPU"]
        DEFAULT_PIXEL_THRESHOLD = defaults["DEFAULT_PIXEL_THRESHOLD"]
        DEFAULT_TIME_THRESHOLD = defaults["DEFAULT_TIME_THRESHOLD"]
    except KeyError as e:
        sys.exit("Malformed default json file: missing key '%s'" % e.args[0])

    """Decode given json data"""
    try:
        if args.file:
            with open(args.file, 'r') as f:
                data = json.load(f)
        if args.json:
            data = json.loads(args.json)
    except json.decoder.JSONDecodeError:
        sys.exit("Unable to parse JSON data")

    """
    OPTIONS
    > Required
    - filePath
    > Optional
    - traffic (boolean)
    - algorithm (required if traffic = True)
    - roi
    - model
    - weights
    - filter
    - gpu
    - confidenceThreshold
    - pixelThreshold
    - timeThreshold
    - lanes (required if algorithm == "madeleine")
        - count
        - shoulderSize
        - perspectiveScaling
    """

    if verbose_level == 1:
        print("PROGRAM_START")

    try:
        videopath = data["filePath"]
    except KeyError as e:
        sys.exit("Missing required parameters: '%s'" % e.args[0])

    start_time = time.time()

    """Fetch data into variables"""
    model = data.get("model", DEFAULT_MODEL)
    weights = data.get("weights", DEFAULT_WEIGHTS)
    confidence_threshold = data.get("confidenceThreshold", DEFAULT_THRESHOLD)
    gpu = data.get("gpu", DEFAULT_GPU)
    pixel_threshold = data.get("pixelThreshold", DEFAULT_PIXEL_THRESHOLD)
    time_threshold = data.get("timeThreshold", DEFAULT_TIME_THRESHOLD)
    roi = data.get("roi", None)
    label_filter = data.get("filter", None)
    traffic = data.get("traffic", False)

    """Initialize options"""
    options = DetectorOptions()
    options \
        .set_model(model) \
        .set_weights(weights) \
        .set_gpu(gpu) \
        .set_confidence_threshold(confidence_threshold)

    if roi:
        options.set_roi(roi)
    if label_filter:
        options.set_filter(label_filter)

    """Build model from set options"""
    options = options.build_model(verbose_level=verbose_level)

    """Start detection"""
    if traffic:
        detector = TrafficDetector(verbose_level=verbose_level)
        
        try:
            algorithm = data["algorithm"]
        except KeyError as e:
            sys.exit("Missing required parameters: '%s'" % e.args[0])
        
        if algorithm == "madeleine":
            results = detector.detect(
                videopath,
                destination_directory=target_dir,
                options=options,
                algorithm=Madeleine(
                    pixel_threshold=pixel_threshold, 
                    time_threshold=time_threshold,
                    normal_size=300
                )
            )
        elif algorithm == "andrew":
            try:
                lanes = data["lanes"]
            except KeyError as e:
                sys.exit("Required 'lanes' data not given")
            results = detector.detect(
                videopath,
                destination_directory=target_dir,
                options=options,
                algorithm=Andrew(
                    pixel_threshold=pixel_threshold, 
                    time_threshold=time_threshold,
                    normal_size=300,
                    lanes=lanes,
                )
            )
        else:
            raise ValueError("'algorithm' can only be either 'madeleine' or 'andrew'")
    else:
        detector = ObjectDetector(verbose_level=verbose_level)
        results = detector.detect(videopath, destination_directory=target_dir, options=options)

    print("--- Finished in %s seconds ---" % (time.time() - start_time))
    if verbose_level == 1:
        print("PROGRAM_END")


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Detect objects from video')
    g = parser.add_mutually_exclusive_group(required=True)
    g.add_argument(
        '--file', '-f', help='load options from json file', type=str)
    g.add_argument(
        '--json', '-j', help='load options from json string', type=str)
    parser.add_argument('--verbose', '-v',
                        help='set verbosity level', action='count')
    args = parser.parse_args()

    main(args)
