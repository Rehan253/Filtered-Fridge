from datetime import datetime, timedelta
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from sqlalchemy import func
from services.kpi_service import get_top_high_sugar_products
from services.kpi_service import get_average_calories_by_category
from services.kpi_service import get_best_selling_products
from services.kpi_service import get_low_stock_products
from extensions import db
from models import Invoice
from models import User
from models import Product
from models import Promotion
from models import InvoiceItem
from security.authorization import admin_required

# Blueprint MUST be defined at top-level
kpi_bp = Blueprint("kpis", __name__, url_prefix="/kpis")


@kpi_bp.get("/average-calories-by-category")
@jwt_required()
def average_calories_by_category():
    """
    Average calories per product category
    ---
    tags:
      - KPIs
    security:
      - BearerAuth: []
    responses:
      200:
        description: Average calories grouped by category
      401:
        description: Unauthorized
    """
    data = get_average_calories_by_category()
    return jsonify(data), 200

@kpi_bp.get("/top-high-sugar-products")
@jwt_required()
def top_high_sugar_products():
    """
    Top high-sugar products
    ---
    tags:
      - KPIs
    security:
      - BearerAuth: []
    parameters:
      - name: limit
        in: query
        type: integer
        required: false
        description: Number of products to return (default 5)
    responses:
      200:
        description: List of products with highest sugar content
        content:
          application/json:
            example:
              - name: "Chocolate Bar"
                sugars_100g: 52.0
      401:
        description: Unauthorized
    """
    limit = 5
    try:
        limit = int(request.args.get("limit", 5))
    except ValueError:
        pass

    data = get_top_high_sugar_products(limit)
    return jsonify(data), 200

@kpi_bp.get("/best-selling-products")
@jwt_required()
def best_selling_products():
    """
    Best-selling products
    ---
    tags:
      - KPIs
    security:
      - BearerAuth: []
    parameters:
      - name: limit
        in: query
        type: integer
        required: false
        description: Number of products to return (default 5)
    responses:
      200:
        description: Best-selling products by quantity
        content:
          application/json:
            example:
              - name: "Ketchup"
                total_sold: 42
      401:
        description: Unauthorized
    """
    limit = 5
    try:
        limit = int(request.args.get("limit", 5))
    except ValueError:
        pass

    data = get_best_selling_products(limit)
    return jsonify(data), 200


@kpi_bp.get("/low-stock-products")
@jwt_required()
def low_stock_products():
    """
    Low stock products
    ---
    tags:
      - KPIs
    security:
      - BearerAuth: []
    parameters:
      - name: threshold
        in: query
        type: integer
        required: false
        description: Stock threshold (default 10)
    responses:
      200:
        description: Products with low stock
      401:
        description: Unauthorized
    """
    threshold = 10
    try:
        threshold = int(request.args.get("threshold", 10))
    except ValueError:
        pass

    data = get_low_stock_products(threshold)
    return jsonify(data), 200


@kpi_bp.get("/revenue-metrics")
@admin_required
def revenue_metrics():
    """
    Revenue metrics for admin dashboard
    ---
    tags:
      - KPIs
    parameters:
      - name: period
        in: query
        type: string
        required: false
        description: day, week, month, year
    responses:
      200:
        description: Revenue metrics
    """
    period = (request.args.get("period") or "month").lower()
    now = datetime.utcnow()

    if period == "day":
        start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    elif period == "week":
        start = now - timedelta(days=7)
    elif period == "year":
        start = now - timedelta(days=365)
    else:
        start = now - timedelta(days=30)

    delta = now - start
    prev_end = start
    prev_start = start - delta

    total_revenue = db.session.query(func.coalesce(func.sum(Invoice.total_amount), 0)).scalar() or 0
    total_orders = db.session.query(func.count(Invoice.id)).scalar() or 0

    period_revenue = (
        db.session.query(func.coalesce(func.sum(Invoice.total_amount), 0))
        .filter(Invoice.created_at >= start, Invoice.created_at <= now)
        .scalar()
        or 0
    )
    period_orders = (
        db.session.query(func.count(Invoice.id))
        .filter(Invoice.created_at >= start, Invoice.created_at <= now)
        .scalar()
        or 0
    )

    prev_revenue = (
        db.session.query(func.coalesce(func.sum(Invoice.total_amount), 0))
        .filter(Invoice.created_at >= prev_start, Invoice.created_at < prev_end)
        .scalar()
        or 0
    )

    average_order_value = total_revenue / total_orders if total_orders else 0
    period_average_order_value = period_revenue / period_orders if period_orders else 0

    revenue_growth = ((period_revenue - prev_revenue) / prev_revenue * 100) if prev_revenue > 0 else 0

    return jsonify({
        "period": period,
        "totalRevenue": float(total_revenue),
        "periodRevenue": float(period_revenue),
        "previousPeriodRevenue": float(prev_revenue),
        "averageOrderValue": float(average_order_value),
        "periodAverageOrderValue": float(period_average_order_value),
        "revenueGrowth": float(revenue_growth)
    }), 200


