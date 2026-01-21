import json
from datetime import datetime

from flask import Blueprint, jsonify, request
from sqlalchemy import func

from extensions import db
from models import Promotion
from security.authorization import admin_required


admin_promotions_bp = Blueprint("admin_promotions", __name__, url_prefix="/admin/promotions")


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


def normalize_categories(value):
    if value is None:
        return json.dumps(["All"])
    if isinstance(value, list):
        return json.dumps(value if value else ["All"])
    if isinstance(value, str):
        parts = [item.strip() for item in value.split(",") if item.strip()]
        return json.dumps(parts if parts else ["All"])
    return json.dumps(["All"])


def parse_date(value):
    if not value:
        return None
    if isinstance(value, datetime):
        return value.date()
    try:
        return datetime.fromisoformat(value).date()
    except ValueError:
        return None


def serialize_promotion(promotion):
    return {
        "id": promotion.id,
        "title": promotion.title,
        "description": promotion.description,
        "discountType": promotion.discount_type,
        "discountValue": float(promotion.discount_value),
        "startDate": promotion.start_date.isoformat(),
        "endDate": promotion.end_date.isoformat(),
        "categories": parse_json_list(promotion.categories),
        "minPurchase": float(promotion.min_purchase),
        "status": promotion.status,
        "promoCode": promotion.promo_code,
        "image": promotion.image_url,
        "icon": promotion.icon,
    }


@admin_promotions_bp.get("")
@admin_required
def list_promotions():
    search = (request.args.get("search") or "").strip().lower()
    status = (request.args.get("status") or "").strip().lower()

    query = Promotion.query

    if search:
        query = query.filter(
            func.lower(Promotion.title).like(f"%{search}%")
            | func.lower(Promotion.description).like(f"%{search}%")
            | func.lower(Promotion.promo_code).like(f"%{search}%")
        )

    if status in {"active", "inactive"}:
        query = query.filter(Promotion.status == status)

    promotions = query.order_by(Promotion.created_at.desc()).all()

    return jsonify([serialize_promotion(promo) for promo in promotions]), 200


@admin_promotions_bp.post("")
@admin_required
def create_promotion():
    data = request.get_json(silent=True) or {}

    title = (data.get("title") or "").strip()
    description = (data.get("description") or "").strip()
    discount_type = (data.get("discountType") or data.get("discount_type") or "").strip().lower()
    discount_value = data.get("discountValue")
    min_purchase = data.get("minPurchase", 0)
    start_date = parse_date(data.get("startDate") or data.get("start_date"))
    end_date = parse_date(data.get("endDate") or data.get("end_date"))
    categories = data.get("categories")
    status = (data.get("status") or "active").strip().lower()
    promo_code = (data.get("promoCode") or data.get("promo_code") or "").strip() or None
    image_url = (data.get("image") or data.get("image_url") or "").strip() or None
    icon = (data.get("icon") or "").strip() or None

    errors = {}
    if not title:
        errors["title"] = "title is required"
    if not description:
        errors["description"] = "description is required"
    if discount_type not in {"percentage", "fixed", "shipping", "bogo"}:
        errors["discountType"] = "discountType must be percentage, fixed, shipping, or bogo"
    if discount_type != "shipping":
        try:
            discount_value = float(discount_value)
            if discount_value <= 0:
                errors["discountValue"] = "discountValue must be greater than 0"
        except (TypeError, ValueError):
            errors["discountValue"] = "discountValue is required"
    else:
        discount_value = 0.0
    try:
        min_purchase = float(min_purchase or 0)
    except (TypeError, ValueError):
        errors["minPurchase"] = "minPurchase must be a number"
    if not start_date:
        errors["startDate"] = "startDate is required"
    if not end_date:
        errors["endDate"] = "endDate is required"
    if start_date and end_date and end_date < start_date:
        errors["endDate"] = "endDate must be after startDate"
    if status not in {"active", "inactive"}:
        errors["status"] = "status must be active or inactive"

    if errors:
        return jsonify({"errors": errors}), 400

    promotion = Promotion(
        title=title,
        description=description,
        discount_type=discount_type,
        discount_value=discount_value,
        min_purchase=min_purchase,
        start_date=start_date,
        end_date=end_date,
        categories=normalize_categories(categories),
        status=status,
        promo_code=promo_code,
        image_url=image_url,
        icon=icon,
    )

    db.session.add(promotion)
    db.session.commit()

    return jsonify(serialize_promotion(promotion)), 201


