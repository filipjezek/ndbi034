from typing import List
from backend.melody_extraction.filter_notes import Note
import itertools as it

def merge_channels(channels: List[List[Note]], indices: List[int]) -> List[Note]:
    """
    Returns a list of channels with the same notes merged together.
    """
    concatenated = list(it.chain.from_iterable(channels[i] for i in indices))
    concatenated.sort(key=lambda n: n.start)
    return concatenated