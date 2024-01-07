from typing import TypeVar, Generic, Iterator, Callable

T = TypeVar('T')

class KContainer(Generic[T]):
    def __init__(self, k: int, duplicate_key: Callable[[T, T], bool] = lambda x, y: x == y):
        self.k = k
        self.__values = []
        self.duplicate_key = duplicate_key
        
    def add(self, value: T):
        if next((x for x in self.__values if self.duplicate_key(x, value)), None) is not None:
            return
        if len(self.__values) < self.k:
            self.__values.append(value)
        elif value > self.__values[-1]:
            self.__values.append(value)
            self.__values.sort(reverse=True)
            self.__values.pop()
            
    def __iter__(self) -> Iterator[T]:
        return iter(self.__values)
    
    def __getitem__(self, index) -> T:
        return self.__values[index]
    
    def __len__(self) -> int:
        return len(self.__values)