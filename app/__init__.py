from flask import Flask

def create_app():
    app = Flask(__name__, static_folder='../static', template_folder='../templates')

    from app.blueprints.main.routes import main_bp
    from app.blueprints.api.routes import api_bp

    app.register_blueprint(main_bp)
    app.register_blueprint(api_bp, url_prefix='/api')

    return app