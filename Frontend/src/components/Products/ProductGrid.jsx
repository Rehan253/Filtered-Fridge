import ProductCard from "./ProductCard"
import { filterProductsByPreferences } from "../../utils/productFilters"
import { getCategoryName } from "../../utils/categoryMapping"

const ProductGrid = ({ products, onAddToCart, selectedCategory, filters, onProductClick, userPreferences }) => {
    // Apply category filter
    let filteredProducts =
        selectedCategory === "All"
            ? products
            : products.filter((product) => getCategoryName(product) === selectedCategory)

    // Price filter
    if (filters?.minPrice !== undefined) {
        filteredProducts = filteredProducts.filter((product) => product.price >= filters.minPrice)
    }
    if (filters?.maxPrice !== undefined) {
        filteredProducts = filteredProducts.filter((product) => product.price <= filters.maxPrice)
    }

    // Apply user preferences filter (only if enabled)
    if (userPreferences && filters?.preferencesEnabled) {
        filteredProducts = filterProductsByPreferences(filteredProducts, userPreferences)
    }

    // Sort
    if (filters?.sortBy) {
        filteredProducts = [...filteredProducts].sort((a, b) => {
            switch (filters.sortBy) {
                case "priceLow":
                    return a.price - b.price
                case "priceHigh":
                    return b.price - a.price
                case "nameAZ":
                    return a.name.localeCompare(b.name)
                case "nameZA":
                    return b.name.localeCompare(a.name)
                case "rating":
                    return (b.rating || 0) - (a.rating || 0)
                default:
                    return 0
            }
        })
    }

    return (
        <div className="w-full">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-premium-text">
                        {selectedCategory === "All" ? "All Products" : selectedCategory}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">{filteredProducts.length} products available</p>
                </div>
            </div>

            {/* Product Grid */}
            {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onAddToCart={onAddToCart}
                            onProductClick={onProductClick}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-bold text-premium-text mb-2">No products found</h3>
                    <p className="text-gray-500">Try adjusting your filters or selecting a different category</p>
                </div>
            )}
        </div>
    )
}

export default ProductGrid
