# Examen 2 - Computación Gráfica (Universidad de Nariño)

Sistema web de **Gestión de Cuentas de Usuario Hospitalario** desarrollado bajo una arquitectura de **3 capas** (`Frontend Angular + PrimeNG -> Backend FastAPI -> Base de Datos MySQL`).

## Estructura del repositorio

- `DB/` — Script SQL (`db_jeisonCuastumal_sebastianPerez.sql`) para crear la base de datos `db_jeisonCuastumal_sebastianPerez`, la tabla `usuarios` y los registros iniciales de prueba.
- `backend/` — API REST en **FastAPI** organizada en capas (`routers/`, `services/`, `repositories/`, `models.py`, `schemas.py`, `security.py`).
- `frontend/` — Aplicación SPA en **Angular 18** con librería de componentes **PrimeNG 17** (Login, Registro y Gestión CRUD de usuarios con control de estado `Activado` / `Desactivado`).
- `Plantilla_Promts_Examen2.docx` — Documentación de los 10 prompts utilizados y pasos de implementación.

## Puesta en marcha rápida

1. **Base de datos (MySQL / XAMPP):**
   - Iniciar el servicio MySQL en el puerto `3306`.
   - Ejecutar el script `DB/db_jeisonCuastumal_sebastianPerez.sql`.
2. **Backend (FastAPI):**
   ```bash
   cd backend
   python -m venv .venv
   .venv\Scripts\activate
   pip install -r requirements.txt
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```
3. **Frontend (Angular + PrimeNG):**
   ```bash
   cd frontend
   npm install
   npm start
   ```
   Abrir `http://localhost:4200`.

## Credenciales iniciales de prueba

- **Usuario activo (Administrativo):** Identificación `1001` | Contraseña `Admin123!`
- **Usuario activo (Doctor):** Identificación `1002` | Contraseña `Doctor123!`
- **Usuario desactivado (prueba de bloqueo):** Identificación `1003` | Contraseña `Inactivo123!`
