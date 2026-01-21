import requests
import os

BASE_URL = "http://localhost:5000"

def seed_via_api():
    print("Starting API-based Seeding...")
    
    # ---------------------------------------------------------
    # 1. Create Super Admin
    # ---------------------------------------------------------
    admin_data = {
        "first_name": "Super",
        "last_name": "Admin",
        "email": os.getenv("SUPER_ADMIN_EMAIL", "admin@trinity.com"),
        "password": os.getenv("SUPER_ADMIN_PASSWORD", "admin123"),
        "phone_number": "+33100000000",
        "address": "1 Admin Way",
        "zip_code": "75000",
        "city": "Paris",
        "country": "France",
        "role": "admin"
    }
    
    print(f"\n Creating Admin ({admin_data['email']})...")
    try:
        resp = requests.post(f"{BASE_URL}/auth/register", json=admin_data)
        if resp.status_code == 201:
            print(" Admin created successfully.")
        elif resp.status_code == 409:
            print("Admin already exists.")
        else:
            print(f" Failed to create admin: {resp.status_code} - {resp.text}")
    except requests.exceptions.ConnectionError:
        print(f" Error: Could not connect to {BASE_URL}. Is the server running?")
        return

    # First-time setup only seeds the super admin.

if __name__ == "__main__":
    seed_via_api()
