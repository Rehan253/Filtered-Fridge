from functools import wraps
from flask import jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from models import User


def admin_required(fn):
    """
    Allows access only to admin users
    """
    @wraps(fn)
    @jwt_required()
    def wrapper(*args, **kwargs):
        user_id = int(get_jwt_identity())

        user = User.query.get(user_id)
        if not user:
            return jsonify({"message": "User not found"}), 404

        if user.role != "admin":
            return jsonify({"message": "Admin access required"}), 403

        return fn(*args, **kwargs)

    return wrapper
