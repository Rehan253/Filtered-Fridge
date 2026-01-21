import { useCart } from "../../context/CartContext"
import { useNavigate } from "react-router-dom"

const CartSidebar = () => {
    const {
        cartItems,
        isCartOpen,
        closeCart,
        removeFromCart,
        updateQuantity,
        cartCount,
        subtotal,
        tax,
        shipping,
        total
    } = useCart()
    const navigate = useNavigate()

    const handleCheckout = () => {
        if (cartItems.length > 0) {
            closeCart()
            navigate("/checkout/delivery")
        }
    }

    return (
        <>
            {/* Cart Sidebar */}
            <div
                className={`fixed top-0 right-0 h-full w-full sm:w-[380px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
                    isCartOpen ? "translate-x-0" : "translate-x-full"
                }`}>
                {/* Header */}
                <div className="bg-premium-secondary text-white p-6 flex items-center justify-between flex-shrink-0">
                    <div>
                        <h2 className="text-2xl font-bold">Shopping Cart</h2>
                        <p className="text-sm opacity-90">
                            {cartCount} {cartCount === 1 ? "item" : "items"}
                        </p>
                    </div>
                    <button
                        onClick={closeCart}
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

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {cartItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center py-16">
                            <div className="text-8xl mb-4">🛒</div>
                            <h3 className="text-xl font-bold text-premium-text mb-2">Your cart is empty</h3>
                            <p className="text-gray-500 mb-6">Add some products to get started!</p>
                            <button
                                onClick={closeCart}
                                className="bg-premium-primary hover:bg-opacity-90 text-white px-6 py-2 rounded-[--radius-button] font-semibold transition-all duration-200">
                                Continue Shopping
                            </button>
                        </div>
                    ) : (
                        cartItems.map((item) => (
                            <div
                                key={item.id}
                                className="flex gap-4 bg-premium-background p-4 rounded-[--radius-card] hover:shadow-md transition-shadow duration-200">
                                {/* Product Image */}
                                <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    {item.image ? (
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-full object-cover rounded-lg"
                                        />
                                    ) : (
                                        <span className="text-4xl">{item.icon || "🛒"}</span>
                                    )}
                                </div>

                                {/* Product Details */}
                                <div className="flex-1">
                                    <h4 className="font-bold text-premium-text text-sm mb-1">{item.name}</h4>
                                    <p className="text-premium-primary font-semibold text-lg">
                                        ${item.price.toFixed(2)}
                                    </p>
                                    {item.unit && (
                                        <p className="text-xs text-gray-500">
                                            ${item.price} / {item.unit}
                                        </p>
                                    )}

                                    {/* Quantity Controls */}
                                    <div className="flex items-center gap-3 mt-3">
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            className="w-7 h-7 rounded-full bg-white border-2 border-premium-primary text-premium-primary hover:bg-premium-primary hover:text-white transition-all duration-200 flex items-center justify-center font-bold">
                                            −
                                        </button>
                                        <span className="font-semibold text-premium-text w-8 text-center">
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            className="w-7 h-7 rounded-full bg-premium-primary text-white hover:bg-opacity-90 transition-all duration-200 flex items-center justify-center font-bold">
                                            +
                                        </button>
                                    </div>
                                </div>

                                {/* Remove Button */}
                                <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="text-gray-400 hover:text-red-500 transition-colors duration-200 self-start">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                        />
                                    </svg>
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {/* Cart Summary & Checkout */}
                {cartItems.length > 0 && (
                    <div className="border-t-2 border-gray-200 p-6 bg-white flex-shrink-0">
                        {/* Price Breakdown */}
                        <div className="space-y-2 mb-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Subtotal</span>
                                <span className="font-semibold text-premium-text">${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Tax (10%)</span>
                                <span className="font-semibold text-premium-text">${tax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Shipping</span>
                                <span className="font-semibold text-premium-text">
                                    {shipping === 0 ? (
                                        <span className="text-green-600">FREE</span>
                                    ) : (
                                        `$${shipping.toFixed(2)}`
                                    )}
                                </span>
                            </div>
                            {subtotal < 50 && shipping > 0 && (
                                <p className="text-xs text-premium-accent">
                                    Add ${(50 - subtotal).toFixed(2)} more for FREE shipping!
                                </p>
                            )}
                            <div className="border-t-2 border-gray-200 pt-2 mt-2">
                                <div className="flex justify-between">
                                    <span className="font-bold text-lg text-premium-text">Total</span>
                                    <span className="font-bold text-xl text-premium-primary">${total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Checkout Button */}
                        <button
                            onClick={handleCheckout}
                            className="w-full bg-premium-primary hover:bg-opacity-90 text-white py-3 rounded-[--radius-button] font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                            Proceed to Checkout
                        </button>

                        <button
                            onClick={closeCart}
                            className="w-full mt-3 bg-white border-2 border-premium-secondary text-premium-secondary py-2 rounded-[--radius-button] font-semibold hover:bg-premium-secondary hover:text-white transition-all duration-200">
                            Continue Shopping
                        </button>
                    </div>
                )}
            </div>
        </>
    )
}

export default CartSidebar
