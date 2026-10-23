"""Modelo ORM — Persona."""

from app.database import db


class Persona(db.Model):
    """Datos personales de un usuario."""

    __tablename__ = "Persona"

    persona_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nombre = db.Column(db.String(100), nullable=False)
    primer_apellido = db.Column(db.String(50), nullable=False)
    segundo_apellido = db.Column(db.String(50), nullable=True)
    fecha_registro = db.Column(db.Date, nullable=False)

    # Relación uno-a-uno con Cuenta
    cuenta = db.relationship("Cuenta", back_populates="persona", uselist=False)

    def __repr__(self):
        return f"<Persona {self.persona_id}: {self.nombre} {self.primer_apellido}>"
