print("PROGRAM_START")

print("LIB_START")

import point_calculate
import numpy as np
import pandas as pd
import math
import cv2
import asyncio
import multiprocessing
import tempfile
import shutil
import time
import os
import sys
import json

from concurrent.futures import ProcessPoolExecutor

print("LIB_END")
print("TF_START")

from darkflow.net.build import TFNet
from darkflow.defaults import argHandler

print("TF_END")

# suppress tensorflow warning
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

class ObjectDetect:
    # number of frames before old car coordinates is disposed (used for counting)
    time_threshold = 2
    # labels to be detected (if uninitialised, detect all objects)
    labels = None
    # video frame count
    frame_count = 0

    def __init__(self, detection_threshold, roi, count_switch, counting_line_vertical):
        self.detection_threshold = detection_threshold
        self.roi = roi
        self.count_switch = count_switch
        self.counting_line_vertical = counting_line_vertical
        self.make_temp_path()

    def __del__(self):
        shutil.rmtree(self.path)

    def init_options(self, model_dir, weights_dir, threshold, gpu):
        self.options = {
                "model": model_dir,
                "load": weights_dir,
                "threshold": threshold,
                "gpu": gpu
            }
        
        if os.path.exists("./built_graph") and os.path.isdir("./built_graph"):
            shutil.rmtree("./built_graph")
        self.init_model()

    def init_model(self):
        if(os.path.isfile("./built_graph/yolo.pb") & os.path.isfile("./built_graph/yolo.meta")):
            # if already saved, load from existing
            FLAGS = argHandler()
            FLAGS.setDefaults()
            FLAGS.pbLoad = "built_graph/yolo.pb"
            FLAGS.metaLoad = "built_graph/yolo.meta"
            self.tfnet = TFNet(FLAGS)
        else:
            self.tfnet = TFNet(self.options)
            self.tfnet.savepb()

    def init_roi(self, botleft, topleft, topright, botright):
        self.roi_pts = [botleft, topleft, topright, botright]

    def set_label(self, labels):
        self.labels = labels

    # get image with region of interest applied for further processing
    def get_roi(self, imgcv):
        roi_pts = self.roi_pts
        pts = np.array([roi_pts[0], roi_pts[1], roi_pts[2], roi_pts[3]] , np.int32)
        roi = pts.reshape((-1, 1, 2))
        cv2.polylines(imgcv, [roi], True, (0, 255, 255))

        mask = np.zeros_like(imgcv)
        cv2.drawContours(mask, [roi], -1, (255, 255, 255), -1, cv2.LINE_AA)
        masked = cv2.bitwise_and(imgcv, mask)
        return masked

    # draw region of interest for final result
    def draw_roi(self, imgcv, line):
        roi_pts = self.roi_pts
        pts = np.array([roi_pts[0], roi_pts[1], roi_pts[2], roi_pts[3]] , np.int32)
        cv2.polylines(imgcv, [pts], True, (0, 255, 255))
        cv2.line(imgcv, (int(line[0][0]), int(line[0][1])), (int(line[1][0]), int(line[1][1])), (0, 255, 0))
        return imgcv

    # yolo at work - return coordinates of objects per frame
    def process_frame(self, frame):
        print("FRAME_INDEX:" + str(self.frame_count))
        sys.stdout.flush()
        result = self.tfnet.return_predict(frame)
        print(result)
        self.frame_count += 1
        return result

    # remove overlapping bounding boxes according to detection_threshold
    def remove_overlap(self, img, coord):
        if(len(coord) > 1):
            pointB = coord[0]
            for item in coord[1:]:
                pointA = pointB
                pointB = item
                # detection threshold = batas selisih pixel yang dibutuhkan sehingga 2 box dianggap mendeteksi hal yang sama
                if(point_calculate.boxDistance(pointA[0], pointA[1], pointB[0], pointB[1]) < self.detection_threshold):
                    # remove box with lower confidence if distance between 2 boxes is less than threshold
                    if pointA[5] > pointB[5]:
                        coord.remove(pointB)
                        pointB = pointA
                    else:
                        coord.remove(pointA)
        return coord

    # draw bounding box and label
    def draw_bb(self, imgcv, coord):
        h, w, _ = imgcv.shape
        for coordinate in coord:
            cv2.rectangle(imgcv, (coordinate[0], coordinate[1]), (coordinate[2], coordinate[3]), 255, 3)
            cv2.putText(imgcv, coordinate[4], (coordinate[0], coordinate[1]-12), 0, 2e-3*h, 255, 1)

        return imgcv

    def car_count(self, img, coord, old_cars, count, line, is_vertical, frame_index):
        for oc in old_cars:
            if frame_index - oc[6] > self.time_threshold:
                old_cars.remove(oc)

        new_cars = []

        for nc in coord:
            # collision with counting line
            if point_calculate.collision(nc[0], nc[1], nc[2], nc[3], line, self.counting_line_vertical):
            # if point_calculate.collision_debug(nc[0], nc[1], nc[2], nc[3], line, self.counting_line_vertical, img, frame_index):
                new_cars.append(nc)

                unique_car = True
                for oc in old_cars:
                    # tl.x, tl.y, br.x, br.y
                    oc_point = ((oc[0] + oc[2])/2, (oc[1] + oc[3])/2)
                    nc_point = ((nc[0] + nc[2])/2, (nc[1] + nc[3])/2)

                    if self.counting_line_vertical:
                        car_size = oc[3] - oc[1]
                    else:
                        car_size = oc[2] - oc[0]

                    if point_calculate.boxDistance(oc_point[0], oc_point[1], nc_point[0], nc_point[1]) < (car_size//3 * (frame_index - oc[6])):
                        # consider same car
                        unique_car = False
                        old_cars.remove(oc)
                        break

                if unique_car:
                    count += 1
            
        return new_cars + old_cars, count

    def process_coords(self, img, result, frame_index):
        coord = []

        for bbox in result:
            left, top = bbox['topleft']['x'], bbox['topleft']['y']
            right, bot = bbox['bottomright']['x'], bbox['bottomright']['y']
            label = bbox['label']
            conf = bbox['confidence']

            if point_calculate.isNormalBlobSize(left, top, right, bot):
                if (self.labels is None) or (label in self.labels):
                    coord.append((left, top, right, bot, label, conf, frame_index))
            
        coord = self.remove_overlap(img, coord)

        return coord

    def get_frame(self, video_dir):
        cap = cv2.VideoCapture(video_dir)

        if(cap.isOpened()):
            ret, frame = cap.read()
        else:
            ret = False
        
        while ret:
            if(self.roi):
                yield self.get_roi(frame)
            else:
                yield frame
            ret, frame = cap.read()

        cap.release()

    async def video_detect(self, video_dir):
        roi_pts = self.roi_pts
        self.frame_count = 0

        cap = cv2.VideoCapture(video_dir)
        length = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        cap.release()
        self.frames = length
        print("FRAMES:" + str(length))

        # e = ProcessPoolExecutor(max_workers = 2)
        # coords = await asyncio.gather(*(self.loop.run_in_executor(e, self.process_frame, frame) for frame in self.get_frame(video_dir)))
        coords = [self.process_frame(frame) for frame in self.get_frame(video_dir)]
        
        cap = cv2.VideoCapture(video_dir)
        width = cap.get(cv2.CAP_PROP_FRAME_WIDTH)
        height = cap.get(cv2.CAP_PROP_FRAME_HEIGHT)
        fourcc = cv2.VideoWriter_fourcc(*'XVID')
        # result_dir = os.path.join(self.path, "out_video.avi")
        result_dir = "./temp_results/out_video.avi"
        out = cv2.VideoWriter(result_dir, fourcc, 30.0, (int(width), int(height)))

        print("Coords: " + str(len(coords)))
        
        cars = []
        count = 0
        resultsForJSON = []

        for i in range(length):
            ret, frame = cap.read()
            coord = self.process_coords(frame, coords[i], i)
            # append processed coordinate to json
            self.append_to_json(coord, resultsForJSON)

            # car count
            if self.count_switch:
                botleft, topleft, topright, botright = roi_pts[0], roi_pts[1], roi_pts[2], roi_pts[3]
                if self.counting_line_vertical:
                    point_left = ((botleft[0]+topleft[0])/2, (botleft[1]+topleft[1])/2)
                    point_right = ((botright[0]+topright[0])/2, (botright[1]+topright[1])/2)
                    count_line = (point_left, point_right)
                else:
                    point_up = ((topleft[0]+topright[0])/2, (topleft[1]+topright[1])/2)
                    point_down = ((topright[0]+botright[0])/2, (botleft[1]+botright[1])/2)
                    count_line = (point_up, point_down)
                cars, count = self.car_count(frame, coord, cars, count, count_line, self.counting_line_vertical, i)
                cv2.putText(
                    frame,
                    'Detected Vehicles: ' + str(count),
                    (10, 35),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.8,
                    (0, 0xFF, 0xFF),
                    2,
                    cv2.FONT_HERSHEY_SIMPLEX,
                )

            # write json to results dir
            self.write_to_json(resultsForJSON)
                
            # drawing roi and bounding box
            if(self.roi):
                frame = self.draw_roi(frame, count_line)
            frame = self.draw_bb(frame, coord)

            # write to video
            cv2.imwrite(os.path.join(self.path, "out_" + str(i) + ".jpg"), frame)
            # cv2.imwrite("./temp_results/out_" + str(i) + ".jpg", frame)
            out.write(frame)

        cap.release()
        
        # show result (comment later)
        # cap2 = cv2.VideoCapture(result_dir)
        # cv2.namedWindow("Result", cv2.WINDOW_AUTOSIZE)
        # while(cap2.isOpened()):
        #     ret, frame = cap2.read()
        #     if ret == True:
        #         cv2.imshow('Frame', frame)
        #         if cv2.waitKey(25) & 0xFF == ord('q'):
        #             break
        #     else: 
        #         break
        # cap2.release()
        # cv2.destroyAllWindows()

    async def image_detect(self, img_dir):
        img = cv2.imread(img_dir, cv2.IMREAD_COLOR)

        if(self.roi):
            proc_img = self.get_roi(img)
        else:
            proc_img = img

        coords = self.process_frame(proc_img)
        bbox = self.process_coords(img, coords, 0)
        img = self.draw_bb(img, bbox)
        
        # result_dir = os.path.join(self.path, "out_image.jpg")
        # cv2.imwrite(result_dir, img)
        cv2.imwrite("./temp_results/out_" + img_dir, img)

        # show result (comment later)
        # cv2.imshow('Result', img)
        # cv2.waitKey(0)
        # cv2.destroyAllWindows()

    def make_temp_path(self):
        # self.path = tempfile.TemporaryDirectory().name
        self.path = tempfile.mkdtemp()
        # open(self.path)
        print(self.path)

    def set_roi(self, roi_switch):
        self.roi = roi_switch

    def append_to_json(self, coord, resultsForJSON):
        for box in coord:
            left, top, right, bot, label, conf, frame_index = box[0], box[1], box[2], box[3], box[4], box[5], box[6]
            resultsForJSON.append({"label": label, "confidence": float('%.2f' % conf), "topleft": {"x": left, "y": top}, "bottomright": {"x": right, "y": bot}, "frame_index": frame_index})

    def write_to_json(self, data):
        # result_dir = os.path.join(self.path, "data.json")
        result_dir = "./temp_results/data.json"
        with open(result_dir, 'w') as outfile:
            json.dump(data, outfile)

if __name__ == '__main__':
    usage = "Usage: python main.py <video_path> <options_path> <model_dir> <weights_dir> <threshold> <gpu>"
    print(sys.argv)
    if len(sys.argv) != 7:
        print("Invalid arguments")
        print(usage)
        sys.exit(-1)
    videopath = sys.argv[1]

    optionspath = sys.argv[2]
    model_dir = sys.argv[3]
    weights_dir = sys.argv[4]
    threshold = sys.argv[5]
    gpu = sys.argv[6]

    # json values - model, load, threshold, gpu
    # with open(optionspath) as json_file:
    #     json_data = json.load(json_file)

    # model_dir = json_data["model"]
    # weights_dir = json_data["load"]
    # threshold = json_data["threshold"]
    # gpu = json_data["gpu"]

    start_time = time.time()

    # max number of pixels for gap between bounding box for boxes to be considered separate
    detection_threshold = 50
    # use region of interest in object detection
    roi = True
    # counting cars mode
    count_switch = True
    # counting line is drawn vertically or horizontally between roi
    counting_line_vertical = True

    print("MODEL_START")

    sys.stdout.flush()
    od = ObjectDetect(detection_threshold, roi, count_switch, counting_line_vertical)
    od.init_options(model_dir, weights_dir, threshold, gpu)
    sys.stdout.flush()

    # od.init_model()

    print("MODEL_END")
    sys.stdout.flush()
    # print("Model built in %s seconds ---" % (time.time() - start_time))
    # sys.stdout.flush()

    # botleft, topleft, topright, botright
    od.init_roi([0, 450], [270, 250], [1110, 350], [1280, 450])

    loop = asyncio.get_event_loop()

    # image detect
    # od.set_roi(False)
    # loop.run_until_complete(od.image_detect("pizza.jpg"))

    # video detect
    od.set_label(["car", "truck"])
    od.set_roi(True)

    print("DETECT_START")

    sys.stdout.flush()
    loop.run_until_complete(od.video_detect(videopath))

    print("DETECT_END")
    sys.stdout.flush()

    loop.close()

    print("--- %s seconds ---" % (time.time() - start_time))
    print("PROGRAM_END")
    sys.stdout.flush()