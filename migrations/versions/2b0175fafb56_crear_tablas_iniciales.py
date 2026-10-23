"""crear_tablas_iniciales

Revision ID: 2b0175fafb56
Revises: 
Create Date: 2026-10-22 18:51:27.076319

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import ENUM, JSONB


# revision identifiers, used by Alembic.
revision: str = '2b0175fafb56'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

# ── ENUMs de PostgreSQL ───────────────────────────────────────────
categoria_producto = ENUM(
    'DULCE', 'SALADO',
    name='categoria_producto', create_type=False,
)
estado_pedido = ENUM(
    'PENDIENTE', 'ENTREGADO', 'CANCELADO',
    name='estado_pedido', create_type=False,
)
metodo_de_pago = ENUM(
    'EFECTIVO', 'TRANSFERENCIA',
    name='metodo_de_pago', create_type=False,
)
rol_de_usuario = ENUM(
    'CLIENTE', 'ADMINISTRADOR',
    name='rol_de_usuario', create_type=False,
)


def upgrade() -> None:
    # Crear tipos ENUM
    op.execute("CREATE TYPE categoria_producto AS ENUM ('DULCE', 'SALADO')")
    op.execute("CREATE TYPE estado_pedido AS ENUM ('PENDIENTE', 'ENTREGADO', 'CANCELADO')")
    op.execute("CREATE TYPE metodo_de_pago AS ENUM ('EFECTIVO', 'TRANSFERENCIA')")
    op.execute("CREATE TYPE rol_de_usuario AS ENUM ('CLIENTE', 'ADMINISTRADOR')")

    # Persona
    op.create_table(
        'Persona',
        sa.Column('persona_id', sa.Integer, primary_key=True, autoincrement=True),
        sa.Column('nombre', sa.String(100), nullable=False),
        sa.Column('primer_apellido', sa.String(50), nullable=False),
        sa.Column('segundo_apellido', sa.String(50), nullable=True),
        sa.Column('fecha_registro', sa.Date, nullable=False),
    )

    # Cuenta
    op.create_table(
        'Cuenta',
        sa.Column('cuenta_id', sa.Integer, primary_key=True, autoincrement=True),
        sa.Column('email', sa.String(255), nullable=False, unique=True),
        sa.Column('telefono', sa.String(10), nullable=False),
        sa.Column('password', sa.String(255), nullable=False),
        sa.Column('rol', rol_de_usuario, nullable=False),
        sa.Column('persona_id', sa.Integer, sa.ForeignKey('Persona.persona_id'), nullable=False, unique=True),
    )

    # Producto
    op.create_table(
        'Producto',
        sa.Column('producto_id', sa.Integer, primary_key=True, autoincrement=True),
        sa.Column('nombre', sa.String(100), nullable=False),
        sa.Column('descripcion', sa.String(2500), nullable=False),
        sa.Column('precio_unitario', sa.Numeric(12, 2), nullable=False),
        sa.Column('imagen_url', sa.String(255), nullable=True),
        sa.Column('es_personalizable', sa.Boolean, nullable=False),
        sa.Column('sabor', JSONB, nullable=True),
        sa.Column('topping', JSONB, nullable=True),
        sa.Column('relleno', JSONB, nullable=True),
        sa.Column('activo', sa.Boolean, nullable=False),
        sa.Column('categoria', categoria_producto, nullable=False),
        sa.Column('es_temporada', sa.Boolean, nullable=False),
    )

    # Pedido
    op.create_table(
        'Pedido',
        sa.Column('pedido_id', sa.Integer, primary_key=True, autoincrement=True),
        sa.Column('cuenta_id', sa.Integer, sa.ForeignKey('Cuenta.cuenta_id'), nullable=False),
        sa.Column('fecha_pedido', sa.Date, nullable=False),
        sa.Column('fecha_entrega', sa.Date, nullable=False),
        sa.Column('lugar_entrega', sa.String(500), nullable=False),
        sa.Column('estado', estado_pedido, nullable=False, server_default='PENDIENTE'),
        sa.Column('pago', metodo_de_pago, nullable=False),
        sa.Column('monto_total', sa.Numeric(12, 2), nullable=False),
    )

    # DetallePedido
    op.create_table(
        'DetallePedido',
        sa.Column('detalle_pedido_id', sa.Integer, primary_key=True, autoincrement=True),
        sa.Column('cantidad', sa.Integer, nullable=False),
        sa.Column('precio_unitario', sa.Numeric(12, 2), nullable=False),
        sa.Column('Pedido_pedido_id', sa.Integer, sa.ForeignKey('Pedido.pedido_id'), nullable=False),
        sa.Column('Producto_producto_id', sa.Integer, sa.ForeignKey('Producto.producto_id'), nullable=False),
        sa.Column('sabor', JSONB, nullable=True),
        sa.Column('topping', JSONB, nullable=True),
        sa.Column('relleno', JSONB, nullable=True),
        sa.Column('notas', sa.String(1000), nullable=True),
    )

    # TokenRecuperacion
    op.create_table(
        'TokenRecuperacion',
        sa.Column('token_id', sa.Integer, primary_key=True, autoincrement=True),
        sa.Column('token', sa.String(255), nullable=False),
        sa.Column(
            'fecha_expiracion',
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("(NOW() + INTERVAL '15 minutes')"),
        ),
        sa.Column('utilizado', sa.Boolean, nullable=False),
        sa.Column('cuenta_id', sa.Integer, sa.ForeignKey('Cuenta.cuenta_id'), nullable=False),
    )


def downgrade() -> None:
    op.drop_table('TokenRecuperacion')
    op.drop_table('DetallePedido')
    op.drop_table('Pedido')
    op.drop_table('Producto')
    op.drop_table('Cuenta')
    op.drop_table('Persona')

    op.execute("DROP TYPE estado_pedido")
    op.execute("DROP TYPE metodo_de_pago")
    op.execute("DROP TYPE categoria_producto")
    op.execute("DROP TYPE rol_de_usuario")
