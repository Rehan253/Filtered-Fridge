from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity

from extensions import db
from models import Invoice, InvoiceItem, Product

from extensions import db
from models import Invoice


invoice_bp = Blueprint("invoices", __name__, url_prefix="/invoices")


@invoice_bp.post("/")
@jwt_required()
def create_invoice():
    """
    Create a new invoice (order)
    ---
    tags:
      - Invoices
    responses:
      201:
        description: Invoice created successfully
      401:
        description: Unauthorized
    """

    # Get logged-in user ID from JWT
    user_id = int(get_jwt_identity())

    data = request.get_json(silent=True) or {}
    delivery = data.get("deliveryAddress") or {}

    # Create invoice with total = 0
    invoice = Invoice(
        user_id=user_id,
        total_amount=0,
        delivery_full_name=delivery.get("fullName"),
        delivery_email=delivery.get("email"),
        delivery_phone=delivery.get("phone"),
        delivery_address=delivery.get("address"),
        delivery_apartment=delivery.get("apartment"),
        delivery_city=delivery.get("city"),
        delivery_state=delivery.get("state"),
        delivery_zip_code=delivery.get("zipCode"),
        delivery_notes=delivery.get("deliveryNotes"),
        payment_method=data.get("paymentMethod"),
    )

    db.session.add(invoice)
    db.session.commit()

    return jsonify({
        "message": "Invoice created successfully",
        "invoice_id": invoice.id,
        "created_at": invoice.created_at.isoformat()
    }), 201

@invoice_bp.post("/<int:invoice_id>/items")
@jwt_required()
def add_invoice_item(invoice_id):
    """
    Add an item to an invoice
    ---
    tags:
      - Invoices
    parameters:
      - name: invoice_id
        in: path
        type: integer
        required: true
        description: ID of the invoice
    responses:
      201:
        description: Item added successfully
      400:
        description: Validation or stock error
      401:
        description: Unauthorized
      403:
        description: Forbidden (invoice not owned by user)
      404:
        description: Invoice or product not found
    """

    # 1) Get logged-in user id from JWT (stored as string, convert to int)
    user_id = int(get_jwt_identity())

    # 2) Read JSON body
    data = request.get_json(silent=True) or {}

    product_id = data.get("product_id")
    quantity = data.get("quantity")

    # 3) Validate input
    errors = {}
    if product_id is None:
        errors["product_id"] = "product_id is required"
    if quantity is None:
        errors["quantity"] = "quantity is required"
    else:
        try:
            quantity = int(quantity)
            if quantity <= 0:
                errors["quantity"] = "quantity must be greater than 0"
        except (TypeError, ValueError):
            errors["quantity"] = "quantity must be an integer"

    if errors:
        return jsonify({"errors": errors}), 400

    # 4) Find invoice
    invoice = Invoice.query.get(invoice_id)
    if not invoice:
        return jsonify({"message": "Invoice not found"}), 404

    # 5) Ensure invoice belongs to current user
    if invoice.user_id != user_id:
        return jsonify({"message": "You are not allowed to modify this invoice"}), 403

    # 6) Find product
    product = Product.query.get(product_id)
    if not product:
        return jsonify({"message": "Product not found"}), 404

    # 7) Check stock
    if product.quantity_in_stock < quantity:
        return jsonify({
            "message": "Not enough stock",
            "available_stock": product.quantity_in_stock
        }), 400

    # 8) Calculate unit price and line total
    unit_price = product.price
    line_total = float(unit_price) * quantity

    # 9) Create invoice item
    item = InvoiceItem(
        invoice_id=invoice.id,
        product_id=product.id,
        quantity=quantity,
        unit_price=unit_price
    )

    # 10) Update stock and invoice total
    product.quantity_in_stock -= quantity
    invoice.total_amount = float(invoice.total_amount) + line_total

    # 11) Save everything
    db.session.add(item)
    db.session.commit()

    return jsonify({
        "message": "Item added successfully",
        "invoice_id": invoice.id,
        "item": {
            "id": item.id,
            "product_id": product.id,
            "quantity": item.quantity,
            "unit_price": float(item.unit_price)
        },
        "new_total_amount": float(invoice.total_amount),
        "remaining_stock": product.quantity_in_stock
    }), 201

@invoice_bp.get("/<int:invoice_id>")
@jwt_required()
def get_invoice_details(invoice_id):
    """
    Get invoice details
    ---
    tags:
      - Invoices
    """

    user_id = int(get_jwt_identity())

    invoice = Invoice.query.get(invoice_id)
    if not invoice:
        return jsonify({"message": "Invoice not found"}), 404

    # Ownership check
    if invoice.user_id != user_id:
        return jsonify({"message": "You are not allowed to view this invoice"}), 403

    items = []
    for item in invoice.invoice_items:
        items.append({
            "id": item.id,
            "product_id": item.product.id,
            "product_name": item.product.name,
            "quantity": item.quantity,
            "unit_price": float(item.unit_price),
            "line_total": float(item.unit_price) * item.quantity
        })

    return jsonify({
        "invoice_id": invoice.id,
        "user_id": invoice.user_id,
        "total_amount": float(invoice.total_amount),
        "created_at": invoice.created_at.isoformat(),
        "deliveryAddress": {
            "fullName": invoice.delivery_full_name,
            "email": invoice.delivery_email,
            "phone": invoice.delivery_phone,
            "address": invoice.delivery_address,
            "apartment": invoice.delivery_apartment,
            "city": invoice.delivery_city,
            "state": invoice.delivery_state,
            "zipCode": invoice.delivery_zip_code,
            "deliveryNotes": invoice.delivery_notes,
        },
        "paymentMethod": invoice.payment_method,
        "items": items
    }), 200

@invoice_bp.get("/me")
@jwt_required()
def get_my_invoices():
    """
    Get current user's invoices
    ---
    tags:
      - Invoices
    responses:
      200:
        description: List of user invoices
      401:
        description: Unauthorized
    """

    user_id = int(get_jwt_identity())

    invoices = (
        Invoice.query
        .filter_by(user_id=user_id)
        .order_by(Invoice.created_at.desc())
        .all()
    )

    result = []
    for invoice in invoices:
        result.append({
            "invoice_id": invoice.id,
            "total_amount": float(invoice.total_amount),
            "created_at": invoice.created_at.isoformat(),
            "item_count": len(invoice.invoice_items)
        })

    return jsonify(result), 200
