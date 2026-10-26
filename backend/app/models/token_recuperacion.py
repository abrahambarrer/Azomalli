"""Modelo ORM — TokenRecuperacion."""

from sqlalchemy import text

from app.database import db


class TokenRecuperacion(db.Model):
    """Token de un solo uso para recuperación de contraseña."""

    __tablename__ = "TokenRecuperacion"

    token_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    token = db.Column(db.String(255), nullable=False)
    fecha_expiracion = db.Column(
        db.DateTime(timezone=True),
        nullable=False,
        server_default=text("(NOW() + INTERVAL '15 minutes')"),
    )
    utilizado = db.Column(db.Boolean, nullable=False)
    cuenta_id = db.Column(
        db.Integer,
        db.ForeignKey("Cuenta.cuenta_id"),
        nullable=False,
    )

    # Relación
    cuenta = db.relationship("Cuenta", back_populates="tokens_recuperacion")

    def __repr__(self):
        return f"<TokenRecuperacion {self.token_id} — Cuenta {self.cuenta_id}>"
