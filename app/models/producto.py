"""Modelo ORM — Producto."""

from sqlalchemy.dialects.postgresql import ENUM as PgENUM, JSONB

from app.database import db
from app.models.enums import CategoriaProducto


class Producto(db.Model):
    """Producto del catálogo de panadería."""

    __tablename__ = "Producto"

    producto_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nombre = db.Column(db.String(100), nullable=False)
    descripcion = db.Column(db.String(2500), nullable=False)
    precio_unitario = db.Column(db.Numeric(12, 2), nullable=False)
    imagen_url = db.Column(db.String(255), nullable=True)
    es_personalizable = db.Column(db.Boolean, nullable=False)
    sabor = db.Column(JSONB, nullable=True)
    topping = db.Column(JSONB, nullable=True)
    relleno = db.Column(JSONB, nullable=True)
    activo = db.Column(db.Boolean, nullable=False)
    categoria = db.Column(
        PgENUM(CategoriaProducto, name="categoria_producto", create_type=False),
        nullable=False,
    )
    es_temporada = db.Column(db.Boolean, nullable=False)

    # Relación con detalles de pedido
    detalles = db.relationship("DetallePedido", back_populates="producto")

    def __repr__(self):
        return f"<Producto {self.producto_id}: {self.nombre}>"
