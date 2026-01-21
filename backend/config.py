import os
from datetime import timedelta


class Config:
    """
    Application configuration.
    This file holds settings for database, JWT authentication, and Swagger.
    """

    # ===============================
    # Database configuration
    # ===============================

    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL",
        "sqlite:///trinity_grocery.db",
    )

    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # ===============================
    # Flask core security
    # ===============================

    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key")

    # ===============================
    # JWT Authentication configuration
    # ===============================

    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")

    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)

    # ===============================
    # Swagger configuration
    # ===============================

    SWAGGER = {
        "title": "Trinity Grocery API",
        "uiversion": 3
    }
