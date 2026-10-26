"""Paquete de modelos ORM — importa todos los modelos para que Alembic los detecte."""

from app.models.persona import Persona          # noqa: F401
from app.models.cuenta import Cuenta             # noqa: F401
from app.models.producto import Producto         # noqa: F401
from app.models.pedido import Pedido             # noqa: F401
from app.models.detalle_pedido import DetallePedido  # noqa: F401
from app.models.token_recuperacion import TokenRecuperacion  # noqa: F401
