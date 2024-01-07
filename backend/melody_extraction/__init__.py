from pathlib import Path
from mido import MidiFile, Message
from backend.melody_extraction.filter_notes import filter_notes
from backend.melody_extraction.skyline import skyline
from backend.melody_extraction.pitch_histogram import get_pitch_histograms
from backend.melody_extraction.bestk_channels import bestk_channels
from backend.melody_extraction.merge_channels import merge_channels

def extract_melody(in_file: Path, out_file: Path):
    try:
        midi = MidiFile(in_file)
    except:
        return
    channels = filter_notes(midi.merged_track)
    for i, ch in enumerate(channels):
        if len(ch) == 0:
            continue
        channels[i] = skyline(ch)
    
    histograms, indices = get_pitch_histograms(channels)
    bestk = bestk_channels(histograms, indices, channels)
    melody = merge_channels(channels, bestk)
    melody = skyline(melody)
    
    midi_out = MidiFile(ticks_per_beat=midi.ticks_per_beat)
    track = midi_out.add_track()
    track.append(Message('program_change', program=20, time=0))
    t = 0
    for note in melody:
        track.append(Message(
            'note_on' if note.velocity > 0 else 'note_off',
            note=note.pitch,
            velocity=note.velocity,
            time=note.start - t
        ))
        t = note.start
    midi_out.save(out_file)
    