@admin_promotions_bp.get("/<int:promotion_id>")
@admin_required
def get_promotion(promotion_id):
    promotion = Promotion.query.get(promotion_id)
    if not promotion:
        return jsonify({"message": "Promotion not found"}), 404

    return jsonify(serialize_promotion(promotion)), 200


@admin_promotions_bp.put("/<int:promotion_id>")
@admin_required
def update_promotion(promotion_id):
    promotion = Promotion.query.get(promotion_id)
    if not promotion:
        return jsonify({"message": "Promotion not found"}), 404

    data = request.get_json(silent=True) or {}

    title = (data.get("title") or "").strip()
    description = (data.get("description") or "").strip()
    discount_type = (data.get("discountType") or data.get("discount_type") or "").strip().lower()
    discount_value = data.get("discountValue")
    min_purchase = data.get("minPurchase", promotion.min_purchase)
    start_date = parse_date(data.get("startDate") or data.get("start_date"))
    end_date = parse_date(data.get("endDate") or data.get("end_date"))
    categories = data.get("categories")
    status = (data.get("status") or promotion.status).strip().lower()
    promo_code = (data.get("promoCode") or data.get("promo_code") or promotion.promo_code or "").strip() or None
    image_url = (data.get("image") or data.get("image_url") or promotion.image_url or "").strip() or None
    icon = (data.get("icon") or promotion.icon or "").strip() or None

    errors = {}
    if not title:
        errors["title"] = "title is required"
    if not description:
        errors["description"] = "description is required"
    if discount_type not in {"percentage", "fixed", "shipping", "bogo"}:
        errors["discountType"] = "discountType must be percentage, fixed, shipping, or bogo"
    if discount_type != "shipping":
        try:
            discount_value = float(discount_value)
            if discount_value <= 0:
                errors["discountValue"] = "discountValue must be greater than 0"
        except (TypeError, ValueError):
            errors["discountValue"] = "discountValue is required"
    else:
        discount_value = 0.0
    try:
        min_purchase = float(min_purchase or 0)
    except (TypeError, ValueError):
        errors["minPurchase"] = "minPurchase must be a number"
    if not start_date:
        errors["startDate"] = "startDate is required"
    if not end_date:
        errors["endDate"] = "endDate is required"
    if start_date and end_date and end_date < start_date:
        errors["endDate"] = "endDate must be after startDate"
    if status not in {"active", "inactive"}:
        errors["status"] = "status must be active or inactive"

    if errors:
        return jsonify({"errors": errors}), 400

    promotion.title = title
    promotion.description = description
    promotion.discount_type = discount_type
    promotion.discount_value = discount_value
    promotion.min_purchase = min_purchase
    promotion.start_date = start_date
    promotion.end_date = end_date
    promotion.categories = normalize_categories(categories)
    promotion.status = status
    promotion.promo_code = promo_code
    promotion.image_url = image_url
    promotion.icon = icon

    db.session.commit()

    return jsonify(serialize_promotion(promotion)), 200


@admin_promotions_bp.delete("/<int:promotion_id>")
@admin_required
def delete_promotion(promotion_id):
    promotion = Promotion.query.get(promotion_id)
    if not promotion:
        return jsonify({"message": "Promotion not found"}), 404

    db.session.delete(promotion)
    db.session.commit()

    return jsonify({"message": "Promotion deleted"}), 200
