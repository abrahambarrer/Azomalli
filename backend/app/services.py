import os
import json

DATA_FILE = os.path.join(os.path.dirname(__file__), '..', 'data', 'products.json')

def load_products():
    """Lee y retorna los productos desde el archivo JSON local."""
    if not os.path.exists(DATA_FILE):
        return []
    with open(DATA_FILE, 'r', encoding='utf-8') as file:
        data = json.load(file)
        return data.get('products', [])