@kpi_bp.get("/order-customer-metrics")
@admin_required
def order_customer_metrics():
    """
    Order and customer metrics for admin dashboard
    ---
    tags:
      - KPIs
    parameters:
      - name: period
        in: query
        type: string
        required: false
        description: day, week, month, year
    responses:
      200:
        description: Order and customer metrics
    """
    period = (request.args.get("period") or "month").lower()
    now = datetime.utcnow()

    if period == "day":
        start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    elif period == "week":
        start = now - timedelta(days=7)
    elif period == "year":
        start = now - timedelta(days=365)
    else:
        start = now - timedelta(days=30)

    delta = now - start
    prev_end = start
    prev_start = start - delta

    total_orders = db.session.query(func.count(Invoice.id)).scalar() or 0
    period_orders = (
        db.session.query(func.count(Invoice.id))
        .filter(Invoice.created_at >= start, Invoice.created_at <= now)
        .scalar()
        or 0
    )
    prev_orders = (
        db.session.query(func.count(Invoice.id))
        .filter(Invoice.created_at >= prev_start, Invoice.created_at < prev_end)
        .scalar()
        or 0
    )

    order_growth = ((period_orders - prev_orders) / prev_orders * 100) if prev_orders > 0 else 0

    pending_orders = 0
    completed_orders = total_orders
    if hasattr(Invoice, "status"):
        pending_orders = (
            db.session.query(func.count(Invoice.id))
            .filter(Invoice.status == "processing")
            .scalar()
            or 0
        )
        completed_orders = (
            db.session.query(func.count(Invoice.id))
            .filter(Invoice.status == "delivered")
            .scalar()
            or 0
        )

    total_customers = (
        db.session.query(func.count(User.id))
        .filter(User.role == "customer")
        .scalar()
        or 0
    )
    period_customers = (
        db.session.query(func.count(User.id))
        .filter(User.role == "customer", User.created_at >= start, User.created_at <= now)
        .scalar()
        or 0
    )
    active_customers = (
        db.session.query(func.count(User.id))
        .filter(User.role == "customer", User.status == "active")
        .scalar()
        or 0
    )

    return jsonify({
        "period": period,
        "totalOrders": int(total_orders),
        "periodOrdersCount": int(period_orders),
        "pendingOrders": int(pending_orders),
        "completedOrders": int(completed_orders),
        "orderGrowth": float(order_growth),
        "totalCustomers": int(total_customers),
        "periodCustomers": int(period_customers),
        "activeCustomers": int(active_customers)
    }), 200


@kpi_bp.get("/product-promotion-metrics")
@admin_required
def product_promotion_metrics():
    """
    Product and promotion metrics for admin dashboard
    ---
    tags:
      - KPIs
    responses:
      200:
        description: Product and promotion metrics
    """
    total_products = db.session.query(func.count(Product.id)).scalar() or 0
    low_stock_products = (
        db.session.query(func.count(Product.id))
        .filter(Product.quantity_in_stock < 10, Product.quantity_in_stock > 0)
        .scalar()
        or 0
    )
    out_of_stock_products = (
        db.session.query(func.count(Product.id))
        .filter(Product.quantity_in_stock == 0)
        .scalar()
        or 0
    )
    inventory_value = (
        db.session.query(func.coalesce(func.sum(Product.price * Product.quantity_in_stock), 0))
        .scalar()
        or 0
    )

    today = datetime.utcnow().date()
    active_promotions = (
        db.session.query(func.count(Promotion.id))
        .filter(
            Promotion.status == "active",
            Promotion.start_date <= today,
            Promotion.end_date >= today
        )
        .scalar()
        or 0
    )

    promo_usage = 0
    if hasattr(Invoice, "promo_code"):
        promo_usage = (
            db.session.query(func.count(Invoice.id))
            .filter(Invoice.promo_code.isnot(None))
            .scalar()
            or 0
        )

    return jsonify({
        "totalProducts": int(total_products),
        "lowStockProducts": int(low_stock_products),
        "outOfStockProducts": int(out_of_stock_products),
        "totalInventoryValue": float(inventory_value),
        "activePromotions": int(active_promotions),
        "totalPromotions": int(promo_usage)
    }), 200


