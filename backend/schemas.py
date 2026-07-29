from pydantic import BaseModel, EmailStr, ConfigDict
from datetime import datetime
from typing import Optional


# -- Usuario
class UsuarioCrear(BaseModel):
    email: EmailStr
    password: str


class UsuarioLogin(BaseModel):
    email: EmailStr
    password: str


class UsuarioRespuesta(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: EmailStr
    fecha_creacion: datetime


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


# -- Métodos de pago
class MetodoPagoCrear(BaseModel):
    tipo: str          # tarjeta, cuenta_bancaria, clabe, otro
    alias: str
    institucion: str
    moneda: str
    identificador: str  # dato sensible, en texto plano SOLO al entrar, luego se encripta


class MetodoPagoRespuesta(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    tipo: str
    alias: str
    institucion: str
    moneda: str
    identificador_enmascarado: str
    estatus: str
    fecha_creacion: datetime


class MetodoPagoDetalle(MetodoPagoRespuesta):
    identificador: str  # aquí sí incluimos el dato desencriptado, solo para el detalle