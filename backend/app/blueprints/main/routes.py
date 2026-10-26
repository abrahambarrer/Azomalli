from flask import Blueprint, jsonify

main_bp = Blueprint('main', __name__)

@main_bp.route('/')
def health_check():
    return jsonify({
        "name": "Las Glorias de Azomalli API",
        "status": "online",
        "version": "1.0.0"
    })