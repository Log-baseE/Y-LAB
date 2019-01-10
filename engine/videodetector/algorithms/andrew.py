from . import TrafficAlgorithm
from videodetector import point_calculate


class Andrew(TrafficAlgorithm):
    def __init__(self, pixel_threshold: int, time_threshold: int, normal_size: int, lanes):
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
        self._lanes = lanes

    def _is_normal_size(self, x1, y1, x2, y2):
        return abs(x1-x2) <= self.normal_size

    def _remove_overlaps(self, result):
        if(len(result) > 1):
            new_result = []
            for A in result:
                temp_result = new_result[:]
                ignore = False
                for B in new_result:
                    if point_calculate.boxDistance(A['topleft']['x'], A['topleft']['y'], B['topleft']['x'], B['topleft']['y']) < self.pixel_threshold:
                        if A['confidence'] > B['confidence']:
                            temp_result.remove(B)
                        else:
                            ignore = True
                        break
                if not ignore:
                    temp_result.append(A)
                new_result = temp_result
            return new_result
        else:
            return result

    def postprocess_result(self, result):
        coord = []

        for bbox in result:
            left, top = bbox['topleft']['x'], bbox['topleft']['y']
            right, bot = bbox['bottomright']['x'], bbox['bottomright']['y']

            if self._is_normal_size(left, top, right, bot):
                coord.append(bbox)

        return self._remove_overlaps(coord)

    def _count_cars_per_frame(self, cars, prev_lane_status, counting_line, vertical=False):
        lane_count = len(self.lanes)
        car_pass_lane = [False] * lane_count

        for curr_car in cars:
            # collision with counting line
            if point_calculate.collision(curr_car[0], curr_car[1], curr_car[2], curr_car[3], counting_line, vertical):
                # check which lane car belongs to
                for i in range(lane_count):
                    if not prev_lane_status[i] and not car_pass_lane[i]:
                        lane_min, lane_max = point_calculate.sort_order(
                            self.lanes[i])

                        if point_calculate.in_between(curr_car[0], curr_car[1], curr_car[2], curr_car[3], lane_min, lane_max, vertical):
                            car_pass_lane[i] = True

        return car_pass_lane

    @staticmethod
    def _get_lanes(count_line, lanes, vertical=True):
        lane_count = lanes['count']
        shoulder = lanes['shoulderSize']
        scale = lanes['perspectiveScaling']

        if scale == 1:
            geom_sum = lane_count
        else:
            geom_sum = (scale**lane_count - 1)/(scale - 1)

        start_pt = count_line[0][0 if vertical else 1]
        last_pt = count_line[1][0 if vertical else 1]
        width = last_pt - start_pt

        base_lane = ((1-shoulder)*width)/geom_sum

        lanes = (start_pt, )

        if shoulder > 0:
            lanes += (lanes[-1] + shoulder*width, )
        for i in range(lane_count):
            lanes += (lanes[-1] + base_lane*(scale**i), )
        if shoulder < 0:
            lanes += (lanes[-1] + shoulder*width, )
        
        _lanes = [(a,b) for a,b in zip(lanes, lanes[1:])]
        print(_lanes)
        return _lanes

    def get_additional_lines(self, *args, **kwargs):
        lanes = self._lanes
        vertical = kwargs['vertical']
        roi = kwargs['roi']

        lane_count = lanes['count']
        shoulder = lanes['shoulderSize']
        scale = lanes['perspectiveScaling']

        if scale == 1:
            geom_sum = lane_count
        else:
            geom_sum = (scale**lane_count - 1)/(scale - 1)

        topleft = roi['topLeft'] if vertical else roi['topRight']
        topright = roi['topRight'] if vertical else roi['bottomRight']
        bottomright = roi['bottomRight'] if vertical else roi['bottomLeft']
        bottomleft = roi['bottomLeft'] if vertical else roi['topLeft']

        topleft = (topleft['x'], topleft['y'])
        topright = (topright['x'], topright['y'])
        bottomright = (bottomright['x'], bottomright['y'])
        bottomleft = (bottomleft['x'], bottomleft['y'])

        top_width = (topright[0] - topleft[0], topright[1] - topleft[1])
        top_base = (((1-shoulder)*top_width[0])/geom_sum, ((1-shoulder)*top_width[1])/geom_sum)
        top_lanes = (topleft, )

        if shoulder > 0:
            top_lanes += ((top_lanes[-1][0] + shoulder*top_width[0], top_lanes[-1][1] + shoulder*top_width[1]), )
        for i in range(lane_count):
            top_lanes += ((top_lanes[-1][0] + top_base[0]*(scale**i), top_lanes[-1][1] + top_base[1]*(scale**i)), )
        if shoulder < 0:
            top_lanes += ((top_lanes[-1][0] + shoulder*top_width[0], top_lanes[-1][1] + shoulder*top_width[1]), )
        
        bottom_width = (bottomright[0] - bottomleft[0], bottomright[1] - bottomleft[1])
        bottom_base = (((1-shoulder)*bottom_width[0])/geom_sum, ((1-shoulder)*bottom_width[1])/geom_sum)
        bottom_lanes = (bottomleft, )

        if shoulder > 0:
            bottom_lanes += ((bottom_lanes[-1][0] + shoulder*bottom_width[0], bottom_lanes[-1][1] + shoulder*bottom_width[1]), )
        for i in range(lane_count):
            bottom_lanes += ((bottom_lanes[-1][0] + bottom_base[0]*(scale**i), bottom_lanes[-1][1] + bottom_base[1]*(scale**i)), )
        if shoulder < 0:
            bottom_lanes += ((bottom_lanes[-1][0] + shoulder*bottom_width[0], bottom_lanes[-1][1] + shoulder*bottom_width[1]), )
        
        lanes = [(t,b) for t,b in zip(top_lanes[1:-1], bottom_lanes[1:-1])]
        return lanes

    def count_cars(self, coords, roi, count_line, vertical=True):
        cars = []
        cars_per_frame = []
        shoulder = self.lanes['shoulderSize']
        lane_count = self.lanes['count'] + (1 if shoulder != 0 else 0)

        self.lanes = self._get_lanes(count_line, self.lanes, vertical)

        gap_time = [0] * lane_count
        gap_in = [False] * lane_count
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
                _coord, gap_in, count_line, vertical)

            for i in range(lane_count):
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

            print(cars_per_frame)
            print(car_pass_lane)
            print()

        return cars_per_frame
