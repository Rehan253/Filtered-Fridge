import { useState } from "react"
import { useCart } from "../../context/CartContext"

const ProductDetail = ({ product, isOpen, onClose, onAddToCart }) => {
    const { addToCart } = useCart()
    const [quantity, setQuantity] = useState(1)
    const [isAdded, setIsAdded] = useState(false)

    if (!isOpen || !product) return null

    const handleAddToCart = () => {
        // Add product with quantity
        for (let i = 0; i < quantity; i++) {
            if (onAddToCart) {
                onAddToCart(product)
            } else {
                addToCart(product)
            }
        }
        setIsAdded(true)
        setTimeout(() => {
            setIsAdded(false)
        }, 2000)
    }

    const handleQuantityChange = (delta) => {
        setQuantity(Math.max(1, quantity + delta))
    }

    const finalPrice =
        product.originalPrice && product.discount ? product.originalPrice * (1 - product.discount / 100) : product.price

    return (
        <div
            className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}>
            <div
                className="bg-white rounded-[--radius-card] shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="bg-premium-secondary text-white p-6 flex items-center justify-between sticky top-0 z-10">
                    <div>
                        <h2 className="text-2xl font-bold">{product.name}</h2>
                        <p className="text-sm opacity-90">{product.category}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="hover:bg-white/20 rounded-full p-2 transition-colors duration-200">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left: Image */}
                        <div className="relative bg-gray-100 rounded-xl h-64 md:h-80 flex items-center justify-center overflow-hidden">
                            {product.image ? (
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-9xl">{product.icon || "🛒"}</span>
                            )}
                            {product.discount && (
                                <div className="absolute top-4 right-4 bg-premium-accent text-white text-sm font-bold px-4 py-2 rounded-lg shadow-lg">
                                    {product.discount}% OFF
                                </div>
                            )}
                        </div>

                        {/* Right: Details */}
                        <div className="space-y-4">
                            {/* Price Section */}
                            <div>
                                <div className="flex items-baseline gap-3 mb-2">
                                    <span className="text-4xl font-bold text-premium-primary">
                                        ${finalPrice.toFixed(2)}
                                    </span>
                                    {product.originalPrice && product.discount && (
                                        <span className="text-xl text-gray-400 line-through">
                                            ${product.originalPrice.toFixed(2)}
                                        </span>
                                    )}
                                </div>
                                {product.unit && (
                                    <p className="text-gray-500 text-sm">
                                        ${finalPrice.toFixed(2)} / {product.unit}
                                    </p>
                                )}
                            </div>

                            {/* Rating */}
                            {product.rating && (
                                <div className="flex items-center gap-2">
                                    <div className="flex text-yellow-400">
                                        {[...Array(5)].map((_, i) => (
                                            <span
                                                key={i}
                                                className={
                                                    i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300"
                                                }>
                                                ★
                                            </span>
                                        ))}
                                    </div>
                                    <span className="text-sm text-gray-600">
                                        {product.rating.toFixed(1)} ({product.reviews || 0} reviews)
                                    </span>
                                </div>
                            )}

                            {/* Stock Status */}
                            <div>
                                {product.stock > 0 ? (
                                    <div className="flex items-center gap-2 text-green-600">
                                        <svg
                                            className="w-5 h-5"
                                            fill="currentColor"
                                            viewBox="0 0 20 20">
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        <span className="font-semibold">
                                            In Stock ({product.stock} {product.unit || "units"} available)
                                        </span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 text-red-600">
                                        <svg
                                            className="w-5 h-5"
                                            fill="currentColor"
                                            viewBox="0 0 20 20">
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        <span className="font-semibold">Out of Stock</span>
                                    </div>
                                )}
                            </div>

                            {/* Description */}
                            {product.description && (
                                <div>
                                    <h3 className="font-semibold text-premium-text mb-2">Description</h3>
                                    <p className="text-gray-600 text-sm">{product.description}</p>
                                </div>
                            )}

                            {/* Ingredients */}
                            {product.ingredients && product.ingredients.length > 0 && (
                                <div>
                                    <h3 className="font-semibold text-premium-text mb-2">Ingredients</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {product.ingredients.map((ingredient, index) => (
                                            <span
                                                key={index}
                                                className="bg-premium-background text-premium-text px-3 py-1.5 rounded-full text-sm font-medium">
                                                {ingredient}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Quantity Selector */}
                            <div className="flex items-center gap-4 pt-4">
                                <div className="flex items-center gap-3">
                                    <span className="font-semibold text-premium-text">Quantity:</span>
                                    <div className="flex items-center gap-2 border-2 border-gray-300 rounded-lg">
                                        <button
                                            onClick={() => handleQuantityChange(-1)}
                                            className="px-3 py-1 hover:bg-gray-100 transition-colors">
                                            <svg
                                                className="w-4 h-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M20 12H4"
                                                />
                                            </svg>
                                        </button>
                                        <span className="px-4 py-1 font-semibold min-w-[3rem] text-center">
                                            {quantity}
                                        </span>
                                        <button
                                            onClick={() => handleQuantityChange(1)}
                                            className="px-3 py-1 hover:bg-gray-100 transition-colors">
                                            <svg
                                                className="w-4 h-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 4v16m8-8H4"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Add to Cart Button */}
                            <button
                                onClick={handleAddToCart}
                                disabled={product.stock === 0 || isAdded}
                                className={`w-full py-3 px-6 rounded-[--radius-button] font-semibold text-white transition-all duration-200 ${
                                    product.stock === 0
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : isAdded
                                        ? "bg-green-500"
                                        : "bg-premium-primary hover:bg-opacity-90"
                                }`}>
                                {isAdded ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg
                                            className="w-5 h-5"
                                            fill="currentColor"
                                            viewBox="0 0 20 20">
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        Added to Cart!
                                    </span>
                                ) : product.stock === 0 ? (
                                    "Out of Stock"
                                ) : (
                                    `Add ${quantity} to Cart - $${(finalPrice * quantity).toFixed(2)}`
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductDetail
