from darkflow.net.build import TFNet
from darkflow.defaults import argHandler
from concurrent.futures import ProcessPoolExecutor
import point_calculate
import numpy as np
import pandas as pd
import math
import cv2
import asyncio
import multiprocessing
# import tempfile
# import shutil
import time
import os

# suppress tensorflow warning
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

# coords = []

# CONSTANTS
DETECTION_THRESHOLD = 10

# region of interest points
pts = np.array([[0, 720], [0, 450], [270, 250], [1110, 250], [1280, 370], [1280, 720]], np.int32)

class Task(object):
    _video_detect = 0
    _image_detect = 1
    _car_count = 2

options = {
    "model": "cfg/yolo.cfg",
    "load": "bin/yolo.weights",
    "threshold": 0.5,
    "gpu": 0.0
}

# tfnet model
if(os.path.isfile("built_graph/yolo.pb") & os.path.isfile("built_graph/yolo.meta")):
    # if already saved, load from existing
    FLAGS = argHandler()
    FLAGS.setDefaults()
    FLAGS.pbLoad = "built_graph/yolo.pb"
    FLAGS.metaLoad = "built_graph/yolo.meta"
    tfnet = TFNet(FLAGS)
else:
    tfnet = TFNet(options)
    tfnet.savepb()

# darkflow model options
def init_options(model_dir, weights_dir, threshold, gpu):
    options.model = model_dir
    options.load = weights_dir
    options.threshold = threshold
    options.gpu = gpu

# get image with region of interest applied for further processing
def get_roi(imgcv):
    global pts
    pts = pts.reshape((-1, 1, 2))
    cv2.polylines(imgcv, [pts], True, (0, 255, 255))

    mask = np.zeros_like(imgcv)
    cv2.drawContours(mask, [pts], -1, (255, 255, 255), -1, cv2.LINE_AA)
    masked = cv2.bitwise_and(imgcv, mask)
    return masked

# draw region of interest for final result
def draw_roi(imgcv):
    global pts
    cv2.polylines(imgcv, [pts], True, (0, 255, 255))
    # cv2.line(imgcv, (0, 385), (1280, 385), (0, 255, 0))
    return imgcv

# yolo at work - return coordinates of objects per frame
def process_frame(frame):
    global tfnet
    result = tfnet.return_predict(frame)
    # frame_count.value += 1
    # print(frame_count.value)
    # print(result)
    return result

# remove overlapping bounding boxes according to DETECTION_THRESHOLD
def remove_overlap(img, coord):
    if(len(coord) > 1):
        pointB = coord[0]
        for item in coord[1:]:
            pointA = pointB
            pointB = item
            # detection threshold = batas selisih pixel yang dibutuhkan sehingga 2 box dianggap mendeteksi hal yang sama
            if(point_calculate.boxDistance(pointA[0], pointA[1], pointB[0], pointB[1]) < DETECTION_THRESHOLD):
                # remove 1 box if distance between 2 boxes is less than threshold
                coord.remove(item)
    
    return coord

# draw bounding box and label
def draw_bb(imgcv, coord):
    h, w, _ = imgcv.shape
    for coordinate in coord:
        cv2.rectangle(imgcv, (coordinate[0], coordinate[1]), (coordinate[2], coordinate[3]), 255, 3)
        cv2.putText(imgcv, coordinate[4], (coordinate[0], coordinate[1]-12), 0, 2e-3*h, 255, 1)

    return imgcv

def process_coords(img, result):
    coord = []

    for bbox in result:
        left, top = bbox['topleft']['x'], bbox['topleft']['y']
        right, bot = bbox['bottomright']['x'], bbox['bottomright']['y']
        label = bbox['label']

        if point_calculate.isNormalBlobSize(left, top, right, bot):
            coord.append((left, top, right, bot, label))
        
    coord = remove_overlap(img, coord)
    final_img = draw_bb(draw_roi(img), coord)

    # img = cv2.rectangle(img, tl, br, (0, 255, 0), 7)
    # img = cv2.putText(img, label, tl, cv2.FONT_HERSHEY_COMPLEX, 1, (0, 0, 0), 2)
    
    return final_img

def get_frame(video_dir):
    cap = cv2.VideoCapture(video_dir)

    if(cap.isOpened()):
        ret, frame = cap.read()
    else:
        ret = False
    
    while ret:
        yield get_roi(frame)
        ret, frame = cap.read()

    cap.release()

async def video_detect(video_dir, loop):
    # frame_count.value = 0
    e = ProcessPoolExecutor(max_workers = 3)

    coords = await asyncio.gather(*(loop.run_in_executor(e, process_frame, frame) for frame in get_frame(video_dir)))
    
    cap = cv2.VideoCapture(video_dir)
    width = cap.get(cv2.CAP_PROP_FRAME_WIDTH)
    height = cap.get(cv2.CAP_PROP_FRAME_HEIGHT)
    fourcc = cv2.VideoWriter_fourcc(*'XVID')
    out = cv2.VideoWriter("./temp_results/out_video.avi", fourcc, 30.0, (int(width), int(height)))

    length = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    # print("Coords: " + str(len(coords)))
    # print("Frames: " + str(length))

    for i in range(length):
        ret, frame = cap.read()
        out.write(process_coords(frame, coords[i]))

    cap.release()

async def image_detect(img_dir):
    img = cv2.imread(img_dir, cv2.IMREAD_COLOR)
    coords = await process_frame(img)
    final_img = process_coords(img, coords)
    cv2.imwrite("./temp_results/out_" + img_dir, final_img)

# def add_task(file, task, loop):
#     if(task == Task._video_detect):
#         tasks.append(asyncio.ensure_future(video_detect(file, loop)))
#     return

if __name__ == '__main__':
    start_time = time.time()

    # m = multiprocessing.Manager()
    # frame_count = m.Value('frame_count', 0)
    
    # fd, path = tempfile.mkstemp()

    loop = asyncio.get_event_loop()

    # image detect
    # loop.run_until_complete(image_detect("pizza.jpg"))

    # video detect
    loop.run_until_complete(video_detect("short video.mp4", loop))

    loop.close()

    print("--- %s seconds ---" % (time.time() - start_time))