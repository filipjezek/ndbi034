from typing import List, Tuple
from backend.melody_extraction.filter_notes import Note
import numpy as np

def get_pitch_histograms(channels: List[List[Note]]) -> Tuple[np.ndarray, List[int]]:
    """
    Returns histograms for all nonempty channels and their indices
    """
    nonempty = [h for h in channels if len(h) != 0]
    indices = [i for i, h in enumerate(channels) if len(h) != 0]
    hist = np.zeros((len(nonempty), 12), np.int32)
    for i, channel in enumerate(nonempty):
        for note in channel:
            hist[i, note.pitch % 12] += 1
    return hist, indices

