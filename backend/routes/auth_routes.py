import json
from flask import Blueprint, request, jsonify
from sqlalchemy.exc import IntegrityError
from flask_jwt_extended import create_access_token
from flask_jwt_extended import jwt_required, get_jwt_identity


from extensions import db
from models import User, UserPreference
from security_utils import hash_password


auth_bp = Blueprint("auth", __name__, url_prefix="/auth")


def parse_json_list(value):
    if not value:
        return []
    if isinstance(value, list):
        return value
    try:
        parsed = json.loads(value)
        return parsed if isinstance(parsed, list) else []
    except (TypeError, json.JSONDecodeError):
        return []


def normalize_list_field(value):
    if value is None:
        return None
    if isinstance(value, list):
        return json.dumps(value)
    if isinstance(value, str):
        return json.dumps([item.strip() for item in value.split(",") if item.strip()])
    return None


@auth_bp.post("/register")
def register():
    """
    Register a new user
    ---
    tags:
      - Authentication
    consumes:
      - application/json
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          required:
            - first_name
            - last_name
            - email
            - password
            - phone_number
            - address
            - zip_code
            - city
            - country
            - role
          properties:
            first_name:
              type: string
              example: John
            last_name:
              type: string
              example: Doe
            email:
              type: string
              example: john.doe@example.com
            password:
              type: string
              example: StrongPass123
            phone_number:
              type: string
              example: "+33123456789"
            address:
              type: string
              example: 10 Rue de Paris
            zip_code:
              type: string
              example: "75001"
            city:
              type: string
              example: Paris
            country:
              type: string
              example: France
            role:
              type: string
              example: admin
              description: customer or admin
    responses:
      201:
        description: User registered successfully
      400:
        description: Validation error
      409:
        description: Email already exists
    """

    data = request.get_json(silent=True) or {}

    # Extract fields
    first_name = (data.get("first_name") or "").strip()
    last_name = (data.get("last_name") or "").strip()
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""
    phone_number = (data.get("phone_number") or "").strip()
    address = (data.get("address") or "").strip()
    zip_code = (data.get("zip_code") or "").strip()
    city = (data.get("city") or "").strip()
    country = (data.get("country") or "").strip()
    role = (data.get("role") or "customer").lower()

    # Validation
    errors = {}

    if role not in ["customer", "admin"]:
        errors["role"] = "role must be customer or admin"

    if not first_name:
        errors["first_name"] = "first_name is required"
    if not last_name:
        errors["last_name"] = "last_name is required"
    if not email:
        errors["email"] = "email is required"
    if not password:
        errors["password"] = "password is required"
    elif len(password) < 8:
        errors["password"] = "password must be at least 8 characters"
    if not phone_number:
        errors["phone_number"] = "phone_number is required"
    if not address:
        errors["address"] = "address is required"
    if not zip_code:
        errors["zip_code"] = "zip_code is required"
    if not city:
        errors["city"] = "city is required"
    if not country:
        errors["country"] = "country is required"

    if errors:
        return jsonify({"errors": errors}), 400

    # Check duplicate email
    if User.query.filter_by(email=email).first():
        return jsonify({"message": "Email already registered"}), 409

    # Create user
    user = User(
        first_name=first_name,
        last_name=last_name,
        email=email,
        password_hash=hash_password(password),
        phone_number=phone_number,
        address=address,
        zip_code=zip_code,
        city=city,
        state=(data.get("state") or "").strip() or None,
        country=country,
        role=role,
    )

    db.session.add(user)
    db.session.commit()

    return jsonify(
        {
            "message": "User registered successfully",
            "user": {
                "id": user.id,
                "email": user.email,
                "role": user.role,
            },
        }
    ), 201

@auth_bp.post("/login")
def login():
    """
    User login
    ---
    tags:
      - Authentication
    consumes:
      - application/json
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          required:
            - email
            - password
          properties:
            email:
              type: string
              example: john.doe@example.com
            password:
              type: string
              example: StrongPass123
    responses:
      200:
        description: Login successful
      400:
        description: Missing credentials
      401:
        description: Invalid email or password
    """

    data = request.get_json(silent=True) or {}

    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    # Validate input
    if not email or not password:
        return jsonify({"message": "Email and password are required"}), 400

    # Find user
    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({"message": "Invalid email or password"}), 401

    if user.status in {"inactive", "suspended"}:
        return jsonify({"message": "Account is inactive"}), 403

    # Verify password
    from security_utils import verify_password

    if not verify_password(password, user.password_hash):
        return jsonify({"message": "Invalid email or password"}), 401

    # Create JWT token
    
    access_token = create_access_token(identity=str(user.id))


    return jsonify({
        "access_token": access_token,
        "user": {
            "id": user.id,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name
        }
    }), 200

@auth_bp.get("/me")
@jwt_required()
def get_current_user():
    """
    Get current authenticated user
    ---
    tags:
      - Authentication
    security:
      - BearerAuth: []
    responses:
      200:
        description: Current user data
      401:
        description: Unauthorized
    """

    user_id = get_jwt_identity()

    user = User.query.get(user_id)

    if not user:
        return jsonify({"message": "User not found"}), 404

    return jsonify({
        "id": user.id,
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "phone_number": user.phone_number,
        "address": user.address,
        "zip_code": user.zip_code,
        "city": user.city,
        "state": user.state,
        "country": user.country,
    }), 200


