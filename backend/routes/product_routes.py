import json
from flask import Blueprint, jsonify
from models import Product
from flask import request
from flask_jwt_extended import jwt_required
from extensions import db
from security.authorization import admin_required

product_bp = Blueprint("products", __name__, url_prefix="/products")

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

def serialize_product(product):
    return {
        "id": product.id,
        "name": product.name,
        "brand": product.brand,
        "category": product.category,
        "description": product.description,
        "unit": product.unit,
        "price": float(product.price),
        "originalPrice": float(product.original_price) if product.original_price is not None else None,
        "discount": float(product.discount) if product.discount is not None else None,
        "quantity_in_stock": product.quantity_in_stock,
        "picture_url": product.picture_url,
        "icon": product.icon,
        "nutritional_info": product.nutritional_info,
        "ingredients": parse_json_list(product.ingredients),
        "dietaryTags": parse_json_list(product.dietary_tags),
        "rating": float(product.rating) if product.rating is not None else None,
        "reviews": product.reviews,
        "created_at": product.created_at.isoformat()
    }

@product_bp.get("/")
def get_products():
    """
    Get all products
    ---
    tags:
      - Products
    responses:
      200:
        description: List of products
    """

    products = Product.query.all()

    return jsonify([serialize_product(product) for product in products]), 200


@product_bp.get("/<int:product_id>")
def get_product_by_id(product_id):
    """
    Get product by ID
    ---
    tags:
      - Products
    parameters:
      - name: product_id
        in: path
        type: integer
        required: true
        description: ID of the product
    responses:
      200:
        description: Product found
      404:
        description: Product not found
    """

    # Fetch product by ID
    product = Product.query.get(product_id)

    # If product does not exist
    if not product:
        return jsonify({"message": "Product not found"}), 404

    # Return product data
    return jsonify(serialize_product(product)), 200


@product_bp.post("/")
@admin_required
def create_product():
    """
    Create a new product
    ---
    tags:
      - Products
    security:
      - BearerAuth: []
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            required:
              - name
              - brand
              - category
              - price
              - quantity_in_stock
          properties:
            name:
              type: string
            brand:
              type: string
            category:
              type: string
            price:
              type: number
            quantity_in_stock:
              type: integer
            picture_url:
              type: string
            nutritional_info:
              type: string
    responses:
      201:
        description: Product created successfully
      400:
        description: Validation error
      401:
        description: Unauthorized
    """

    data = request.get_json(silent=True) or {}

    # Validation
    required_fields = ["name", "brand", "category", "price", "quantity_in_stock", "unit"]
    errors = {}

    for field in required_fields:
        if field not in data or data[field] in ("", None):
            errors[field] = f"{field} is required"

    if errors:
        return jsonify({"errors": errors}), 400

    # Create product
    product = Product(
        name=data["name"],
        brand=data["brand"],
        category=data["category"],
        description=data.get("description"),
        unit=data.get("unit"),
        price=data["price"],
        original_price=data.get("originalPrice") or data.get("original_price"),
        discount=data.get("discount"),
        quantity_in_stock=data["quantity_in_stock"],
        picture_url=data.get("picture_url"),
        icon=data.get("icon"),
        nutritional_info=data.get("nutritional_info"),
        ingredients=normalize_list_field(data.get("ingredients")),
        dietary_tags=normalize_list_field(data.get("dietaryTags") or data.get("dietary_tags")),
        rating=data.get("rating"),
        reviews=data.get("reviews"),
    )

    db.session.add(product)
    db.session.commit()

    return jsonify(serialize_product(product)), 201

@product_bp.put("/<int:product_id>")
@admin_required
def update_product(product_id):
    """
    Update a product
    ---
    tags:
      - Products
    parameters:
      - name: product_id
        in: path
        type: integer
        required: true
    responses:
      200:
        description: Product updated successfully
      404:
        description: Product not found
      401:
        description: Unauthorized
    """

    product = Product.query.get(product_id)

    if not product:
        return jsonify({"message": "Product not found"}), 404

    data = request.get_json(silent=True) or {}

    # Update fields only if provided
    if "name" in data:
        product.name = data["name"]
    if "brand" in data:
        product.brand = data["brand"]
    if "category" in data:
        product.category = data["category"]
    if "description" in data:
        product.description = data["description"]
    if "unit" in data:
        product.unit = data["unit"]
    if "price" in data:
        product.price = data["price"]
    if "originalPrice" in data or "original_price" in data:
        product.original_price = data.get("originalPrice") or data.get("original_price")
    if "discount" in data:
        product.discount = data["discount"]
    if "quantity_in_stock" in data:
        product.quantity_in_stock = data["quantity_in_stock"]
    if "picture_url" in data:
        product.picture_url = data["picture_url"]
    if "icon" in data:
        product.icon = data["icon"]
    if "nutritional_info" in data:
        product.nutritional_info = data["nutritional_info"]
    if "ingredients" in data:
        product.ingredients = normalize_list_field(data.get("ingredients"))
    if "dietaryTags" in data or "dietary_tags" in data:
        product.dietary_tags = normalize_list_field(data.get("dietaryTags") or data.get("dietary_tags"))
    if "rating" in data:
        product.rating = data["rating"]
    if "reviews" in data:
        product.reviews = data["reviews"]

    db.session.commit()

    return jsonify(serialize_product(product)), 200


@product_bp.delete("/<int:product_id>")
@admin_required
def delete_product(product_id):
    """
    Delete a product
    ---
    tags:
      - Products
    parameters:
      - name: product_id
        in: path
        type: integer
        required: true
    responses:
      200:
        description: Product deleted successfully
      404:
        description: Product not found
      401:
        description: Unauthorized
    """

    product = Product.query.get(product_id)

    if not product:
        return jsonify({"message": "Product not found"}), 404

    db.session.delete(product)
    db.session.commit()

    return jsonify({"message": "Product deleted successfully"}), 200
