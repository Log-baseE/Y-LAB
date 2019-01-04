from . import TrafficAlgorithm
from videodetector import point_calculate
import itertools


class Madeleine(TrafficAlgorithm):
    def __init__(self, pixel_threshold: int, time_threshold: int, normal_size: int):
        if pixel_threshold < 0:
            raise ValueError(
                "'pixel_threshold' must be a non-negative integer")
        if time_threshold < 0:
            raise ValueError(
                "'time_threshold' must be a non-negative integer")

        self.pixel_threshold = pixel_threshold
        self.time_threshold = time_threshold
        self.normal_size = normal_size

    def _is_normal_size(self, x1, y1, x2, y2):
        return abs(x1-x2) <= self.normal_size

    def _remove_overlaps(self, result):
        if(len(result) > 1):
            B = result[0]
            for item in result[1:]:
                A = B
                B = item
                # detection threshold = batas selisih pixel yang dibutuhkan seh90--0-9-=09--90=ingga 2 box dianggap mendeteksi hal yang sama
                if(point_calculate.boxDistance(A['topleft']['x'], A['topleft']['y'], B['topleft']['x'], B['topleft']['y']) < self.detection_threshold):
                    # remove box with lower confidence if distance between 2 boxes is less than threshold
                    if A['confidence'] > B['confidence']:
                        result.remove(B)
                        B = A
                    else:
                        result.remove(A)
        return result

    def postprocess_result(self, result):
        coord = []

        for bbox in result:
            left, top = bbox['topleft']['x'], bbox['topleft']['y']
            right, bot = bbox['bottomright']['x'], bbox['bottomright']['y']

            if self._is_normal_size(left, top, right, bot):
                coord.append(bbox)

        return self._remove_overlaps(coord)

    def _count_cars_per_frame(self, frame_index, current_cars, previous_cars, counting_line, vertical=False):
        print("curr:", current_cars)
        print("prev:", previous_cars)
        for prev_car in previous_cars:
            if frame_index - prev_car[6] > self.time_threshold:
                previous_cars.remove(prev_car)

        new_cars = []
        count = 0

        for curr_car in current_cars:
            # collision with counting line
            if point_calculate.collision(curr_car[0], curr_car[1], curr_car[2], curr_car[3], counting_line, vertical):
                new_cars.append(curr_car)

                unique_car = True
                for prev_car in previous_cars:
                    # tl.x, tl.y, br.x, br.y
                    prev_car_point = (
                        (prev_car[0] + prev_car[2])/2, (prev_car[1] + prev_car[3])/2)
                    new_car_point = (
                        (curr_car[0] + curr_car[2])/2, (curr_car[1] + curr_car[3])/2)

                    if vertical:
                        car_size = prev_car[3] - prev_car[1]
                    else:
                        car_size = prev_car[2] - prev_car[0]

                    if point_calculate.boxDistance(prev_car_point[0], prev_car_point[1], new_car_point[0], new_car_point[1]) < (car_size//3 * (frame_index - prev_car[6])):
                        # consider same car
                        unique_car = False
                        previous_cars.remove(prev_car)
                        break

                if unique_car:
                    count += 1

        return new_cars + previous_cars, count

    def count_cars(self, coords, roi, count_line, vertical=False):
        cars = []
        cars_per_frame = []

        for index, coord in enumerate(coords):
            _coord = []
            for c in coord:
                left, top = c['topleft']['x'], c['topleft']['y']
                right, bot = c['bottomright']['x'], c['bottomright']['y']
                label = c['label']
                conf = c['confidence']
                _c = (left, top, right, bot, label, conf, index)
                _coord.append(_c)

            cars, count = self._count_cars_per_frame(
                index, _coord, cars, count_line, vertical)
            print('cars:', cars)
            cars_per_frame.append(
                count + (cars_per_frame[-1] if cars_per_frame else 0))

        return cars_per_frame
