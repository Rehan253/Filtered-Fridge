import json
from models import Product
from extensions import db
from sqlalchemy import func
from models import Product, InvoiceItem
import requests

def get_average_calories_by_category():
    """
    KPI: Average calories per product category
    """
    products = Product.query.all()

    category_totals = {}
    category_counts = {}

    for product in products:
        if not product.nutritional_info:
            continue

        try:
            nutriments = json.loads(product.nutritional_info.replace("'", '"'))
            calories = nutriments.get("energy-kcal_100g", 0)
        except Exception:
            continue

        category = product.category or "Unknown"

        category_totals[category] = category_totals.get(category, 0) + calories
        category_counts[category] = category_counts.get(category, 0) + 1

    result = {}
    for category in category_totals:
        result[category] = round(
            category_totals[category] / category_counts[category], 2
        )

    return result


def get_top_high_sugar_products(limit=5):
    """
    KPI: Top products with highest sugar content (per 100g)
    """
    products = Product.query.all()
    result = []

    for product in products:
        if not product.nutritional_info:
            continue

        try:
            nutriments = json.loads(product.nutritional_info.replace("'", '"'))
            sugar = nutriments.get("sugars_100g", 0)
        except Exception:
            continue

        result.append({
            "id": product.id,
            "name": product.name,
            "brand": product.brand,
            "category": product.category,
            "sugars_100g": sugar
        })

    result.sort(key=lambda x: x["sugars_100g"], reverse=True)
    return result[:limit]


def get_best_selling_products(limit=5):
    """
    KPI: Best-selling products based on total quantity sold
    """
    results = (
        db.session.query(
            Product.id,
            Product.name,
            Product.brand,
            func.sum(InvoiceItem.quantity).label("total_sold")
        )
        .join(InvoiceItem, Product.id == InvoiceItem.product_id)
        .group_by(Product.id)
        .order_by(func.sum(InvoiceItem.quantity).desc())
        .limit(limit)
        .all()
    )

    output = []
    for row in results:
        output.append({
            "product_id": row.id,
            "name": row.name,
            "brand": row.brand,
            "total_sold": int(row.total_sold)
        })

    return output


def get_low_stock_products(threshold=10):
    """
    KPI: Products with low stock
    """
    products = Product.query.filter(Product.quantity_in_stock < threshold).all()

    result = []
    for product in products:
        result.append({
            "id": product.id,
            "name": product.name,
            "brand": product.brand,
            "category": product.category,
            "quantity_in_stock": product.quantity_in_stock
        })

    return result
