import os
import json
from flask import Flask, render_template, jsonify, request

app = Flask(__name__, static_folder='static', template_folder='templates')

DATA_FILE = os.path.join(os.path.dirname(__file__), 'data', 'products.json')

def load_products():
    """Lee y retorna los productos desde el archivo JSON local."""
    if not os.path.exists(DATA_FILE):
        return []
    with open(DATA_FILE, 'r', encoding='utf-8') as f:
        data = json.load(f)
        return data.get('products', [])

@app.route('/')
def home():
    """Renderiza la Landing Page del e-commerce."""
    products = load_products()
    return render_template('index.html', initial_products=products)

@app.route('/api/products', methods=['GET'])
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

@app.route('/api/orders', methods=['POST'])
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

if __name__ == '__main__':
    print("Iniciando servidor en http://127.0.0.1:5000")
    app.run(debug=True, port=5000)
