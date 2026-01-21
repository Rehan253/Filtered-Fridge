import requests

BASE_V2_URL = "https://world.openfoodfacts.org/api/v2/product"


def fetch_product_by_barcode(barcode: str):
    """
    Fetch a single product from OpenFoodFacts v2 API using barcode
    """
    url = f"{BASE_V2_URL}/{barcode}"

    response = requests.get(url, timeout=10)
    response.raise_for_status()

    data = response.json()

    # OpenFoodFacts returns status = 1 when product exists
    if data.get("status") != 1:
        return None

    return data.get("product")
