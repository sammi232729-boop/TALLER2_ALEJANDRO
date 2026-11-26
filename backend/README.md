# Backend FastAPI - Sistema de Gestión de Usuarios Hospitalarios

API REST desarrollada en **FastAPI** con arquitectura en 3 capas (`routers` -> `services` -> `repositories`) conectada a **MySQL** (`db_jeisonCuastumal_sebastianPerez`).

## Ejecución local

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Documentación interactiva Swagger: `http://localhost:8000/docs`
