from backend.app import app
from werkzeug.exceptions import NotFound
from .server_api import api
import flask
    
app.register_blueprint(api, url_prefix='/api/')

@app.errorhandler(404)
def serve_spa(error: NotFound):
    try:
        return flask.send_from_directory(app.static_folder + '/frontend_dist/browser', flask.request.path[1:])
    except NotFound:
        return app.send_static_file('frontend_dist/browser/index.html')