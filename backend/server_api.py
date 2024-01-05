import flask
import os
from tempfile import NamedTemporaryFile
from backend.midi_match import midi_match

api = flask.Blueprint("api", __name__)

@api.post('/midi_match')
def post_midi_match():
    assert 'midi' in flask.request.files
    file = flask.request.files['midi']
    assert file.filename.endswith('.mid')
    with NamedTemporaryFile(suffix='.mid', delete=False) as temp:
        file.save(temp)
        temp.close()
        topk = midi_match(temp.name)
        os.unlink(temp.name)
        return flask.jsonify([{'score': score, 'filename': str(filename)} for score, filename in topk])