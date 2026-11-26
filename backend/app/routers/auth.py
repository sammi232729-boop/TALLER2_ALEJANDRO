from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import LoginRequest, LoginResponse, RegisterRequest, UsuarioResponse
from app.services.usuario_service import UsuarioService

router = APIRouter(prefix="/api/auth", tags=["Autenticación"])


@router.post("/login", response_model=LoginResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)) -> LoginResponse:
    """Inicia sesión validando identificación, contraseña y estado Activado."""
    service = UsuarioService(db)
    usuario = service.authenticate(payload)
    return LoginResponse(
        mensaje="Inicio de sesión exitoso.",
        usuario=UsuarioResponse.model_validate(usuario),
    )


@router.post("/register", response_model=UsuarioResponse, status_code=status.HTTP_201_CREATED)
def register(payload: RegisterRequest, db: Session = Depends(get_db)) -> UsuarioResponse:
    """Registra una nueva cuenta de usuario habilitada para iniciar sesión."""
    service = UsuarioService(db)
    usuario = service.register(payload)
    return UsuarioResponse.model_validate(usuario)
