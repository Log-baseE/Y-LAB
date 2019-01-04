from .options import DetectorOptions
from typing import Tuple

import asyncio
import cv2
import numpy as np
import os
import json
import ffmpeg

class ObjectDetector:
    def __init__(self, verbose_level=0):
        self.verbose_level = verbose_level

    @staticmethod
    def _mask_roi(imgcv, roi):
        bottom_left = (roi['bottomLeft']['x'], roi['bottomLeft']['y'])
        top_left = (roi['topLeft']['x'], roi['topLeft']['y'])
        top_right = (roi['topRight']['x'], roi['topRight']['y'])
        bottom_right = (roi['bottomRight']['x'], roi['bottomRight']['y'])

        pts = np.array(
            [bottom_left, top_left, top_right, bottom_right], np.int32)
        roi = pts.reshape((-1, 1, 2))
        cv2.polylines(img=imgcv, pts=[roi], isClosed=True, color=(0, 255, 255))

        mask = np.zeros_like(imgcv)
        cv2.drawContours( \
            image=mask, \
            contours=[roi], \
            contourIdx=-1, \
            color=(255, 255, 255), \
            thickness=-1, \
            lineType=cv2.LINE_AA \
        )
        masked = cv2.bitwise_and(imgcv, mask)
        return masked

    @staticmethod
    def _generate_frames(videopath, roi=None):
        cap = cv2.VideoCapture(videopath)
        if cap.isOpened():
            ret, frame = cap.read()
        else:
            ret = False
        while ret:
            yield ObjectDetector._mask_roi(frame, roi) if roi else frame
            ret, frame = cap.read()

        cap.release()

    @staticmethod
    def _count_frames(videopath):
        cap = cv2.VideoCapture(videopath)
        length = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        cap.release()
        return length

    @staticmethod
    def _draw_roi(imgcv, roi):
        bottom_left = (roi['bottomLeft']['x'], roi['bottomLeft']['y'])
        top_left = (roi['topLeft']['x'], roi['topLeft']['y'])
        top_right = (roi['topRight']['x'], roi['topRight']['y'])
        bottom_right = (roi['bottomRight']['x'], roi['bottomRight']['y'])

        pts = np.array(
            [bottom_left, top_left, top_right, bottom_right], np.int32)
        roi = pts.reshape((-1, 1, 2))
        cv2.polylines(img=imgcv, pts=[roi], isClosed=True, color=(0, 255, 255))

        return imgcv

    @staticmethod
    def _draw_bounding_box(imgcv, results):
        h, w, _ = imgcv.shape
        for result in results:
            left, top = result['topleft']['x'], result['topleft']['y']
            right, bottom = result['bottomright']['x'], result['bottomright']['y']
            label = result['label']
            cv2.rectangle(img=imgcv, pt1=(left, top), pt2=(
                right, bottom), color=255, thickness=3)
            cv2.putText(img=imgcv, text=label, org=(left, top-12),
                        fontFace=0, fontScale=2e-3*h, color=255, thickness=1)

        return imgcv

    def _process_frame_result(self, result):
        coords = []

        for bbox in result:
            label = bbox['label']
            if not self._options.filter or label in self._options.filter:
                coords.append(bbox)

        return coords

    def _process_frame(self, frame):
        if self.verbose_level == 1:
            print("FRAME_INDEX:%d" % self._frame_count)
        elif self.verbose_level >= 2:
            print("Processing frame (%d)" % self._frame_count)
        result = self._options.tfnet.return_predict(frame)
        self._frame_count += 1
        return result

    def _write_to_video(self, src_vid, dest_path):
        cap = cv2.VideoCapture(src_vid)
        width = cap.get(cv2.CAP_PROP_FRAME_WIDTH)
        height = cap.get(cv2.CAP_PROP_FRAME_HEIGHT)
        fourcc = cv2.VideoWriter_fourcc(*'XVID')

        dirname = os.path.dirname(dest_path)
        temp_path = os.path.join(dirname, "_temp.avi")

        out = cv2.VideoWriter(temp_path, fourcc, 30.0,
                              (int(cap.get(3)), int(cap.get(4))))

        if self.verbose_level == 1:
            print("WRITE_START")
        elif self.verbose_level >= 2:
            print("Rendering video...")

        ret = True
        for result in self._results:
            ret, frame = cap.read()
            if self._options.roi:
                frame = self._draw_roi(frame, self._options.roi)
            frame = self._draw_bounding_box(frame, result)
            out.write(frame)

        cap.release()
        out.release()

        stream = ffmpeg.input(temp_path)
        stream = ffmpeg.output(stream, dest_path)
        stream = ffmpeg.overwrite_output(stream)
        ffmpeg.run(stream)

        os.remove(temp_path)

        if self.verbose_level == 1:
            print("WRITE_END")
        elif self.verbose_level >= 2:
            print("Video finished rendering")

    def _postprocess_results(self):
        temp_results = [self._process_frame_result(frame_result) for frame_result in self._results]
        return temp_results

    def _write_to_json(self, dest_path):
        labels = set()
        total_objects = 0
        serializable_frames = []
        for result in self._results:
            total_objects += len(result)
            temp_result = []
            for box in result:
                left, top = box['topleft']['x'], box['topleft']['y']
                right, bottom = box['bottomright']['x'], box['bottomright']['y']
                label = box['label']
                conf = box['confidence']
                labels.add(label)
                temp_result.append({
                    "label": label,
                    "confidence": float('%.2f' % conf),
                    "topleft": {"x" : left, "y": top},
                    "bottomright": {"x" : right, "y": bottom}
                })

            serializable_frames.append(temp_result)
        
        ser = {
            "objects": list(labels),
            "frames": serializable_frames,
            "count_per_frame": float('%.2f' % (total_objects / self._frame_count)),
            "type": "default"
        }

        with open(dest_path, 'w') as f:
            json.dump(ser, f)

    async def _video_detect(self, videopath, dest_dir):
        num_frames = self._count_frames(videopath)
        self._frame_count = 0

        if self.verbose_level == 1:
            print("FRAMES:%d" % num_frames)
        elif self.verbose_level >= 2:
            print("Frames to be processed: %d frame(s)" % num_frames)
        self.num_frames = num_frames

        self._results = [self._process_frame(frame) for frame in self._generate_frames(
            videopath, self._options.roi)]

        self._results = self._postprocess_results()

        vid_path = os.path.join(dest_dir, "out_video.mp4")
        data_path = os.path.join(dest_dir, "data.json")

        self._write_to_video(src_vid=videopath, dest_path=vid_path)
        self._write_to_json(dest_path=data_path)

    def detect(self, videopath: str, destination_directory: str, options: DetectorOptions) -> Tuple[str, str]:
        self._options = options

        if self.verbose_level == 1:
            print("DETECT_START")
        elif self.verbose_level >= 2:
            print("Starting detection...")

        loop = asyncio.get_event_loop()
        loop.run_until_complete(self._video_detect(
            videopath, destination_directory))
        loop.close()

        if self.verbose_level == 1:
            print("DETECT_END")
        elif self.verbose_level >= 2:
            print("Detection finished")

        # return (self.result_path)
