import glob
from pathlib import Path
from backend.k_container import KContainer
from backend.twlcs import twlcs
from mido import MidiFile
from typing import Tuple

MIDI_DIR = Path(__file__) / '../static/clean_midi'

def iter_db():
    yield from glob.iglob('Red Hot*/*.mid', root_dir=MIDI_DIR)
    
def midi_match(filename: str):
    midi = MidiFile(filename, ticks_per_beat=128)
    
    top_5 = KContainer[Tuple[int, Path]](5)
    for other in iter_db():
        try:
            other_midi = MidiFile(MIDI_DIR / other)
        except:
            continue
        top_5.add((twlcs(midi, other_midi), other))
    return top_5