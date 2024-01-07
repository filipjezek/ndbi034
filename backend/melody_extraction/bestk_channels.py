from typing import List
import numpy as np
from backend.melody_extraction.cluster_histograms import cluster_histograms
from backend.melody_extraction.filter_notes import Note
from scipy.stats import entropy
from scipy.spatial.distance import euclidean as l2

def bestk_channels(histograms: np.ndarray, indices: List[int], channels: List[List[Note]]) -> List[int]:
    clusters = cluster_histograms(histograms, indices)
    return [max(c, key=lambda x: __channel_criterion(channels[x])) for c in clusters]
            

def __channel_criterion(channel: List[Note]):
    avg_pitch = sum(n.pitch for n in channel) / len(channel)
    norm_entropy = entropy([n.pitch for n in channel]) / 7 # log2(128)
    return avg_pitch + norm_entropy * 128