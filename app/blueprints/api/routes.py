import os
from flask import request, jsonify, Blueprint
from app.services import load_products

api_bp = Blueprint('api', __name__)

@api_bp.route('/products', methods=['GET'])
def get_products():
    """Endpoint API para obtener el catálogo de productos con filtros opcionales."""
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

@api_bp.route('/orders', methods=['POST'])
def create_order():
    """Simula la creación de un pedido a partir del carrito de compras."""
    order_data = request.get_json() or {}
    items = order_data.get('items', [])
    user = order_data.get('user', 'Invitado')
    
    if not items:
        return jsonify({"success": False, "message": "El carrito está vacío"}), 400
        
    total = sum(item.get('price', 0) * item.get('quantity', 1) for item in items)
    order_id = f"GLO-{os.urandom(3).hex().upper()}"
    
    return jsonify({
        "success": True,
        "order_id": order_id,
        "user": user,
        "total": round(total, 2),
        "items_count": sum(item.get('quantity', 1) for item in items),
        "message": f"¡Pedido {order_id} recibido con éxito! En breve estará horneándose con amor."
    })
