import numpy as np
from typing import List
from scipy.spatial.distance import euclidean as l2
from scipy.spatial.distance import pdist
from backend.melody_extraction.utils import condensed_to_square_idx

def cluster_histograms(histograms: np.ndarray, indices: List[int]):
    """
    Return list of lists of indices of MIDI channels that are clustered together.
    """
    
    if len(histograms) == 0:
        return []
    
    avg = np.mean(histograms, axis=0)
    distances_from_avg = np.array([l2(h, avg) for h in histograms])
    
    if (distances_from_avg == 0).all():
        return [indices]
    
    weighted_avg = np.average(histograms, weights=distances_from_avg, axis=0)
    threshold = l2(avg, weighted_avg) / 2
    
    clusters = [[i] for i in range(len(histograms))]
    cluster_hists = histograms.copy()
    
    while len(cluster_hists) > 1:
        distances = pdist(cluster_hists, metric=l2)
        closest_cond = np.argmin(distances)
        closest = condensed_to_square_idx(closest_cond, len(cluster_hists))
        if distances[closest_cond] >= threshold:
            clusters[closest[0]] += clusters[closest[1]]
            del clusters[closest[1]]
            cluster_hists[closest[0]] = np.mean(histograms[clusters[closest[0]]], axis=0)
            cluster_hists = np.delete(cluster_hists, closest[1], 0)
        else:
            break
    return [[indices[i] for i in c] for c in clusters]