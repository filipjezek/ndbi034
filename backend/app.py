from flask import Flask
from flask_cors import CORS
from pathlib import Path
from backend.config import MELODY_DIR, MIDI_DIR
from backend.melody_extraction import extract_melody
import glob

app = Flask(
    __name__,
    root_path=Path(__file__).joinpath('..').resolve(),
    static_url_path='/',
    static_folder=Path(__file__).joinpath('../static').resolve(),
)

cors = CORS(app)

# for file in glob.iglob('*/*.mid', root_dir=MIDI_DIR):
#     (MELODY_DIR / file).parent.mkdir(parents=True, exist_ok=True)
#     extract_melody(MIDI_DIR / file, MELODY_DIR / file)

