from . import TrafficAlgorithm
from videodetector import point_calculate


class Andrew(TrafficAlgorithm):
    def __init__(self, pixel_threshold: int, time_threshold: int, normal_size: int, lanes: tuple):
        if pixel_threshold < 0:
            raise ValueError(
                "'pixel_threshold' must be a non-negative integer")
        if time_threshold < 0:
            raise ValueError(
                "'time_threshold' must be a non-negative integer")

        self.pixel_threshold = pixel_threshold
        self.time_threshold = time_threshold
        self.normal_size = normal_size
        self.lanes = lanes

    def _is_normal_size(self, x1, y1, x2, y2):
        return abs(x1-x2) <= self.normal_size

    def _remove_overlaps(self, result):
        if(len(result) > 1):
            B = result[0]
            for item in result[1:]:
                A = B
                B = item
                # pixel threshold = batas selisih pixel yang dibutuhkan sehingga 2 box dianggap mendeteksi hal yang sama
                if(point_calculate.boxDistance(A['topleft']['x'], A['topleft']['y'], B['topleft']['x'], B['topleft']['y']) < self.pixel_threshold):
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

    def _count_cars_per_frame(self, cars, counting_line, vertical=False, prev_lane_status):
        no_of_lanes = len(self.lanes)
        car_pass_lane = [False] * no_of_lanes

        for curr_car in cars:
            # collision with counting line
            if point_calculate.collision(curr_car[0], curr_car[1], curr_car[2], curr_car[3], counting_line, vertical):
                # check which lane car belongs to
                for i in range(no_of_lanes):
                    if not prev_lane_status[i] and not car_pass_lane[i]:
                        lane_min, lane_max = point_calculate.sort_order(self.lanes[i])

                        if point_calculate.in_between(curr_car[0], curr_car[1], curr_car[2], curr_car[3], lane_min, lane_max, vertical):
                            car_pass_lane[i] = True
                        
        return car_pass_lane

    def count_cars(self, coords, roi, count_line, vertical=False):
        cars = []
        cars_per_frame = []
        no_of_lanes = len(self.lanes)

        gap_time = [0] * no_of_lanes
        gap_in = [False] * no_of_lanes
        gap_out = []

        for index, coord in enumerate(coords):
            _coord = []
            count = 0

            for c in coord:
                left, top = c['topleft']['x'], c['topleft']['y']
                right, bot = c['bottomright']['x'], c['bottomright']['y']
                label = c['label']
                conf = c['confidence']
                _c = (left, top, right, bot, label, conf, index)
                _coord.append(_c)

            car_pass_lane = self._count_cars_per_frame(
                coord, count_line, vertical, gap_in)

            for i in range(no_of_lanes):
                if car_pass_lane[i]:
                    gap_in[i] = True
                    count += car_pass_lane[i]
                if gap_in[i]:
                    gap_time[i] += 1
                if gap_time[i] > self.time_threshold:
                    gap_in[i] = False
                    gap_time[i] = 0
            
            cars_per_frame.append(
                count + (cars_per_frame[-1] if cars_per_frame else 0))

        return cars_per_frame