from datetime import datetime
from typing import Literal, Optional
from pydantic import BaseModel, ConfigDict, EmailStr, Field


CargoTipo = Literal["Doctor", "Especialista", "Administrativo"]
EstadoTipo = Literal["Activado", "Desactivado"]


class LoginRequest(BaseModel):
    """Esquema de entrada para inicio de sesión (usuario = identificación)."""

    identificacion: str = Field(..., min_length=1, max_length=30)
    contrasena: str = Field(..., min_length=1, max_length=128)


class RegisterRequest(BaseModel):
    """Esquema de registro público de un nuevo usuario."""

    identificacion: str = Field(..., min_length=3, max_length=30)
    nombre: str = Field(..., min_length=2, max_length=100)
    apellido: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    cargo: CargoTipo
    telefono: str = Field(..., min_length=7, max_length=30)
    nombre_usuario: str = Field(..., min_length=3, max_length=80)
    contrasena: str = Field(..., min_length=6, max_length=128)


class UsuarioCreate(RegisterRequest):
    """Esquema de creación de usuario desde el panel de gestión."""

    estado: EstadoTipo = "Activado"


class UsuarioUpdate(BaseModel):
    """Esquema de actualización de datos de un usuario."""

    identificacion: str = Field(..., min_length=3, max_length=30)
    nombre: str = Field(..., min_length=2, max_length=100)
    apellido: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    cargo: CargoTipo
    telefono: str = Field(..., min_length=7, max_length=30)
    nombre_usuario: str = Field(..., min_length=3, max_length=80)
    contrasena: Optional[str] = Field(default=None, min_length=6, max_length=128)
    estado: EstadoTipo = "Activado"


class EstadoUpdate(BaseModel):
    """Esquema para actualizar únicamente el estado del usuario."""

    estado: EstadoTipo


class UsuarioResponse(BaseModel):
    """Esquema de salida pública del usuario sin contraseña."""

    id: int
    identificacion: str
    nombre: str
    apellido: str
    email: EmailStr
    cargo: CargoTipo
    telefono: str
    nombre_usuario: str
    estado: EstadoTipo
    fecha_creacion: Optional[datetime] = None
    fecha_actualizacion: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class LoginResponse(BaseModel):
    """Respuesta exitosa del endpoint de inicio de sesión."""

    mensaje: str
    usuario: UsuarioResponse
