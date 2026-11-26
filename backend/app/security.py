import hashlib
import hmac
import secrets


PBKDF2_ITERATIONS = 100_000


def hash_password(password: str) -> str:
    """Genera un hash PBKDF2-HMAC-SHA256 con salt aleatorio en formato salt$hash."""
    salt = secrets.token_hex(16)
    derived = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        bytes.fromhex(salt),
        PBKDF2_ITERATIONS,
    ).hex()
    return f"{salt}${derived}"


def verify_password(plain_password: str, stored_hash: str) -> bool:
    """Verifica una contraseña en texto plano contra el hash almacenado."""
    if "$" not in stored_hash:
        return False
    salt, expected_hex = stored_hash.split("$", 1)
    try:
        salt_bytes = bytes.fromhex(salt)
    except ValueError:
        return False
    derived = hashlib.pbkdf2_hmac(
        "sha256",
        plain_password.encode("utf-8"),
        salt_bytes,
        PBKDF2_ITERATIONS,
    ).hex()
    return hmac.compare_digest(derived, expected_hex)