@auth_bp.get("/preferences")
@jwt_required()
def get_preferences():
    """
    Get current user's dietary preferences and allergies
    ---
    tags:
      - Authentication
    security:
      - BearerAuth: []
    responses:
      200:
        description: Preferences
    """
    user_id = int(get_jwt_identity())

    prefs = UserPreference.query.filter_by(user_id=user_id).first()
    if not prefs:
        return jsonify({
            "halalOnly": False,
            "vegetarian": False,
            "vegan": False,
            "kosher": False,
            "allergies": []
        }), 200

    return jsonify({
        "halalOnly": prefs.halal_only,
        "vegetarian": prefs.vegetarian,
        "vegan": prefs.vegan,
        "kosher": prefs.kosher,
        "allergies": parse_json_list(prefs.allergies)
    }), 200


@auth_bp.put("/preferences")
@jwt_required()
def update_preferences():
    """
    Update current user's dietary preferences and allergies
    ---
    tags:
      - Authentication
    security:
      - BearerAuth: []
    responses:
      200:
        description: Preferences updated
    """
    user_id = int(get_jwt_identity())
    data = request.get_json(silent=True) or {}

    prefs = UserPreference.query.filter_by(user_id=user_id).first()
    if not prefs:
        prefs = UserPreference(user_id=user_id)
        db.session.add(prefs)

    prefs.halal_only = bool(data.get("halalOnly"))
    prefs.vegetarian = bool(data.get("vegetarian"))
    prefs.vegan = bool(data.get("vegan"))
    prefs.kosher = bool(data.get("kosher"))
    prefs.allergies = normalize_list_field(data.get("allergies")) or json.dumps([])

    db.session.commit()

    return jsonify({
        "message": "Preferences updated",
        "preferences": {
            "halalOnly": prefs.halal_only,
            "vegetarian": prefs.vegetarian,
            "vegan": prefs.vegan,
            "kosher": prefs.kosher,
            "allergies": parse_json_list(prefs.allergies)
        }
    }), 200


@auth_bp.put("/me")
@jwt_required()
def update_profile():
    """
    Update current user profile
    ---
    tags:
      - Authentication
    security:
      - BearerAuth: []
    responses:
      200:
        description: Profile updated
    """
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    data = request.get_json(silent=True) or {}
    first_name = data.get("first_name")
    last_name = data.get("last_name")
    email = data.get("email")
    phone_number = data.get("phone_number")
    address = data.get("address")
    zip_code = data.get("zip_code")
    city = data.get("city")
    state = data.get("state")
    country = data.get("country")

    errors = {}
    if first_name is not None and not str(first_name).strip():
        errors["first_name"] = "first_name cannot be empty"
    if last_name is not None and not str(last_name).strip():
        errors["last_name"] = "last_name cannot be empty"
    if email is not None and not str(email).strip():
        errors["email"] = "email cannot be empty"
    if phone_number is not None and not str(phone_number).strip():
        errors["phone_number"] = "phone_number cannot be empty"
    if address is not None and not str(address).strip():
        errors["address"] = "address cannot be empty"
    if zip_code is not None and not str(zip_code).strip():
        errors["zip_code"] = "zip_code cannot be empty"
    if city is not None and not str(city).strip():
        errors["city"] = "city cannot be empty"
    if country is not None and not str(country).strip():
        errors["country"] = "country cannot be empty"

    if errors:
        return jsonify({"errors": errors}), 400

    normalized_email = email.strip().lower() if isinstance(email, str) else None
    if normalized_email and normalized_email != user.email and User.query.filter_by(email=normalized_email).first():
        return jsonify({"message": "Email already registered"}), 409

    if first_name is not None:
        user.first_name = str(first_name).strip()
    if last_name is not None:
        user.last_name = str(last_name).strip()
    if normalized_email:
        user.email = normalized_email
    if phone_number is not None:
        user.phone_number = str(phone_number).strip()
    if address is not None:
        user.address = str(address).strip()
    if zip_code is not None:
        user.zip_code = str(zip_code).strip()
    if city is not None:
        user.city = str(city).strip()
    if state is not None:
        user.state = str(state).strip() or None
    if country is not None:
        user.country = str(country).strip()

    db.session.commit()

    return jsonify({
        "message": "Profile updated",
        "user": {
            "id": user.id,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "phone_number": user.phone_number,
            "address": user.address,
            "zip_code": user.zip_code,
            "city": user.city,
            "state": user.state,
            "country": user.country,
        }
    }), 200


@auth_bp.put("/password")
@jwt_required()
def change_password():
    """
    Change current user's password
    ---
    tags:
      - Authentication
    security:
      - BearerAuth: []
    responses:
      200:
        description: Password updated
    """
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    data = request.get_json(silent=True) or {}
    current_password = data.get("currentPassword") or ""
    new_password = data.get("newPassword") or ""

    from security_utils import verify_password, hash_password

    if not current_password or not new_password:
        return jsonify({"message": "currentPassword and newPassword are required"}), 400
    if len(new_password) < 8:
        return jsonify({"message": "newPassword must be at least 8 characters"}), 400
    if not verify_password(current_password, user.password_hash):
        return jsonify({"message": "Current password is incorrect"}), 401

    user.password_hash = hash_password(new_password)
    db.session.commit()

    return jsonify({"message": "Password updated"}), 200
