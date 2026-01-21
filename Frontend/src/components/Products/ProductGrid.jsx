import { useEffect, useMemo, useRef, useState } from "react"
import ProductCard from "./ProductCard"
import { filterProductsByPreferences } from "../../utils/productFilters"
import { getCategoryName } from "../../utils/categoryMapping"

const ProductGrid = ({
    products,
    onAddToCart,
    selectedCategory,
    filters,
    onProductClick,
    userPreferences,
    initialCount = 12,
    batchSize = 12,
    rootMargin = "300px",
}) => {
    // Apply category filter
    const filteredProducts = useMemo(() => {
        let list =
            selectedCategory === "All"
                ? products
                : products.filter((product) => getCategoryName(product) === selectedCategory)

        // Price filter
        if (filters?.minPrice !== undefined) {
            list = list.filter((product) => product.price >= filters.minPrice)
        }
        if (filters?.maxPrice !== undefined) {
            list = list.filter((product) => product.price <= filters.maxPrice)
        }

        // Apply user preferences filter (only if enabled)
        if (userPreferences && filters?.preferencesEnabled) {
            list = filterProductsByPreferences(list, userPreferences)
        }

        // Sort
        if (filters?.sortBy) {
            list = [...list].sort((a, b) => {
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

        return list
    }, [filters, products, selectedCategory, userPreferences])

    const [visibleCount, setVisibleCount] = useState(initialCount)
    const sentinelRef = useRef(null)

    useEffect(() => {
        setVisibleCount(initialCount)
    }, [initialCount, selectedCategory, filters, userPreferences, products.length])

    useEffect(() => {
        if (visibleCount >= filteredProducts.length) {
            return
        }
        if (!sentinelRef.current || !("IntersectionObserver" in window)) {
            return
        }

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries.some((entry) => entry.isIntersecting)) {
                    setVisibleCount((count) =>
                        Math.min(count + batchSize, filteredProducts.length)
                    )
                }
            },
            { rootMargin }
        )

        observer.observe(sentinelRef.current)
        return () => observer.disconnect()
    }, [batchSize, filteredProducts.length, rootMargin, visibleCount])

    const visibleProducts = filteredProducts.slice(0, visibleCount)

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
                <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {visibleProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onAddToCart={onAddToCart}
                                onProductClick={onProductClick}
                            />
                        ))}
                    </div>
                    {visibleCount < filteredProducts.length && (
                        <div className="flex justify-center">
                            <button
                                type="button"
                                onClick={() =>
                                    setVisibleCount((count) =>
                                        Math.min(count + batchSize, filteredProducts.length)
                                    )
                                }
                                className="rounded-full border border-premium-primary px-6 py-2 text-sm font-semibold text-premium-primary transition hover:bg-premium-primary hover:text-white"
                            >
                                Load more
                            </button>
                        </div>
                    )}
                    <div ref={sentinelRef} />
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
