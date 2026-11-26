from typing import Optional
from fastapi import APIRouter, Depends, Header, Response, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import EstadoUpdate, UsuarioCreate, UsuarioResponse, UsuarioUpdate
from app.services.usuario_service import UsuarioService

router = APIRouter(prefix="/api/usuarios", tags=["Gestión de Usuarios"])


@router.get("", response_model=list[UsuarioResponse])
def listar_usuarios(db: Session = Depends(get_db)) -> list[UsuarioResponse]:
    """Lista todos los usuarios registrados en la base de datos."""
    service = UsuarioService(db)
    return [UsuarioResponse.model_validate(u) for u in service.list_usuarios()]


@router.get("/{usuario_id}", response_model=UsuarioResponse)
def obtener_usuario(usuario_id: int, db: Session = Depends(get_db)) -> UsuarioResponse:
    """Obtiene un usuario específico por su ID."""
    service = UsuarioService(db)
    return UsuarioResponse.model_validate(service.get_usuario(usuario_id))


@router.post("", response_model=UsuarioResponse, status_code=status.HTTP_201_CREATED)
def crear_usuario(payload: UsuarioCreate, db: Session = Depends(get_db)) -> UsuarioResponse:
    """Crea un nuevo usuario desde el módulo de gestión."""
    service = UsuarioService(db)
    return UsuarioResponse.model_validate(service.create_usuario(payload))


@router.put("/{usuario_id}", response_model=UsuarioResponse)
def actualizar_usuario(
    usuario_id: int,
    payload: UsuarioUpdate,
    x_user_id: Optional[int] = Header(default=None, alias="X-User-Id"),
    db: Session = Depends(get_db),
) -> UsuarioResponse:
    """Actualiza la información completa de un usuario (requiere rol Administrativo)."""
    service = UsuarioService(db)
    return UsuarioResponse.model_validate(service.update_usuario(usuario_id, payload, actor_id=x_user_id))


@router.patch("/{usuario_id}/estado", response_model=UsuarioResponse)
def cambiar_estado_usuario(
    usuario_id: int,
    payload: EstadoUpdate,
    x_user_id: Optional[int] = Header(default=None, alias="X-User-Id"),
    db: Session = Depends(get_db),
) -> UsuarioResponse:
    """Cambia el estado de un usuario entre Activado y Desactivado (requiere rol Administrativo)."""
    service = UsuarioService(db)
    return UsuarioResponse.model_validate(service.update_estado(usuario_id, payload, actor_id=x_user_id))


@router.delete("/{usuario_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_usuario(
    usuario_id: int,
    x_user_id: Optional[int] = Header(default=None, alias="X-User-Id"),
    db: Session = Depends(get_db),
) -> Response:
    """Elimina un usuario existente de la base de datos (requiere rol Administrativo)."""
    service = UsuarioService(db)
    service.delete_usuario(usuario_id, actor_id=x_user_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
