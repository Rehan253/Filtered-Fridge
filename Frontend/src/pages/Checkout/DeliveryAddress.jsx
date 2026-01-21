import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../../components/Navbar"
import { useCart } from "../../context/CartContext"
import { addInvoiceItem, createInvoice } from "../../api/invoices"

const DeliveryAddress = () => {
    const { cartItems, subtotal, tax, shipping, total, clearCart } = useCart()
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        apartment: "",
        city: "",
        state: "",
        zipCode: "",
        deliveryNotes: ""
    })
    const [errors, setErrors] = useState({})
    const [orderError, setOrderError] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: ""
            }))
        }
    }

    const validateForm = () => {
        const newErrors = {}

        if (!formData.fullName.trim()) newErrors.fullName = "Full name is required"
        if (!formData.email.trim()) {
            newErrors.email = "Email is required"
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid"
        }
        if (!formData.phone.trim()) {
            newErrors.phone = "Phone number is required"
        } else if (!/^\d{10}$/.test(formData.phone.replace(/[-\s]/g, ""))) {
            newErrors.phone = "Phone number must be 10 digits"
        }
        if (!formData.address.trim()) newErrors.address = "Street address is required"
        if (!formData.city.trim()) newErrors.city = "City is required"
        if (!formData.state.trim()) newErrors.state = "State is required"
        if (!formData.zipCode.trim()) {
            newErrors.zipCode = "ZIP code is required"
        } else if (!/^\d{5}$/.test(formData.zipCode)) {
            newErrors.zipCode = "ZIP code must be 5 digits"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (validateForm()) {
            setOrderError(null)
            setIsSubmitting(true)
            // Save delivery address to localStorage or context
            localStorage.setItem("freshexpress-delivery-address", JSON.stringify(formData))
            const invoiceResponse = await createInvoice({
                deliveryAddress: formData,
                paymentMethod: "cod"
            })
            if (invoiceResponse && invoiceResponse.status === "Error") {
                setOrderError(invoiceResponse.errorMessage || "Failed to place order")
                setIsSubmitting(false)
                return
            }

            const invoiceId = invoiceResponse.invoice_id
            const itemResponses = await Promise.all(
                cartItems.map((item) =>
                    addInvoiceItem(invoiceId, {
                        product_id: item.id,
                        quantity: item.quantity
                    })
                )
            )
            const failedItem = itemResponses.find((resp) => resp && resp.status === "Error")
            if (failedItem) {
                setOrderError(failedItem.errorMessage || "Failed to add items to order")
                setIsSubmitting(false)
                return
            }

            const orderData = {
                orderNumber: `INV-${invoiceId}`,
                date: new Date().toISOString(),
                items: cartItems,
                deliveryAddress: formData,
                paymentMethod: "cod",
                subtotal,
                tax,
                shipping,
                total
            }
            localStorage.setItem("freshexpress-last-order", JSON.stringify(orderData))
            clearCart()
            navigate("/checkout/confirmation")
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
                            <div className="flex items-center text-premium-primary">
                                <div className="flex items-center justify-center w-10 h-10 bg-premium-primary text-white rounded-full font-bold">
                                    1
                                </div>
                                <span className="ml-2 font-semibold">Delivery Address</span>
                            </div>
                            <div className="w-20 h-1 bg-gray-300 mx-4"></div>
                            <div className="flex items-center text-gray-400">
                                <div className="flex items-center justify-center w-10 h-10 bg-gray-300 text-gray-600 rounded-full font-bold">
                                    2
                                </div>
                                <span className="ml-2">Payment</span>
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

                {orderError && (
                    <div className="mb-6 p-4 rounded-[--radius-card] bg-red-100 text-red-700 border border-red-300">
                        {orderError}
                    </div>
                )}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left - Delivery Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-[--radius-card] shadow-md p-6">
                            <h2 className="text-2xl font-bold text-premium-text mb-6">Delivery Address</h2>

                            <form
                                onSubmit={handleSubmit}
                                className="space-y-4">
                                {/* Contact Information */}
                                <div>
                                    <h3 className="text-lg font-semibold text-premium-secondary mb-4">
                                        Contact Information
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Full Name <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="fullName"
                                                value={formData.fullName}
                                                onChange={handleChange}
                                                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none transition-colors ${
                                                    errors.fullName
                                                        ? "border-red-500 focus:border-red-500"
                                                        : "border-gray-300 focus:border-premium-primary"
                                                }`}
                                                placeholder="John Doe"
                                            />
                                            {errors.fullName && (
                                                <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Email <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none transition-colors ${
                                                    errors.email
                                                        ? "border-red-500 focus:border-red-500"
                                                        : "border-gray-300 focus:border-premium-primary"
                                                }`}
                                                placeholder="john@example.com"
                                            />
                                            {errors.email && (
                                                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Phone Number <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none transition-colors ${
                                                    errors.phone
                                                        ? "border-red-500 focus:border-red-500"
                                                        : "border-gray-300 focus:border-premium-primary"
                                                }`}
                                                placeholder="(555) 123-4567"
                                            />
                                            {errors.phone && (
                                                <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Shipping Address */}
                                <div className="pt-4">
                                    <h3 className="text-lg font-semibold text-premium-secondary mb-4">
                                        Shipping Address
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Street Address <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="address"
                                                value={formData.address}
                                                onChange={handleChange}
                                                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none transition-colors ${
                                                    errors.address
                                                        ? "border-red-500 focus:border-red-500"
                                                        : "border-gray-300 focus:border-premium-primary"
                                                }`}
                                                placeholder="123 Main Street"
                                            />
                                            {errors.address && (
                                                <p className="text-red-500 text-xs mt-1">{errors.address}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Apartment, Suite, etc. (Optional)
                                            </label>
                                            <input
                                                type="text"
                                                name="apartment"
                                                value={formData.apartment}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-premium-primary transition-colors"
                                                placeholder="Apt 4B"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    City <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="city"
                                                    value={formData.city}
                                                    onChange={handleChange}
                                                    className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none transition-colors ${
                                                        errors.city
                                                            ? "border-red-500 focus:border-red-500"
                                                            : "border-gray-300 focus:border-premium-primary"
                                                    }`}
                                                    placeholder="New York"
                                                />
                                                {errors.city && (
                                                    <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    State <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="state"
                                                    value={formData.state}
                                                    onChange={handleChange}
                                                    className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none transition-colors ${
                                                        errors.state
                                                            ? "border-red-500 focus:border-red-500"
                                                            : "border-gray-300 focus:border-premium-primary"
                                                    }`}
                                                    placeholder="NY"
                                                />
                                                {errors.state && (
                                                    <p className="text-red-500 text-xs mt-1">{errors.state}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    ZIP Code <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="zipCode"
                                                    value={formData.zipCode}
                                                    onChange={handleChange}
                                                    className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none transition-colors ${
                                                        errors.zipCode
                                                            ? "border-red-500 focus:border-red-500"
                                                            : "border-gray-300 focus:border-premium-primary"
                                                    }`}
                                                    placeholder="10001"
                                                />
                                                {errors.zipCode && (
                                                    <p className="text-red-500 text-xs mt-1">{errors.zipCode}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Delivery Notes (Optional)
                                            </label>
                                            <textarea
                                                name="deliveryNotes"
                                                value={formData.deliveryNotes}
                                                onChange={handleChange}
                                                rows={3}
                                                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-premium-primary transition-colors"
                                                placeholder="Any special instructions for delivery..."></textarea>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-4 pt-6">
                                    <button
                                        type="button"
                                        onClick={() => navigate("/")}
                                        className="flex-1 bg-white border-2 border-premium-secondary text-premium-secondary py-3 rounded-[--radius-button] font-semibold hover:bg-premium-secondary hover:text-white transition-all duration-200">
                                        Back to Shop
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 bg-premium-primary hover:bg-opacity-90 text-white py-3 rounded-[--radius-button] font-semibold shadow-lg hover:shadow-xl transition-all duration-200">
                                        {isSubmitting ? "Placing Order..." : "Place Order"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Right - Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-[--radius-card] shadow-md p-6 sticky top-24">
                            <h3 className="text-xl font-bold text-premium-text mb-4">Order Summary</h3>

                            {/* Cart Items */}
                            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                                {cartItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex gap-3 pb-3 border-b border-gray-200">
                                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <span className="text-2xl">{item.icon || "🛒"}</span>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-sm text-premium-text">{item.name}</h4>
                                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                            <p className="text-premium-primary font-bold text-sm">
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </p>
                                        </div>
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

export default DeliveryAddress
