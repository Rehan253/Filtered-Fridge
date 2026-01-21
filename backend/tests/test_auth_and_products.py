import json

from flask_jwt_extended import create_access_token

from extensions import db
from models import Product, User, Invoice, InvoiceItem
from security_utils import hash_password
from services.kpi_service import (
    get_average_calories_by_category,
    get_best_selling_products,
    get_low_stock_products,
    get_top_high_sugar_products,
)


def create_user(email, role="customer"):
    user = User(
        first_name="Test",
        last_name="User",
        email=email,
        password_hash=hash_password("Password123!"),
        phone_number="+10000000000",
        address="123 Main St",
        zip_code="10001",
        city="New York",
        country="USA",
        role=role,
    )
    db.session.add(user)
    db.session.commit()
    return user


def auth_headers(user_id):
    token = create_access_token(identity=str(user_id))
    return {"Authorization": f"Bearer {token}"}


def test_register_and_login_flow(client, app):
    payload = {
        "first_name": "Alice",
        "last_name": "Tester",
        "email": "alice@example.com",
        "password": "Password123!",
        "phone_number": "+15550000001",
        "address": "10 Market St",
        "zip_code": "75001",
        "city": "Paris",
        "country": "France",
        "role": "admin",
    }
    resp = client.post("/auth/register", json=payload)
    assert resp.status_code == 201
    data = resp.get_json()
    assert data["user"]["email"] == "alice@example.com"
    assert data["user"]["role"] == "admin"

    resp = client.post("/auth/login", json={"email": "alice@example.com", "password": "Password123!"})
    assert resp.status_code == 200
    login_data = resp.get_json()
    assert "access_token" in login_data


def test_register_validation(client):
    resp = client.post("/auth/register", json={"email": "bad@example.com"})
    assert resp.status_code == 400
    data = resp.get_json()
    assert "errors" in data
    assert "password" in data["errors"]


def test_login_invalid(client):
    resp = client.post("/auth/login", json={"email": "missing@example.com", "password": "nope"})
    assert resp.status_code == 401


def test_products_list_empty(client):
    resp = client.get("/products/")
    assert resp.status_code == 200
    assert resp.get_json() == []


def test_admin_create_product_requires_admin(client, app):
    with app.app_context():
        user = create_user("user@example.com", role="customer")
        user_id = user.id

    payload = {
        "name": "Test Apple",
        "brand": "BrandX",
        "category": "Fruits",
        "price": 1.99,
        "quantity_in_stock": 10,
        "unit": "lb",
    }
    resp = client.post("/products/", json=payload, headers=auth_headers(user_id))
    assert resp.status_code == 403


def test_admin_create_product_success(client, app):
    with app.app_context():
        admin = create_user("admin@example.com", role="admin")
        admin_id = admin.id

    payload = {
        "name": "Test Banana",
        "brand": "BrandY",
        "category": "Fruits",
        "price": 0.99,
        "quantity_in_stock": 25,
        "unit": "lb",
        "ingredients": ["banana"],
        "dietaryTags": ["vegan"],
    }
    resp = client.post("/products/", json=payload, headers=auth_headers(admin_id))
    assert resp.status_code == 201
    data = resp.get_json()
    assert data["name"] == "Test Banana"
    assert data["ingredients"] == ["banana"]


def test_kpi_services(app):
    with app.app_context():
        product_a = Product(
            name="Apple",
            brand="Farm",
            category="Fruits",
            price=1.0,
            quantity_in_stock=5,
            nutritional_info=json.dumps({"energy-kcal_100g": 52, "sugars_100g": 10}),
        )
        product_b = Product(
            name="Cookie",
            brand="Bakery",
            category="Snacks",
            price=2.5,
            quantity_in_stock=2,
            nutritional_info=json.dumps({"energy-kcal_100g": 450, "sugars_100g": 35}),
        )
        db.session.add_all([product_a, product_b])
        db.session.commit()

        user = create_user("buyer@example.com", role="customer")
        invoice = Invoice(user_id=user.id, total_amount=5.0)
        db.session.add(invoice)
        db.session.flush()
        db.session.add_all([
            InvoiceItem(invoice_id=invoice.id, product_id=product_a.id, quantity=2, unit_price=1.0),
            InvoiceItem(invoice_id=invoice.id, product_id=product_b.id, quantity=5, unit_price=2.5),
        ])
        db.session.commit()

        avg_calories = get_average_calories_by_category()
        assert avg_calories["Fruits"] == 52
        assert avg_calories["Snacks"] == 450

        high_sugar = get_top_high_sugar_products(limit=1)
        assert high_sugar[0]["name"] == "Cookie"

        best_selling = get_best_selling_products(limit=1)
        assert best_selling[0]["name"] == "Cookie"

        low_stock = get_low_stock_products(threshold=3)
        assert {item["name"] for item in low_stock} == {"Cookie"}
