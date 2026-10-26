"""Servicios de negocio de Azomalli — Consultas a la base de datos."""

from app.models.producto import Producto
from app.models.enums import CategoriaProducto


def get_products(filter_type=None, category=None, only_active=True):
    """
    Aplica filtros por estado activo, productos de temporada y categoría ENUM (DULCE/SALADO).
    """
    query = Producto.query

    if only_active:
        query = query.filter_by(activo=True)

    if filter_type == 'seasonal':
        query = query.filter_by(es_temporada=True)

    if category and category.lower() != 'todos':
        cat_clean = category.strip().upper()
        if cat_clean in ('DULCE', 'DULCES'):
            query = query.filter_by(categoria=CategoriaProducto.DULCE)
        elif cat_clean in ('SALADO', 'SALADOS'):
            query = query.filter_by(categoria=CategoriaProducto.SALADO)

    products = query.order_by(Producto.producto_id.asc()).all()
    return [p.to_dict() for p in products]


def get_product_by_id(producto_id):
    """Obtiene un producto por ID"""
    product = Producto.query.filter_by(producto_id=producto_id, activo=True).first()
    return product.to_dict() if product else None
