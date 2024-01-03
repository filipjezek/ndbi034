from flask import Flask
from flask_cors import CORS
from pathlib import Path

app = Flask(
    __name__,
    root_path=Path(__file__).joinpath('..').resolve(),
    static_url_path='/',
    static_folder=Path(__file__).joinpath('../static').resolve(),
)

cors = CORS(app)