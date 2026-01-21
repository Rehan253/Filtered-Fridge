import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../../components/Navbar"
import { useCart } from "../../context/CartContext"

const Payment = () => {
    const { cartItems, subtotal, tax, shipping, total, clearCart } = useCart()
    const navigate = useNavigate()
    const [paymentMethod, setPaymentMethod] = useState("card")
    const [formData, setFormData] = useState({
        cardNumber: "",
        cardName: "",
        expiryDate: "",
        cvv: "",
        saveCard: false
    })
    const [errors, setErrors] = useState({})
    const [isProcessing, setIsProcessing] = useState(false)

    // Load delivery address from localStorage
    const deliveryAddress = JSON.parse(localStorage.getItem("freshexpress-delivery-address") || "{}")

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }))
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: ""
            }))
        }
    }

    const formatCardNumber = (value) => {
        return value
            .replace(/\s/g, "")
            .replace(/(\d{4})/g, "$1 ")
            .trim()
    }

    const handleCardNumberChange = (e) => {
        const value = e.target.value.replace(/\D/g, "")
        if (value.length <= 16) {
            setFormData((prev) => ({
                ...prev,
                cardNumber: formatCardNumber(value)
            }))
        }
    }

    const handleExpiryChange = (e) => {
        let value = e.target.value.replace(/\D/g, "")
        if (value.length >= 2) {
            value = value.slice(0, 2) + "/" + value.slice(2, 4)
        }
        if (value.length <= 5) {
            setFormData((prev) => ({
                ...prev,
                expiryDate: value
            }))
        }
    }

    const validateForm = () => {
        if (paymentMethod !== "card") return true // Other payment methods don't need validation yet

        const newErrors = {}

        if (!formData.cardNumber.replace(/\s/g, "")) {
            newErrors.cardNumber = "Card number is required"
        } else if (formData.cardNumber.replace(/\s/g, "").length !== 16) {
            newErrors.cardNumber = "Card number must be 16 digits"
        }

        if (!formData.cardName.trim()) {
            newErrors.cardName = "Cardholder name is required"
        }

        if (!formData.expiryDate) {
            newErrors.expiryDate = "Expiry date is required"
        } else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
            newErrors.expiryDate = "Invalid expiry date format (MM/YY)"
        }

        if (!formData.cvv) {
            newErrors.cvv = "CVV is required"
        } else if (!/^\d{3,4}$/.test(formData.cvv)) {
            newErrors.cvv = "CVV must be 3 or 4 digits"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (validateForm()) {
            setIsProcessing(true)

            // Simulate payment processing
            setTimeout(() => {
                // Save order details
                const orderData = {
                    orderNumber: `FE${Date.now()}`,
                    date: new Date().toISOString(),
                    items: cartItems,
                    deliveryAddress,
                    paymentMethod,
                    subtotal,
                    tax,
                    shipping,
                    total
                }
                localStorage.setItem("freshexpress-last-order", JSON.stringify(orderData))

                // Clear cart
                clearCart()

                // Navigate to confirmation
                setIsProcessing(false)
                navigate("/checkout/confirmation")
            }, 2000)
        }
    }

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-premium-background">
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 py-16 text-center">
                    <div className="text-8xl mb-4">🛒</div>
                    <h2 className="text-3xl font-bold text-premium-text mb-4">Your cart is empty</h2>
                    <p className="text-gray-600 mb-8">Add some products before checking out</p>
                    <button
                        onClick={() => navigate("/")}
                        className="bg-premium-primary hover:bg-opacity-90 text-white px-8 py-3 rounded-[--radius-button] font-semibold">
                        Continue Shopping
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-premium-background">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Progress Steps */}
                <div className="mb-8">
                    <div className="flex items-center justify-center">
                        <div className="flex items-center">
                            <div className="flex items-center text-green-600">
                                <div className="flex items-center justify-center w-10 h-10 bg-green-600 text-white rounded-full">
                                    ✓
                                </div>
                                <span className="ml-2 font-semibold">Delivery Address</span>
                            </div>
                            <div className="w-20 h-1 bg-premium-primary mx-4"></div>
                            <div className="flex items-center text-premium-primary">
                                <div className="flex items-center justify-center w-10 h-10 bg-premium-primary text-white rounded-full font-bold">
                                    2
                                </div>
                                <span className="ml-2 font-semibold">Payment</span>
                            </div>
                            <div className="w-20 h-1 bg-gray-300 mx-4"></div>
                            <div className="flex items-center text-gray-400">
                                <div className="flex items-center justify-center w-10 h-10 bg-gray-300 text-gray-600 rounded-full font-bold">
                                    3
                                </div>
                                <span className="ml-2">Confirmation</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left - Payment Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-[--radius-card] shadow-md p-6">
                            <h2 className="text-2xl font-bold text-premium-text mb-6">Payment Method</h2>

                            <form
                                onSubmit={handleSubmit}
                                className="space-y-6">
                                {/* Payment Method Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Select Payment Method
                                    </label>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setPaymentMethod("card")}
                                            className={`p-4 border-2 rounded-lg transition-all duration-200 ${
                                                paymentMethod === "card"
                                                    ? "border-premium-primary bg-premium-primary/10"
                                                    : "border-gray-300 hover:border-premium-primary"
                                            }`}>
                                            <div className="text-3xl mb-2">💳</div>
                                            <div className="font-semibold">Credit/Debit Card</div>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setPaymentMethod("paypal")}
                                            className={`p-4 border-2 rounded-lg transition-all duration-200 ${
                                                paymentMethod === "paypal"
                                                    ? "border-premium-primary bg-premium-primary/10"
                                                    : "border-gray-300 hover:border-premium-primary"
                                            }`}>
                                            <div className="text-3xl mb-2">🅿️</div>
                                            <div className="font-semibold">PayPal</div>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setPaymentMethod("cod")}
                                            className={`p-4 border-2 rounded-lg transition-all duration-200 ${
                                                paymentMethod === "cod"
                                                    ? "border-premium-primary bg-premium-primary/10"
                                                    : "border-gray-300 hover:border-premium-primary"
                                            }`}>
                                            <div className="text-3xl mb-2">💵</div>
                                            <div className="font-semibold">Cash on Delivery</div>
                                        </button>
                                    </div>
                                </div>

                                {/* Card Details (shown only if card is selected) */}
                                {paymentMethod === "card" && (
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-premium-secondary">Card Details</h3>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Card Number <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="cardNumber"
                                                value={formData.cardNumber}
                                                onChange={handleCardNumberChange}
                                                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none transition-colors ${
                                                    errors.cardNumber
                                                        ? "border-red-500 focus:border-red-500"
                                                        : "border-gray-300 focus:border-premium-primary"
                                                }`}
                                                placeholder="1234 5678 9012 3456"
                                            />
                                            {errors.cardNumber && (
                                                <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Cardholder Name <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="cardName"
                                                value={formData.cardName}
                                                onChange={handleChange}
                                                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none transition-colors ${
                                                    errors.cardName
                                                        ? "border-red-500 focus:border-red-500"
                                                        : "border-gray-300 focus:border-premium-primary"
                                                }`}
                                                placeholder="John Doe"
                                            />
                                            {errors.cardName && (
                                                <p className="text-red-500 text-xs mt-1">{errors.cardName}</p>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Expiry Date <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="expiryDate"
                                                    value={formData.expiryDate}
                                                    onChange={handleExpiryChange}
                                                    className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none transition-colors ${
                                                        errors.expiryDate
                                                            ? "border-red-500 focus:border-red-500"
                                                            : "border-gray-300 focus:border-premium-primary"
                                                    }`}
                                                    placeholder="MM/YY"
                                                />
                                                {errors.expiryDate && (
                                                    <p className="text-red-500 text-xs mt-1">{errors.expiryDate}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    CVV <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="cvv"
                                                    value={formData.cvv}
                                                    onChange={(e) => {
                                                        const value = e.target.value.replace(/\D/g, "")
                                                        if (value.length <= 4) {
                                                            setFormData((prev) => ({ ...prev, cvv: value }))
                                                        }
                                                    }}
                                                    className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none transition-colors ${
                                                        errors.cvv
                                                            ? "border-red-500 focus:border-red-500"
                                                            : "border-gray-300 focus:border-premium-primary"
                                                    }`}
                                                    placeholder="123"
                                                />
                                                {errors.cvv && (
                                                    <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                name="saveCard"
                                                checked={formData.saveCard}
                                                onChange={handleChange}
                                                className="w-4 h-4 text-premium-primary border-gray-300 rounded focus:ring-premium-primary"
                                            />
                                            <label className="ml-2 text-sm text-gray-700">
                                                Save card for future purchases
                                            </label>
                                        </div>
                                    </div>
                                )}

                                {paymentMethod === "paypal" && (
                                    <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-6 text-center">
                                        <div className="text-5xl mb-3">🅿️</div>
                                        <h3 className="font-bold text-lg mb-2">PayPal Payment</h3>
                                        <p className="text-sm text-gray-600 mb-4">
                                            You will be redirected to PayPal to complete your payment securely.
                                        </p>
                                    </div>
                                )}

                                {paymentMethod === "cod" && (
                                    <div className="bg-green-50 border-2 border-green-400 rounded-lg p-6 text-center">
                                        <div className="text-5xl mb-3">💵</div>
                                        <h3 className="font-bold text-lg mb-2">Cash on Delivery</h3>
                                        <p className="text-sm text-gray-600 mb-4">
                                            Pay with cash when your order is delivered to your doorstep.
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            Note: COD may not be available for all locations.
                                        </p>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex gap-4 pt-6">
                                    <button
                                        type="button"
                                        onClick={() => navigate("/checkout/delivery")}
                                        disabled={isProcessing}
                                        className="flex-1 bg-white border-2 border-premium-secondary text-premium-secondary py-3 rounded-[--radius-button] font-semibold hover:bg-premium-secondary hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                                        Back to Delivery
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isProcessing}
                                        className="flex-1 bg-premium-primary hover:bg-opacity-90 text-white py-3 rounded-[--radius-button] font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                                        {isProcessing ? (
                                            <>
                                                <svg
                                                    className="animate-spin h-5 w-5 mr-2"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24">
                                                    <circle
                                                        className="opacity-25"
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                        stroke="currentColor"
                                                        strokeWidth="4"></circle>
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Processing...
                                            </>
                                        ) : (
                                            "Place Order"
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Right - Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-[--radius-card] shadow-md p-6 sticky top-24">
                            <h3 className="text-xl font-bold text-premium-text mb-4">Order Summary</h3>

                            {/* Delivery Address */}
                            {deliveryAddress.fullName && (
                                <div className="mb-4 pb-4 border-b border-gray-200">
                                    <h4 className="font-semibold text-sm text-gray-700 mb-2">Delivery Address</h4>
                                    <p className="text-sm text-gray-600">
                                        {deliveryAddress.fullName}
                                        <br />
                                        {deliveryAddress.address}
                                        {deliveryAddress.apartment && `, ${deliveryAddress.apartment}`}
                                        <br />
                                        {deliveryAddress.city}, {deliveryAddress.state} {deliveryAddress.zipCode}
                                    </p>
                                </div>
                            )}

                            {/* Cart Items */}
                            <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                                {cartItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex gap-3 text-sm">
                                        <span className="text-2xl">{item.icon || "🛒"}</span>
                                        <div className="flex-1">
                                            <p className="font-semibold text-premium-text">{item.name}</p>
                                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="font-bold text-premium-primary">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* Price Breakdown */}
                            <div className="space-y-2 pt-4 border-t-2 border-gray-200">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-semibold">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Tax</span>
                                    <span className="font-semibold">${tax.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Shipping</span>
                                    <span className="font-semibold">
                                        {shipping === 0 ? (
                                            <span className="text-green-600">FREE</span>
                                        ) : (
                                            `$${shipping.toFixed(2)}`
                                        )}
                                    </span>
                                </div>
                                <div className="border-t-2 border-gray-200 pt-2 mt-2">
                                    <div className="flex justify-between">
                                        <span className="font-bold text-lg">Total</span>
                                        <span className="font-bold text-xl text-premium-primary">
                                            ${total.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Payment
