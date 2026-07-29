import os
from datetime import datetime, timedelta, timezone
from dotenv import load_dotenv
from passlib.context import CryptContext
from jose import jwt
from cryptography.fernet import Fernet

load_dotenv()

# --Contraseñas
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verificar_password(password_plano: str, password_hash: str) -> bool:
    return pwd_context.verify(password_plano, password_hash)


# -- Encriptación de datos sensibles
ENCRYPTION_KEY = os.getenv("ENCRYPTION_KEY").encode()
fernet = Fernet(ENCRYPTION_KEY)

def encriptar(texto: str) -> str:
    return fernet.encrypt(texto.encode()).decode()

def desencriptar(texto_encriptado: str) -> str:
    return fernet.decrypt(texto_encriptado.encode()).decode()

def enmascarar(identificador: str) -> str:
    # Muestra solo los últimos 4 dígitos, ej. **** 1234
    if len(identificador) <= 4:
        return "*" * len(identificador)
    return "*" * (len(identificador) - 4) + identificador[-4:]


# --Tokens JWT (sesión)
SECRET_KEY_JWT = os.getenv("SECRET_KEY_JWT")
ALGORITHM = "HS256"
TOKEN_EXPIRA_MINUTOS = 60

def crear_token(data: dict) -> str:
    to_encode = data.copy()
    expira = datetime.now(timezone.utc) + timedelta(minutes=TOKEN_EXPIRA_MINUTOS)
    to_encode.update({"exp": expira})
    return jwt.encode(to_encode, SECRET_KEY_JWT, algorithm=ALGORITHM)

def verificar_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY_JWT, algorithms=[ALGORITHM])
        return payload
    except Exception:
        return None