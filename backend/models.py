from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from database import Base


class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    fecha_creacion = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    metodos_pago = relationship("MetodoPago", back_populates="usuario")


class MetodoPago(Base):
    __tablename__ = "metodos_pago"

    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    tipo = Column(String, nullable=False)          # tarjeta, cuenta_bancaria, clabe, otro
    alias = Column(String, nullable=False)
    institucion = Column(String, nullable=False)
    moneda = Column(String, nullable=False)
    identificador_encriptado = Column(String, nullable=False)   # dato sensible, cifrado
    identificador_enmascarado = Column(String, nullable=False)  # ej. **** 1234
    estatus = Column(String, default="activo")      # activo / inactivo
    fecha_creacion = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    usuario = relationship("Usuario", back_populates="metodos_pago")


class LogAuditoria(Base):
    __tablename__ = "logs_auditoria"

    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=True)
    accion = Column(String, nullable=False)   # login, crear_metodo_pago, eliminar_metodo_pago, etc.
    detalle = Column(String, nullable=True)
    fecha = Column(DateTime, default=lambda: datetime.now(timezone.utc))