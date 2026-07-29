from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import List

import models, schemas
from database import engine, get_db
from security import (
    hash_password, verificar_password,
    encriptar, desencriptar, enmascarar,
    crear_token,
)
from auth import obtener_usuario_actual

# Crea las tablas en la base de datos si no existen
#models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Wallet API")

# Permite que el frontend (React, en otro puerto) pueda llamar a esta API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def registrar_log(db: Session, usuario_id: int, accion: str, detalle: str = None):
    log = models.LogAuditoria(usuario_id=usuario_id, accion=accion, detalle=detalle)
    db.add(log)
    db.commit()


# -- REGISTRO
@app.post("/registro", response_model=schemas.UsuarioRespuesta, status_code=201)
def registro(datos: schemas.UsuarioCrear, db: Session = Depends(get_db)):
    existente = db.query(models.Usuario).filter(models.Usuario.email == datos.email).first()
    if existente:
        raise HTTPException(status_code=400, detail="Ese correo ya está registrado")

    nuevo_usuario = models.Usuario(
        email=datos.email,
        password_hash=hash_password(datos.password),
    )
    db.add(nuevo_usuario)
    db.commit()
    db.refresh(nuevo_usuario)

    registrar_log(db, nuevo_usuario.id, "registro", f"Usuario {datos.email} creado")
    return nuevo_usuario


# -- LOGIN
@app.post("/login", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    usuario = db.query(models.Usuario).filter(models.Usuario.email == form_data.username).first()

    if not usuario or not verificar_password(form_data.password, usuario.password_hash):
        raise HTTPException(status_code=401, detail="Correo o contraseña incorrectos")

    token = crear_token({"sub": str(usuario.id)})
    registrar_log(db, usuario.id, "login", "Inicio de sesión exitoso")
    return {"access_token": token, "token_type": "bearer"}


# -- PERFIL
@app.get("/perfil", response_model=schemas.UsuarioRespuesta)
def perfil(usuario_actual: models.Usuario = Depends(obtener_usuario_actual)):
    return usuario_actual


# -- CREAR MÉTODO DE PAGO
@app.post("/metodos-pago", response_model=schemas.MetodoPagoRespuesta, status_code=201)
def crear_metodo_pago(
    datos: schemas.MetodoPagoCrear,
    usuario_actual: models.Usuario = Depends(obtener_usuario_actual),
    db: Session = Depends(get_db),
):
    # Prevenir duplicados: mismo usuario + mismo identificador
    identificador_enc_existente = None
    metodos_usuario = db.query(models.MetodoPago).filter(
        models.MetodoPago.usuario_id == usuario_actual.id
    ).all()
    for m in metodos_usuario:
        if desencriptar(m.identificador_encriptado) == datos.identificador:
            raise HTTPException(status_code=400, detail="Ese método de pago ya está registrado")

    nuevo_metodo = models.MetodoPago(
        usuario_id=usuario_actual.id,
        tipo=datos.tipo,
        alias=datos.alias,
        institucion=datos.institucion,
        moneda=datos.moneda,
        identificador_encriptado=encriptar(datos.identificador),
        identificador_enmascarado=enmascarar(datos.identificador),
        estatus="activo",
    )
    db.add(nuevo_metodo)
    db.commit()
    db.refresh(nuevo_metodo)

    registrar_log(db, usuario_actual.id, "crear_metodo_pago", f"Alias: {datos.alias}")
    return nuevo_metodo


# -- LISTAR MÉTODOS DE PAGO
@app.get("/metodos-pago", response_model=List[schemas.MetodoPagoRespuesta])
def listar_metodos_pago(
    usuario_actual: models.Usuario = Depends(obtener_usuario_actual),
    db: Session = Depends(get_db),
):
    return db.query(models.MetodoPago).filter(
        models.MetodoPago.usuario_id == usuario_actual.id,
        models.MetodoPago.estatus == "activo",
    ).all()


# -- DETALLE DE UN MÉTODO DE PAGO
@app.get("/metodos-pago/{metodo_id}", response_model=schemas.MetodoPagoDetalle)
def detalle_metodo_pago(
    metodo_id: int,
    usuario_actual: models.Usuario = Depends(obtener_usuario_actual),
    db: Session = Depends(get_db),
):
    metodo = db.query(models.MetodoPago).filter(
        models.MetodoPago.id == metodo_id,
        models.MetodoPago.usuario_id == usuario_actual.id,
    ).first()

    if not metodo:
        raise HTTPException(status_code=404, detail="Método de pago no encontrado")

    registrar_log(db, usuario_actual.id, "ver_detalle_metodo_pago", f"Metodo id {metodo_id}")

    return schemas.MetodoPagoDetalle(
        id=metodo.id,
        tipo=metodo.tipo,
        alias=metodo.alias,
        institucion=metodo.institucion,
        moneda=metodo.moneda,
        identificador_enmascarado=metodo.identificador_enmascarado,
        identificador=desencriptar(metodo.identificador_encriptado),
        estatus=metodo.estatus,
        fecha_creacion=metodo.fecha_creacion,
    )


# -- ELIMINAR (DESACTIVAR) MÉTODO DE PAGO
@app.delete("/metodos-pago/{metodo_id}", status_code=204)
def eliminar_metodo_pago(
    metodo_id: int,
    usuario_actual: models.Usuario = Depends(obtener_usuario_actual),
    db: Session = Depends(get_db),
):
    metodo = db.query(models.MetodoPago).filter(
        models.MetodoPago.id == metodo_id,
        models.MetodoPago.usuario_id == usuario_actual.id,
    ).first()

    if not metodo:
        raise HTTPException(status_code=404, detail="Método de pago no encontrado")

    metodo.estatus = "inactivo"  # soft delete: no se borra, se desactiva
    db.commit()

    registrar_log(db, usuario_actual.id, "eliminar_metodo_pago", f"Metodo id {metodo_id}")
    return None