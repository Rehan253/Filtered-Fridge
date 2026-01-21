import os
import random
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app import create_app
from extensions import db
from models import Product


def update_prices():
    min_price = float(os.getenv("PRICE_MIN", "1.99"))
    max_price = float(os.getenv("PRICE_MAX", "19.99"))
    random.seed(os.getenv("PRICE_SEED", "trinity-pricing"))

    app = create_app()
    with app.app_context():
        products = Product.query.all()
        updated = 0
        for product in products:
            if product.price is None or product.price <= 0:
                product.price = round(random.uniform(min_price, max_price), 2)
                if product.original_price is None:
                    product.original_price = product.price
                if product.discount is None:
                    product.discount = 0
                updated += 1
        db.session.commit()
        print(f"Updated prices for {updated} products.")


if __name__ == "__main__":
    update_prices()
