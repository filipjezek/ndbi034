import glob
from pathlib import Path
from backend.k_container import KContainer
from backend.twlcs import twlcs
from mido import MidiFile
from typing import Tuple
from backend.config import MELODY_DIR

def iter_db():
    yield from glob.iglob('Red Hot*/*.mid', root_dir=MELODY_DIR)
    
def midi_match(filename: str):
    midi = MidiFile(filename, ticks_per_beat=128)
    
    top_5 = KContainer[Tuple[int, Path]](5)
    for other in iter_db():
        try:
            other_midi = MidiFile(MELODY_DIR / other)
        except:
            continue
        top_5.add((twlcs(midi, other_midi), other))
    return top_5