def lane_count(gap_threshold: int):
    if gap_threshold < 0:
        raise ValueError("'gap_threshold' must be a non-negative integer")
    def process():
        pass
    return process


def distance_count(pixel_threshold: int, time_threshold: int):
    if pixel_threshold < 0:
        raise ValueError("'pixel_threshold' must be a non-negative integer")
    if time_threshold < 0:
        raise ValueError(
            "'time_threshold' must be a non-negative integer")

    def process():
        pass
    return process
