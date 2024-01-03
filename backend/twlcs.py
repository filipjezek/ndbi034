import MIDI
import numpy as np

def twlcs(track1: MIDI.Track, track2: MIDI.Track) -> float:
    track1.parse()
    track2.parse()
    
    a, b = len(track1), len(track2)
    matrix = np.zeros((a, b), np.int32)
    for i in range(1, a):
        for j in range(1, b):
            if track1[i].data == track2[j].data:
                matrix[i, j] = max(matrix[i-1, j], matrix[i, j-1], matrix[i-1, j-1]) + 1
            else:
                matrix[i, j] = max(matrix[i-1, j], matrix[i, j-1])
    return matrix[-1, -1]