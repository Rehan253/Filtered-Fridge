from flask import Blueprint, jsonify, request
from sqlalchemy import func, or_

from extensions import db
from models import User, Invoice
from security.authorization import admin_required


admin_users_bp = Blueprint("admin_users", __name__, url_prefix="/admin/users")


def build_address(user):
    parts = [user.address, user.city, user.zip_code, user.country]
    return ", ".join([part for part in parts if part])


def serialize_user_row(row):
    user = row.User
    return {
        "id": user.id,
        "name": f"{user.first_name} {user.last_name}".strip(),
        "email": user.email,
        "phone": user.phone_number,
        "role": user.role,
        "status": user.status or "active",
        "joinDate": user.created_at.isoformat() if user.created_at else None,
        "totalOrders": int(row.total_orders or 0),
        "totalSpent": float(row.total_spent or 0),
        "lastOrderDate": row.last_order_date.isoformat() if row.last_order_date else None,
        "address": build_address(user),
    }


@admin_users_bp.get("")
@admin_required
def list_users():
    """
    List users for admin table
    ---
    tags:
      - Admin
    parameters:
      - in: query
        name: search
        type: string
      - in: query
        name: role
        type: string
      - in: query
        name: status
        type: string
      - in: query
        name: sort
        type: string
      - in: query
        name: order
        type: string
      - in: query
        name: page
        type: integer
      - in: query
        name: page_size
        type: integer
    responses:
      200:
        description: Users list
    """
    search = (request.args.get("search") or "").strip().lower()
    role = (request.args.get("role") or "").strip().lower()
    status = (request.args.get("status") or "").strip().lower()
    sort_field = (request.args.get("sort") or "name").strip().lower()
    sort_order = (request.args.get("order") or "asc").strip().lower()

    try:
        page = max(int(request.args.get("page", 1)), 1)
    except ValueError:
        page = 1
    try:
        page_size = max(min(int(request.args.get("page_size", 50)), 200), 1)
    except ValueError:
        page_size = 50

    query = (
        db.session.query(
            User,
            func.count(Invoice.id).label("total_orders"),
            func.coalesce(func.sum(Invoice.total_amount), 0).label("total_spent"),
            func.max(Invoice.created_at).label("last_order_date"),
        )
        .outerjoin(Invoice, Invoice.user_id == User.id)
        .group_by(User.id)
    )

    if search:
        query = query.filter(
            or_(
                func.lower(User.first_name).like(f"%{search}%"),
                func.lower(User.last_name).like(f"%{search}%"),
                func.lower(User.email).like(f"%{search}%"),
                User.phone_number.like(f"%{search}%"),
            )
        )

    if role in {"customer", "admin"}:
        query = query.filter(User.role == role)

    if status in {"active", "inactive", "suspended"}:
        query = query.filter(User.status == status)

    sort_map = {
        "name": func.lower(User.first_name),
        "email": func.lower(User.email),
        "role": User.role,
        "status": User.status,
        "totalorders": func.count(Invoice.id),
        "totalspent": func.coalesce(func.sum(Invoice.total_amount), 0),
        "joindate": User.created_at,
        "lastorderdate": func.max(Invoice.created_at),
    }
    sort_expr = sort_map.get(sort_field, func.lower(User.first_name))
    sort_expr = sort_expr.desc() if sort_order == "desc" else sort_expr.asc()

    total_count = query.count()
    rows = query.order_by(sort_expr).offset((page - 1) * page_size).limit(page_size).all()

    return jsonify(
        {
            "data": [serialize_user_row(row) for row in rows],
            "count": total_count,
            "page": page,
            "page_size": page_size,
        }
    ), 200


@admin_users_bp.get("/<int:user_id>")
@admin_required
def get_user(user_id):
    """
    Get user details for admin
    ---
    tags:
      - Admin
    responses:
      200:
        description: User detail
      404:
        description: User not found
    """
    row = (
        db.session.query(
            User,
            func.count(Invoice.id).label("total_orders"),
            func.coalesce(func.sum(Invoice.total_amount), 0).label("total_spent"),
            func.max(Invoice.created_at).label("last_order_date"),
        )
        .outerjoin(Invoice, Invoice.user_id == User.id)
        .filter(User.id == user_id)
        .group_by(User.id)
        .first()
    )

    if not row:
        return jsonify({"message": "User not found"}), 404

    return jsonify(serialize_user_row(row)), 200


@admin_users_bp.patch("/<int:user_id>")
@admin_required
def update_user(user_id):
    """
    Update user (status only)
    ---
    tags:
      - Admin
    responses:
      200:
        description: User updated
      400:
        description: Validation error
      404:
        description: User not found
    """
    data = request.get_json(silent=True) or {}
    new_status = (data.get("status") or "").strip().lower()

    if new_status not in {"active", "inactive", "suspended"}:
        return jsonify({"message": "status must be active, inactive, or suspended"}), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    user.status = new_status
    db.session.commit()

    return jsonify({"message": "User updated", "status": user.status}), 200
