from flask import render_template, Blueprint
from app.services import load_products

main_bp = Blueprint('main', __name__)

@main_bp.route('/')
def home():
    """Renderizar Landing Page"""
    products = load_products()
    return render_template('index.html', initial_products=products)