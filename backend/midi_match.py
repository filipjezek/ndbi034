import glob
from pathlib import Path
from backend.k_container import KContainer
from twlcs import twlcs
from mido import MidiFile
from typing import Tuple
from backend.config import MELODY_DIR
import numpy as np

def iter_db():
    yield from glob.iglob('R*/*.mid', root_dir=MELODY_DIR)
    
def midi_match(filename: str):
    midi = MidiFile(filename, ticks_per_beat=128)
    
    top_5 = KContainer[Tuple[int, Path]](5, duplicate_key=__duplicate)
    for other in iter_db():
        try:
            other_midi = MidiFile(MELODY_DIR / other)
        except:
            continue
        if len(midi.tracks) == 0 or len(other_midi.tracks) == 0:
            continue
        track1, track2 = filter_track(midi.tracks[0], 20), filter_track(other_midi.tracks[0]) # both files should have only one track
        if len(track1) == 0 or len(track2) == 0:
            continue
        
        top_5.add((twlcs(track1, track2), other))
    return top_5

def __duplicate(a: Tuple[int, Path], b: Tuple[int, Path]):
    if a[0] != b[0]:
        return False
    a_parts = str(a[1]).rsplit('.', 2)
    b_parts = str(b[1]).rsplit('.', 2)
    if len(a_parts) == 2 and len(b_parts) == 2:
        return False
    return a_parts[0] == b_parts[0]

def filter_track(track, copies: int = 1) -> np.ndarray:
    dicts = (m.dict() for m in track if not m.is_meta)
    return np.array([d['note'] for d in dicts if d['type'] == 'note_on' and d['velocity'] > 0] * copies)