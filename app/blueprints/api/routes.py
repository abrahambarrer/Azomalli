from flask import request, jsonify, Blueprint
from app.services import load_products

api_bp = Blueprint('api', __name__)

@api_bp.route('/products', methods=['GET'])
def get_products():
    """Endpoint API para obtener el catálogo de productos."""
    products = load_products()
    
    filter_type = request.args.get('filter')
    category = request.args.get('category')
    
    if filter_type == 'bestseller':
        products = [p for p in products if p.get('is_bestseller')]
    elif filter_type == 'seasonal':
        products = [p for p in products if p.get('is_seasonal')]
        
    if category and category.lower() != 'todos':
        products = [p for p in products if p.get('category', '').lower() == category.lower()]
        
    return jsonify({
        "success": True,
        "count": len(products),
        "products": products
    })