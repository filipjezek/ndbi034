from collections import namedtuple
from typing import List

Note = namedtuple('Note', ['start', 'pitch', 'velocity'])

def filter_notes(track) -> List[List[Note]]:
    dicts = (m.dict() for m in track)
    channels = [[] for _ in range(17)] # 16 channels + 1 because channels are 1-indexed
    
    t = 0
    
    for d in dicts:
        t += d['time']
        if d['type'] == 'note_on' or d['type'] == 'note_off': 
            channels[d['channel']].append(Note(t, d['note'], d['velocity']))
    channels[9] = []
    return channels