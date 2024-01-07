from typing import List
from backend.melody_extraction.filter_notes import Note

def skyline(channel: List[Note]) -> List[Note]:
    if len(channel) == 0:
        return []
    result: List[Note] = []
    active: Note = None
    for note in channel:
        if note.velocity == 0:
            if active is not None and active.pitch == note.pitch:
                active = None
                result.append(note)
        else:
            if active is not None and active.pitch >= note.pitch:
                continue
            if active is not None:
                result.append(Note(note.start, active.pitch, 0))
            result.append(note)
            active = note
    return result
            