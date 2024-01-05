from mido import MidiFile
import numpy as np

def twlcs(file1: MidiFile, file2: MidiFile) -> int:
    if len(file1.tracks) == 0 or len(file2.tracks) == 0:
        return 0
    track1, track2 = filter_track(file1.tracks[0]), filter_track(file2.merged_track)
    a, b = len(track1), len(track2)
    if a == 0 or b == 0:
        return 0
    matrix = np.zeros((a, b), np.int32)
    for i in range(1, a):
        for j in range(1, b):
            if track1[i] == track2[j]:
                matrix[i, j] = max(matrix[i-1, j], matrix[i, j-1], matrix[i-1, j-1]) + 1
            else:
                matrix[i, j] = max(matrix[i-1, j], matrix[i, j-1])
    return int(matrix[-1, -1])

def filter_track(track):
    dicts = (m.dict() for m in track if not m.is_meta)
    return [d['note'] for d in dicts if d['type'] == 'note_on' and d['velocity'] > 0]