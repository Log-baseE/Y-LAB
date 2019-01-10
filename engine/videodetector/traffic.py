from .object import ObjectDetector
from .options import DetectorOptions
from .algorithms import TrafficAlgorithm
from typing import Tuple

import point_calculate
import cv2
import os
import json
import ffmpeg

class TrafficDetector(ObjectDetector):
    
    def _process_frame_result(self, result):
        result = super(TrafficDetector, self)._process_frame_result(result)
        result = self._algorithm.postprocess_result(result)
        return result

    @staticmethod
    def _draw_line(imgcv, line, color):
        cv2.line(imgcv, (int(line[0][0]), int(line[0][1])), (int(line[1][0]), int(line[1][1])), color, lineType=cv2.LINE_AA)
        return imgcv

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

        vertical = self._options.counting_line!='vertical'
        roi = self._options.roi
        if roi:
            botleft = (roi['bottomLeft']['x'], roi['bottomLeft']['y'])
            topleft = (roi['topLeft']['x'], roi['topLeft']['y'])
            topright = (roi['topRight']['x'], roi['topRight']['y'])
            botright = (roi['bottomRight']['x'], roi['bottomRight']['y'])
        else:
            topleft = (0, 0)
            botleft = (0, height)
            topright = (width, 0)
            botright = (width, height)

        if vertical:
            point_left = ((botleft[0]+topleft[0])/2, (botleft[1]+topleft[1])/2)
            point_right = ((botright[0]+topright[0])/2,
                           (botright[1]+topright[1])/2)
            count_line = (point_left, point_right)
        else:
            point_up = ((topleft[0]+topright[0])/2, (topleft[1]+topright[1])/2)
            point_down = ((topright[0]+botright[0])/2,
                          (botleft[1]+botright[1])/2)
            count_line = (point_up, point_down)
        
        print("COUNTER", count_line)
        cars = self._algorithm.count_cars(self._results, self._options.roi, count_line, vertical=vertical)
        add_lines = self._algorithm.get_additional_lines(roi=self._options.roi, vertical=vertical)
        self._cars = cars

        for idx, result in enumerate(self._results):
            ret, frame = cap.read()
            cv2.putText(
                img=frame,
                text='Detected Vehicles: %d' % cars[idx],
                org=(10, 35),
                fontFace=cv2.FONT_HERSHEY_SIMPLEX,
                fontScale=0.8,
                color=(0, 0xFF, 0xFF),
                thickness=2,
                lineType=cv2.LINE_AA

            )
            frame = self._draw_roi(frame, self._options.roi)
            frame = self._draw_line(frame, count_line, (0,255,0))
            frame = self._draw_bounding_box(frame, result)
            if add_lines:
                for line in add_lines:
                    frame = self._draw_line(frame, line, (0,0,255))
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
            "type": "traffic",
            "car_count": self._cars[-1]
        }

        with open(dest_path, 'w') as f:
            json.dump(ser, f)

    def detect(self, videopath: str, destination_directory: str, options: DetectorOptions, algorithm: TrafficAlgorithm) -> Tuple[str, str]:
        self._algorithm = algorithm
        options.filter = ['car', 'truck']
        super(TrafficDetector, self).detect(videopath, destination_directory, options)
        pass