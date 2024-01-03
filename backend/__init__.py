from backend.app import app
from werkzeug.exceptions import NotFound
from .server_api import api
import flask
    
app.register_blueprint(api, url_prefix='/api/')