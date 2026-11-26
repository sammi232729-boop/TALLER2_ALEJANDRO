from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.orm import Session
from app.config import settings
from app.database import get_db
from app.routers import auth, usuarios

app = FastAPI(
    title="API Gestión de Usuarios Hospitalarios",
    description="Backend FastAPI en arquitectura de 3 capas para el Examen 2 de Computación Gráfica.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(usuarios.router)


@app.get("/api/health", tags=["Sistema"])
def health_check(db: Session = Depends(get_db)) -> dict[str, str]:
    """Verifica disponibilidad del API y conexión activa a MySQL."""
    db.execute(text("SELECT 1"))
    return {"status": "ok", "database": settings.db_name}
