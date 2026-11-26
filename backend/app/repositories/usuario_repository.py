from typing import Optional
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.models import Usuario


class UsuarioRepository:
    """Repositorio SQLAlchemy para operaciones CRUD sobre la tabla usuarios."""

    def __init__(self, db: Session) -> None:
        self.db = db

    def get_all(self) -> list[Usuario]:
        """Retorna todos los usuarios ordenados por ID descendente."""
        stmt = select(Usuario).order_by(Usuario.id.desc())
        return list(self.db.scalars(stmt).all())

    def get_by_id(self, usuario_id: int) -> Optional[Usuario]:
        """Busca un usuario por su clave primaria."""
        return self.db.get(Usuario, usuario_id)

    def get_by_identificacion(self, identificacion: str) -> Optional[Usuario]:
        """Busca un usuario por su número de identificación."""
        stmt = select(Usuario).where(Usuario.identificacion == identificacion)
        return self.db.scalar(stmt)

    def get_by_email(self, email: str) -> Optional[Usuario]:
        """Busca un usuario por su correo electrónico."""
        stmt = select(Usuario).where(Usuario.email == email)
        return self.db.scalar(stmt)

    def get_by_nombre_usuario(self, nombre_usuario: str) -> Optional[Usuario]:
        """Busca un usuario por su nombre de usuario."""
        stmt = select(Usuario).where(Usuario.nombre_usuario == nombre_usuario)
        return self.db.scalar(stmt)

    def create(self, usuario: Usuario) -> Usuario:
        """Persiste un nuevo usuario en la base de datos."""
        self.db.add(usuario)
        self.db.commit()
        self.db.refresh(usuario)
        return usuario

    def update(self, usuario: Usuario) -> Usuario:
        """Guarda los cambios realizados sobre un usuario existente."""
        self.db.commit()
        self.db.refresh(usuario)
        return usuario

    def delete(self, usuario: Usuario) -> None:
        """Elimina un usuario de la base de datos."""
        self.db.delete(usuario)
        self.db.commit()
