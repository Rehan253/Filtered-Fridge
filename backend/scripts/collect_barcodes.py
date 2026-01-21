import requests

SEARCH_URL = "https://world.openfoodfacts.org/cgi/search.pl"


def collect_barcodes(pages=25, page_size=20):
    """
    Collect barcodes from OpenFoodFacts search API.

    pages=25, page_size=20 → 500 products total
    """
    barcodes = set()  # use set to avoid duplicates

    for page in range(1, pages + 1):
        params = {
            "action": "process",
            "json": 1,
            "page": page,
            "page_size": page_size,
        }

        print(f"Fetching page {page}...")
        response = requests.get(SEARCH_URL, params=params, timeout=10)
        response.raise_for_status()

        data = response.json()
        products = data.get("products", [])

        for product in products:
            code = product.get("code")
            if code and code.isdigit():
                barcodes.add(code)

    return list(barcodes)


if __name__ == "__main__":
    barcodes = collect_barcodes(pages=25, page_size=20)

    print(f"\nCollected {len(barcodes)} barcodes\n")

    # Save to file
    with open("barcodes.py", "w") as f:
        f.write("BARCODES = [\n")
        for code in barcodes:
            f.write(f'    "{code}",\n')
        f.write("]\n")

    print("Saved barcodes to backend/scripts/barcodes.py")