@kpi_bp.get("/dashboard-charts")
@admin_required
def dashboard_charts():
    """
    Dashboard chart data for admin dashboard
    ---
    tags:
      - KPIs
    responses:
      200:
        description: Chart datasets
    """
    today = datetime.utcnow().date()
    start_date = today - timedelta(days=6)

    revenue_rows = (
        db.session.query(func.date(Invoice.created_at), func.coalesce(func.sum(Invoice.total_amount), 0))
        .filter(Invoice.created_at >= start_date)
        .group_by(func.date(Invoice.created_at))
        .all()
    )
    revenue_by_date = {row[0]: float(row[1]) for row in revenue_rows}
    revenue_trend = []
    for day_offset in range(7):
        day = start_date + timedelta(days=day_offset)
        label = day.strftime("%b %d").replace(" 0", " ")
        revenue_trend.append({
            "date": label,
            "revenue": round(revenue_by_date.get(day, 0), 2)
        })

    total_orders = db.session.query(func.count(Invoice.id)).scalar() or 0
    if hasattr(Invoice, "status"):
        status_rows = (
            db.session.query(Invoice.status, func.count(Invoice.id))
            .group_by(Invoice.status)
            .all()
        )
        status_map = {row[0]: int(row[1]) for row in status_rows}
        order_status_data = [
            {"name": "Delivered", "value": status_map.get("delivered", 0), "color": "#10b981"},
            {"name": "Processing", "value": status_map.get("processing", 0), "color": "#f59e0b"},
            {"name": "Shipped", "value": status_map.get("shipped", 0), "color": "#3b82f6"},
            {"name": "Cancelled", "value": status_map.get("cancelled", 0), "color": "#ef4444"}
        ]
    else:
        order_status_data = [
            {"name": "Delivered", "value": int(total_orders), "color": "#10b981"}
        ]

    category_rows = (
        db.session.query(Product.category, func.coalesce(func.sum(InvoiceItem.quantity * InvoiceItem.unit_price), 0))
        .join(InvoiceItem, InvoiceItem.product_id == Product.id)
        .group_by(Product.category)
        .order_by(func.coalesce(func.sum(InvoiceItem.quantity * InvoiceItem.unit_price), 0).desc())
        .all()
    )
    category_chart_data = [
        {"category": row[0] or "Other", "revenue": round(float(row[1]), 2)}
        for row in category_rows
    ]

    month_labels = []
    month_cursor = today.replace(day=1)
    for _ in range(6):
        month_labels.append(month_cursor)
        prev_month = month_cursor.replace(day=1) - timedelta(days=1)
        month_cursor = prev_month.replace(day=1)
    month_labels.reverse()

    customer_rows = (
        db.session.query(func.date_trunc("month", User.created_at), func.count(User.id))
        .filter(User.role == "customer")
        .group_by(func.date_trunc("month", User.created_at))
        .all()
    )
    customer_counts = {row[0].date(): int(row[1]) for row in customer_rows}
    customer_growth_data = []
    for month_start in month_labels:
        label = month_start.strftime("%b %Y")
        customer_growth_data.append({
            "month": label,
            "customers": customer_counts.get(month_start, 0)
        })

    return jsonify({
        "revenueChartData": revenue_trend,
        "orderStatusData": [item for item in order_status_data if item["value"] > 0],
        "categoryChartData": category_chart_data,
        "customerGrowthData": customer_growth_data
    }), 200
