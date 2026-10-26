from flask import Flask
from flask_cors import CORS

from app.config import Config
from app.database import db


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Permitir solicitudes CORS
    CORS(app)

    db.init_app(app)

    from app.blueprints.main.routes import main_bp
    from app.blueprints.api.routes import api_bp

    app.register_blueprint(main_bp)
    app.register_blueprint(api_bp, url_prefix='/api')

    return app
