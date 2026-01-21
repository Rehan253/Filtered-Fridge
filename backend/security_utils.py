from passlib.context import CryptContext

# Use PBKDF2-SHA256 (stable, no length limits, Python 3.12 safe)
pwd_context = CryptContext(
    schemes=["pbkdf2_sha256"],
    deprecated="auto"
)


def hash_password(password: str) -> str:
    """
    Hash password securely using PBKDF2-SHA256.
    """
    return pwd_context.hash(password)


def verify_password(password: str, hashed_password: str) -> bool:
    """
    Verify password against stored hash.
    """
    return pwd_context.verify(password, hashed_password)
