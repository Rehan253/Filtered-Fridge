from services.openfoodfacts_service import fetch_product_by_barcode
import json

barcode = "737628064502"  # replace with others one by one
product = fetch_product_by_barcode(barcode)

# Define output file name
output_file = "product_data.json"

# Save product data into JSON file
with open(output_file, "w", encoding="utf-8") as f:
    json.dump(product, f, indent=2, ensure_ascii=False)

print(f"✅ Product data saved successfully to {output_file}")
