"""Enumeraciones PostgreSQL usadas en los modelos."""

import enum


class CategoriaProducto(str, enum.Enum):
    """Categoría de un producto."""
    DULCE = "DULCE"
    SALADO = "SALADO"


class EstadoPedido(str, enum.Enum):
    """Estado actual de un pedido."""
    PENDIENTE = "PENDIENTE"
    ENTREGADO = "ENTREGADO"
    CANCELADO = "CANCELADO"


class MetodoDePago(str, enum.Enum):
    """Método de pago aceptado."""
    EFECTIVO = "EFECTIVO"
    TRANSFERENCIA = "TRANSFERENCIA"


class RolDeUsuario(str, enum.Enum):
    """Rol asignado a una cuenta de usuario."""
    CLIENTE = "CLIENTE"
    ADMINISTRADOR = "ADMINISTRADOR"
