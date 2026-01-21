import { useState } from "react"

const ProductCard = ({ product, onAddToCart, onProductClick }) => {
    const [isAdded, setIsAdded] = useState(false)

    const handleAddToCart = (e) => {
        e.stopPropagation() // Prevent opening modal when clicking add to cart
        if (onAddToCart) {
            onAddToCart(product)
            // Show added animation
            setIsAdded(true)
            setTimeout(() => {
                setIsAdded(false)
            }, 2000) // Hide after 2 seconds
        }
    }

    const handleCardClick = () => {
        if (onProductClick) {
            onProductClick(product)
        }
    }

    return (
        <div
            className="bg-white rounded-[--radius-card] shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group hover:scale-105 transform relative cursor-pointer"
            onClick={handleCardClick}>
            {/* Product Image Container */}
            <div className="relative bg-gray-100 h-48 flex items-center justify-center overflow-hidden">
                {product.image ? (
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                ) : (
                    <span className="text-7xl group-hover:scale-110 transition-transform duration-300">
                        {product.icon || "🛒"}
                    </span>
                )}

                {/* On Sale Badge - Top Right Corner */}
                {product.discount && (
                    <div className="absolute top-2 right-2 bg-premium-accent text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md animate-pulse">
                        ON SALE
                    </div>
                )}

                {/* Discount Percentage - Top Left Corner */}
                {product.discount && (
                    <div className="absolute top-2 left-2 bg-premium-primary text-white text-xs font-bold px-2.5 py-1.5 rounded-full shadow-md">
                        -{product.discount}%
                    </div>
                )}

                {/* Stock Status */}
                {product.stock && product.stock < 5 && !product.discount && (
                    <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                        Only {product.stock} left
                    </div>
                )}
            </div>

            {/* Product Details */}
            <div className="p-4 relative">
                {/* Category Tag */}
                {product.category && (
                    <span className="text-xs font-semibold text-premium-secondary bg-premium-background px-2 py-1 rounded-full">
                        {product.category}
                    </span>
                )}

                {/* Product Name */}
                <h3 className="text-premium-secondary font-bold text-base mt-2 mb-1 line-clamp-2">{product.name}</h3>

                {/* Product Description */}
                {product.description && (
                    <p className="text-gray-500 text-xs mb-3 line-clamp-1">{product.description}</p>
                )}

                {/* Price and Add Button Container */}
                <div className="flex items-start justify-between mt-3">
                    {/* Price Section */}
                    <div className="flex flex-col">
                        <div className="flex items-baseline gap-2">
                            <span className="text-premium-primary font-bold text-xl">${product.price}</span>
                            {product.originalPrice && (
                                <span className="text-gray-400 text-sm line-through">${product.originalPrice}</span>
                            )}
                        </div>
                        {/* Price per unit - Below main price in muted grey */}
                        {product.unit && (
                            <span className="text-gray-400 text-xs mt-0.5">
                                ${product.price} / {product.unit}
                            </span>
                        )}
                    </div>

                    {/* Add to Cart Button - Circular */}
                    <button
                        onClick={handleAddToCart}
                        className="bg-premium-primary hover:bg-opacity-90 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transform hover:scale-110 transition-all duration-200 flex-shrink-0"
                        aria-label="Add to cart">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={3}>
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 4v16m8-8H4"
                            />
                        </svg>
                    </button>
                </div>

                {/* Rating (Optional) */}
                {product.rating && (
                    <div className="flex items-center gap-1 mt-3">
                        <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                                <span
                                    key={i}
                                    className={i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300"}>
                                    ★
                                </span>
                            ))}
                        </div>
                        <span className="text-xs text-gray-500">({product.reviews || 0})</span>
                    </div>
                )}
            </div>

            {/* Added to Cart Animation */}
            {isAdded && (
                <div className="absolute inset-0 bg-green-500 bg-opacity-95 flex flex-col items-center justify-center rounded-[--radius-card] animate-fadeIn">
                    <div className="text-white text-5xl mb-2 animate-bounce">✓</div>
                    <p className="text-white font-bold text-lg">Added to Cart!</p>
                </div>
            )}
        </div>
    )
}

export default ProductCard
