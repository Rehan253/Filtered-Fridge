import json
from flask import Blueprint, jsonify
from sqlalchemy.exc import IntegrityError

from extensions import db
from models import Product
from security.authorization import admin_required
from services.openfoodfacts_service import fetch_product_by_barcode
from scripts.barcodes import BARCODES


admin_import_bp = Blueprint(
    "admin_product_import",
    __name__,
    url_prefix="/admin/products"
)

def extract_ingredients(data):
    ingredients_text = (data.get("ingredients_text") or "").strip()
    if ingredients_text:
        parts = [part.strip() for part in ingredients_text.replace(";", ",").split(",")]
        return [part for part in parts if part]

    ingredients_tags = data.get("ingredients_tags") or []
    if isinstance(ingredients_tags, list):
        return [tag.split(":")[-1].replace("-", " ").strip() for tag in ingredients_tags if tag]
    return []

def extract_dietary_tags(data):
    tag_sources = []
    for source in (data.get("labels_tags"), data.get("ingredients_analysis_tags")):
        if isinstance(source, list):
            tag_sources.extend(source)

    labels = data.get("labels")
    if isinstance(labels, str):
        tag_sources.extend([tag.strip() for tag in labels.split(",") if tag.strip()])

    tags = []
    for tag in tag_sources:
        tag_lower = str(tag).lower()
        if "non" in tag_lower or "unknown" in tag_lower or "maybe" in tag_lower:
            continue
        if "halal" in tag_lower and "halal" not in tags:
            tags.append("halal")
        if "kosher" in tag_lower and "kosher" not in tags:
            tags.append("kosher")
        if "vegan" in tag_lower and "vegan" not in tags:
            tags.append("vegan")
        if "vegetarian" in tag_lower and "vegetarian" not in tags:
            tags.append("vegetarian")

    return tags

def infer_dietary_tags_from_ingredients(ingredients):
    if not ingredients:
        return []

    text = " ".join(ingredients).lower()

    def contains_any(needles):
        return any(needle in text for needle in needles)

    meat_terms = [
        "beef", "pork", "ham", "bacon", "lard", "chicken", "turkey",
        "duck", "lamb", "mutton", "veal", "meat", "gelatin", "rennet"
    ]
    fish_terms = ["fish", "tuna", "salmon", "cod", "anchovy", "sardine"]
    shellfish_terms = ["shrimp", "prawn", "crab", "lobster", "scallop", "mussel", "oyster"]
    dairy_egg_terms = ["milk", "cheese", "butter", "cream", "yogurt", "whey", "casein", "egg", "lactose"]
    honey_terms = ["honey", "beeswax"]
    alcohol_terms = ["alcohol", "ethanol", "wine", "beer", "rum", "vodka", "whisky", "whiskey", "brandy"]
    pork_terms = ["pork", "ham", "bacon", "lard", "gelatin"]

    tags = []

    if not contains_any(pork_terms + alcohol_terms):
        tags.append("halal")

    if not contains_any(meat_terms + fish_terms):
        tags.append("vegetarian")

    if not contains_any(meat_terms + fish_terms + dairy_egg_terms + honey_terms):
        tags.append("vegan")

    has_meat = contains_any(meat_terms)
    has_dairy = contains_any(dairy_egg_terms)
    has_shellfish = contains_any(shellfish_terms)
    has_pork = contains_any(pork_terms)
    if not has_pork and not has_shellfish and not (has_meat and has_dairy):
        tags.append("kosher")

    return tags
@admin_import_bp.post("/import")
@admin_required
def import_products():
    """
    Import products from OpenFoodFacts (one-time admin operation)
    ---
    tags:
      - Admin
    responses:
      200:
        description: Import completed
      403:
        description: Admin access required
    """

    imported = 0
    skipped = 0
    errors = 0

    for barcode in BARCODES:
        try:
            data = fetch_product_by_barcode(barcode)
            if not data:
                skipped += 1
                continue

            name = data.get("product_name")
            brand = data.get("brands")
            categories = data.get("categories")
            image_url = data.get("image_front_url")
            nutriments = data.get("nutriments")
            ingredients = extract_ingredients(data)
            dietary_tags = extract_dietary_tags(data)
            inferred_tags = infer_dietary_tags_from_ingredients(ingredients)
            for tag in inferred_tags:
                if tag not in dietary_tags:
                    dietary_tags.append(tag)

            if not name or not brand:
                skipped += 1
                continue

            # Upsert by name + brand to refresh imported metadata
            existing = Product.query.filter_by(name=name, brand=brand).first()
            if existing:
                existing.category = (categories or existing.category or "Unknown")[:100]
                existing.picture_url = image_url or existing.picture_url
                if nutriments:
                    existing.nutritional_info = str(nutriments)
                if ingredients:
                    existing.ingredients = json.dumps(ingredients)
                if dietary_tags:
                    existing.dietary_tags = json.dumps(dietary_tags)
                db.session.commit()
                imported += 1
                continue

            product = Product(
                name=name[:200],
                brand=brand[:100],
                category=(categories or "Unknown")[:100],
                price=0.0,  # Admin can update later
                quantity_in_stock=100,
                picture_url=image_url,
                nutritional_info=str(nutriments) if nutriments else None,
                ingredients=json.dumps(ingredients) if ingredients else None,
                dietary_tags=json.dumps(dietary_tags) if dietary_tags else None,
            )

            db.session.add(product)
            db.session.commit()
            imported += 1

        except IntegrityError:
            db.session.rollback()
            skipped += 1
        except Exception:
            db.session.rollback()
            errors += 1

    return jsonify({
        "message": "Import completed",
        "imported": imported,
        "skipped": skipped,
        "errors": errors
    }), 200
