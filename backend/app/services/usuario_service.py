from typing import Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.models import Usuario
from app.repositories.usuario_repository import UsuarioRepository
from app.schemas import (
    EstadoUpdate,
    LoginRequest,
    RegisterRequest,
    UsuarioCreate,
    UsuarioUpdate,
)
from app.security import hash_password, verify_password


class UsuarioService:
    """Servicio con las reglas de negocio de autenticación y CRUD de usuarios."""

    def __init__(self, db: Session) -> None:
        self.repo = UsuarioRepository(db)

    def _validate_uniqueness(
        self,
        identificacion: str,
        email: str,
        nombre_usuario: str,
        exclude_id: Optional[int] = None,
    ) -> None:
        """Verifica que identificación, email y nombre de usuario no estén duplicados."""
        checks = [
            (self.repo.get_by_identificacion(identificacion), "El número de identificación ya está registrado."),
            (self.repo.get_by_email(email), "El correo electrónico ya está registrado."),
            (self.repo.get_by_nombre_usuario(nombre_usuario), "El nombre de usuario ya está en uso."),
        ]
        for existing, detail in checks:
            if existing is not None and existing.id != exclude_id:
                raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=detail)

    def _get_or_404(self, usuario_id: int) -> Usuario:
        """Obtiene un usuario por ID o lanza HTTP 404."""
        usuario = self.repo.get_by_id(usuario_id)
        if usuario is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No se encontró el usuario con id {usuario_id}.",
            )
        return usuario

    def authenticate(self, payload: LoginRequest) -> Usuario:
        """Valida credenciales usando identificación como usuario y verifica estado Activado."""
        usuario = self.repo.get_by_identificacion(payload.identificacion.strip())
        if usuario is None or not verify_password(payload.contrasena, usuario.contrasena):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Usuario o contraseña inválidos. Si no tiene cuenta, regístrese.",
            )
        if usuario.estado != "Activado":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Usuario desactivado. No tiene permiso para iniciar sesión.",
            )
        return usuario

    def register(self, payload: RegisterRequest) -> Usuario:
        """Registra un nuevo usuario habilitado por defecto (Activado)."""
        create_data = UsuarioCreate(**payload.model_dump(), estado="Activado")
        return self.create_usuario(create_data)

    def list_usuarios(self) -> list[Usuario]:
        """Lista todos los usuarios registrados."""
        return self.repo.get_all()

    def get_usuario(self, usuario_id: int) -> Usuario:
        """Obtiene el detalle de un usuario por ID."""
        return self._get_or_404(usuario_id)

    def create_usuario(self, payload: UsuarioCreate) -> Usuario:
        """Crea un usuario validando unicidad y cifrando su contraseña."""
        identificacion = payload.identificacion.strip()
        email = payload.email.strip().lower()
        nombre_usuario = payload.nombre_usuario.strip()

        self._validate_uniqueness(identificacion, email, nombre_usuario)

        nuevo = Usuario(
            identificacion=identificacion,
            nombre=payload.nombre.strip(),
            apellido=payload.apellido.strip(),
            email=email,
            cargo=payload.cargo,
            telefono=payload.telefono.strip(),
            nombre_usuario=nombre_usuario,
            contrasena=hash_password(payload.contrasena),
            estado=payload.estado,
        )
        return self.repo.create(nuevo)

    def update_usuario(self, usuario_id: int, payload: UsuarioUpdate) -> Usuario:
        """Actualiza los datos de un usuario existente."""
        usuario = self._get_or_404(usuario_id)
        identificacion = payload.identificacion.strip()
        email = payload.email.strip().lower()
        nombre_usuario = payload.nombre_usuario.strip()

        self._validate_uniqueness(identificacion, email, nombre_usuario, exclude_id=usuario_id)

        usuario.identificacion = identificacion
        usuario.nombre = payload.nombre.strip()
        usuario.apellido = payload.apellido.strip()
        usuario.email = email
        usuario.cargo = payload.cargo
        usuario.telefono = payload.telefono.strip()
        usuario.nombre_usuario = nombre_usuario
        usuario.estado = payload.estado
        if payload.contrasena:
            usuario.contrasena = hash_password(payload.contrasena)

        return self.repo.update(usuario)

    def update_estado(self, usuario_id: int, payload: EstadoUpdate) -> Usuario:
        """Cambia el estado del usuario entre Activado y Desactivado."""
        usuario = self._get_or_404(usuario_id)
        usuario.estado = payload.estado
        return self.repo.update(usuario)

    def delete_usuario(self, usuario_id: int) -> None:
        """Elimina un usuario existente."""
        usuario = self._get_or_404(usuario_id)
        self.repo.delete(usuario)
