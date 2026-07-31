# Wallet segura de métodos de pago

Aplicación web que permite a un usuario registrarse, iniciar sesión y administrar sus métodos de pago de forma segura.

## Tecnologías

- **Backend:** Python + FastAPI + SQLAlchemy
- **Frontend:** React + Vite
- **Base de datos:** SQLite
- **Autenticación:** JWT (OAuth2 Password Flow)
- **Encriptación:** Fernet (cryptography) para datos sensibles
- **Migraciones:** Alembic

## Arquitectura

```
wallet-app/
├── backend/
│   ├── main.py          # Endpoints de la API
│   ├── models.py        # Modelos de base de datos (SQLAlchemy)
│   ├── schemas.py        # Esquemas de entrada/salida (Pydantic)
│   ├── database.py       # Configuración de conexión a la base de datos
│   ├── security.py       # Hash de contraseñas, encriptación, JWT
│   ├── auth.py           # Verificación de sesión (rutas protegidas)
│   ├── alembic/          # Migraciones de base de datos
│   ├── requirements.txt
│   └── .env.example
└── frontend/
    └── src/
        ├── api/          # Configuración de axios
        ├── context/      # Estado global de autenticación
        └── pages/        # Pantallas de la aplicación
```

## Funcionalidades

- Registro e inicio de sesión de usuarios
- Consulta de perfil autenticado
- Alta, listado, detalle y eliminación (soft delete) de métodos de pago
- Prevención de métodos de pago duplicados por usuario
- Encriptación del identificador sensible (ej. número de tarjeta) en la base de datos
- Enmascaramiento del identificador en listados (solo se ve completo en el detalle)
- Registro de trazabilidad (auditoría) de acciones relevantes: registro, login, alta, consulta de detalle y eliminación

## Seguridad

- Las contraseñas se almacenan con hash bcrypt, nunca en texto plano
- El identificador del método de pago se guarda encriptado (Fernet) en la base de datos
- Las rutas sensibles requieren un token JWT válido
- Las variables sensibles (llaves de encriptación y JWT) se manejan por variables de entorno, fuera del control de versiones

## Cómo levantar el proyecto

### Requisitos previos

- Python 3.11+
- Node.js 18+

### Backend

```bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\Activate.ps1
# Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
```

Crea un archivo `.env` (basado en `.env.example`) con tus propias llaves. Para generar una llave de encriptación válida:

```bash
python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
```

Aplica las migraciones (esto crea `wallet.db` con toda la estructura de tablas):

```bash
alembic upgrade head
```

Corre el servidor:

```bash
uvicorn main:app --reload
```

La API queda disponible en `http://127.0.0.1:8000`, y la documentación interactiva en `http://127.0.0.1:8000/docs`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

La aplicación queda disponible en `http://localhost:5173`.

## Notas

- Las tablas se gestionan con **Alembic**. Corre `alembic upgrade head` dentro de `backend/` para crear `wallet.db` con la estructura completa antes de levantar el servidor.
