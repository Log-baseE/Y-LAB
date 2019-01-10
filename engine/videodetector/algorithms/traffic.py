import abc

class TrafficAlgorithm(abc.ABC):
    @abc.abstractmethod
    def postprocess_result(self, result):
        pass

    @abc.abstractmethod
    def count_cars(self, coords, roi, count_line, vertical=True):
        pass

    @abc.abstractmethod
    def get_additional_lines(self, *args, **kwargs):
        pass