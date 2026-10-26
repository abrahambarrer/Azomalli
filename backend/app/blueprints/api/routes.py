from flask import request, jsonify, Blueprint
from app.services import get_products as fetch_products_service

api_bp = Blueprint('api', __name__)

@api_bp.route('/products', methods=['GET'])
def get_products():
    """Endpoint API para obtener el catálogo de productos."""
    filter_type = request.args.get('filter')
    category = request.args.get('category')
    
    try:
        products = fetch_products_service(filter_type=filter_type, category=category)
        
        return jsonify({
            "success": True,
            "count": len(products),
            "products": products
        }), 200
    except Exception as err:
        return jsonify({
            "success": False,
            "error": "Error al consultar los productos de la base de datos",
            "details": str(err)
        }), 500
