from typing import TypeVar, Generic, Iterator

T = TypeVar('T')

class KContainer(Generic[T]):
    def __init__(self, k: int):
        self.k = k
        self.__values = []
        
    def add(self, value: T):
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