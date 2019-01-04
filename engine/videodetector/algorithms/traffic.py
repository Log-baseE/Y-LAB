import abc

class TrafficAlgorithm(abc.ABC):
    @abc.abstractmethod
    def postprocess_result(self, result):
        pass

    @abc.abstractmethod
    def count_cars(self, coords, roi, count_line, vertical=False):
        pass