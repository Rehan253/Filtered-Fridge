import os
import random
import requests


BASE_URL = os.getenv("BASE_URL", "http://127.0.0.1:5000")


def register_user(user):
    resp = requests.post(f"{BASE_URL}/auth/register", json=user, timeout=10)
    if resp.status_code in {201, 409}:
        return True
    print(f"Register failed ({user['email']}): {resp.status_code} {resp.text}")
    return False


def login_user(email, password):
    resp = requests.post(
        f"{BASE_URL}/auth/login",
        json={"email": email, "password": password},
        timeout=10
    )
    if resp.status_code != 200:
        print(f"Login failed ({email}): {resp.status_code} {resp.text}")
        return None
    data = resp.json()
    return data.get("access_token")


def get_products():
    resp = requests.get(f"{BASE_URL}/products", timeout=10)
    if resp.status_code != 200:
        print(f"Failed to load products: {resp.status_code} {resp.text}")
        return []
    return resp.json()


def create_invoice(token, user):
    payload = {
        "paymentMethod": "cash",
        "deliveryAddress": {
            "fullName": f"{user['first_name']} {user['last_name']}",
            "email": user["email"],
            "phone": user["phone_number"],
            "address": user["address"],
            "city": user["city"],
            "zipCode": user["zip_code"]
        }
    }
    resp = requests.post(
        f"{BASE_URL}/invoices/",
        json=payload,
        headers={"Authorization": f"Bearer {token}"},
        timeout=10
    )
    if resp.status_code != 201:
        print(f"Create invoice failed: {resp.status_code} {resp.text}")
        return None
    return resp.json().get("invoice_id")


def add_item(token, invoice_id, product_id, quantity):
    resp = requests.post(
        f"{BASE_URL}/invoices/{invoice_id}/items",
        json={"product_id": product_id, "quantity": quantity},
        headers={"Authorization": f"Bearer {token}"},
        timeout=10
    )
    if resp.status_code != 201:
        print(f"Add item failed: {resp.status_code} {resp.text}")
        return False
    return True


def seed_sample_orders():
    users = [
        {
            "first_name": "Sample",
            "last_name": "User1",
            "email": "sample1@example.com",
            "password": "Sample123!",
            "phone_number": "+15550000001",
            "address": "10 Market St",
            "zip_code": "75001",
            "city": "Paris",
            "country": "France"
        },
        {
            "first_name": "Sample",
            "last_name": "User2",
            "email": "sample2@example.com",
            "password": "Sample123!",
            "phone_number": "+15550000002",
            "address": "11 Market St",
            "zip_code": "75002",
            "city": "Paris",
            "country": "France"
        }
    ]

    products = get_products()
    if not products:
        print("No products found. Seed products first.")
        return

    product_ids = [p["id"] for p in products]
    random.seed(42)

    created = 0
    for user in users:
        if not register_user(user):
            continue
        token = login_user(user["email"], user["password"])
        if not token:
            continue
        for _ in range(2):
            invoice_id = create_invoice(token, user)
            if not invoice_id:
                continue
            for _ in range(3):
                product_id = random.choice(product_ids)
                quantity = random.randint(1, 3)
                if add_item(token, invoice_id, product_id, quantity):
                    created += 1

    print(f"Created {created} invoice items.")


if __name__ == "__main__":
    seed_sample_orders()
