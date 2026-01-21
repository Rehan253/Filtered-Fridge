import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../../components/Navbar"
import { generateInvoicePDF } from "../../utils/pdfInvoice"

const OrderConfirmation = () => {
    const navigate = useNavigate()
    const [order, setOrder] = useState(null)
    const [isDownloading, setIsDownloading] = useState(false)

    useEffect(() => {
        // Load last order from localStorage
        const lastOrder = localStorage.getItem("freshexpress-last-order")
        if (lastOrder) {
            setOrder(JSON.parse(lastOrder))
        } else {
            // If no order found, redirect to shop
            navigate("/")
        }
    }, [navigate])

    const downloadPDF = () => {
        if (!order) return

        setIsDownloading(true)
        // Small delay to show loading state
        setTimeout(() => {
            generateInvoicePDF(order)
            setIsDownloading(false)
        }, 300)
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-premium-background">
                <Navbar />
                <div className="flex items-center justify-center h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-premium-primary"></div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-premium-background">
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Success Animation */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-4 animate-bounce">
                        <svg
                            className="w-12 h-12 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-bold text-premium-text mb-2">Order Confirmed!</h1>
                    <p className="text-lg text-gray-600">Thank you for your purchase</p>
                </div>

                {/* Order Details Card */}
                <div className="bg-white rounded-[--radius-card] shadow-lg p-8 mb-6">
                    {/* Order Number & Date */}
                    <div className="border-b-2 border-gray-200 pb-6 mb-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Order Number</p>
                                <p className="text-2xl font-bold text-premium-primary">{order.orderNumber}</p>
                            </div>
                            <div className="mt-4 md:mt-0">
                                <p className="text-sm text-gray-500">Order Date</p>
                                <p className="text-lg font-semibold text-premium-text">
                                    {new Date(order.date).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric"
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="mb-6">
                        <h3 className="text-xl font-bold text-premium-text mb-4">Order Items</h3>
                        <div className="space-y-4">
                            {order.items.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex gap-4 p-4 bg-premium-background rounded-lg">
                                    <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <span className="text-3xl">{item.icon || "🛒"}</span>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-premium-text mb-1">{item.name}</h4>
                                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                        {item.unit && (
                                            <p className="text-xs text-gray-500">
                                                ${item.price} / {item.unit}
                                            </p>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-premium-primary">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Price Summary */}
                    <div className="border-t-2 border-gray-200 pt-6 mb-6">
                        <div className="space-y-2 max-w-sm ml-auto">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Subtotal</span>
                                <span className="font-semibold">${order.subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Tax</span>
                                <span className="font-semibold">${order.tax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Shipping</span>
                                <span className="font-semibold">
                                    {order.shipping === 0 ? (
                                        <span className="text-green-600">FREE</span>
                                    ) : (
                                        `$${order.shipping.toFixed(2)}`
                                    )}
                                </span>
                            </div>
                            <div className="border-t-2 border-gray-200 pt-2 mt-2">
                                <div className="flex justify-between">
                                    <span className="font-bold text-lg">Total Paid</span>
                                    <span className="font-bold text-2xl text-premium-primary">
                                        ${order.total.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Delivery Address */}
                    <div className="border-t-2 border-gray-200 pt-6">
                        <h3 className="text-lg font-bold text-premium-text mb-3">Delivery Address</h3>
                        <div className="bg-premium-background p-4 rounded-lg">
                            <p className="font-semibold text-premium-text">{order.deliveryAddress.fullName}</p>
                            <p className="text-gray-600 mt-1">
                                {order.deliveryAddress.address}
                                {order.deliveryAddress.apartment && `, ${order.deliveryAddress.apartment}`}
                            </p>
                            <p className="text-gray-600">
                                {order.deliveryAddress.city}, {order.deliveryAddress.state}{" "}
                                {order.deliveryAddress.zipCode}
                            </p>
                            <p className="text-gray-600 mt-2">
                                <span className="font-medium">Phone:</span> {order.deliveryAddress.phone}
                            </p>
                            <p className="text-gray-600">
                                <span className="font-medium">Email:</span> {order.deliveryAddress.email}
                            </p>
                            {order.deliveryAddress.deliveryNotes && (
                                <p className="text-gray-600 mt-2">
                                    <span className="font-medium">Notes:</span> {order.deliveryAddress.deliveryNotes}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div className="border-t-2 border-gray-200 pt-6 mt-6">
                        <h3 className="text-lg font-bold text-premium-text mb-3">Payment Method</h3>
                        <div className="flex items-center gap-3 bg-premium-background p-4 rounded-lg">
                            <div className="text-3xl">
                                {order.paymentMethod === "card" && "💳"}
                                {order.paymentMethod === "paypal" && "🅿️"}
                                {order.paymentMethod === "cod" && "💵"}
                            </div>
                            <div>
                                <p className="font-semibold text-premium-text">
                                    {order.paymentMethod === "card" && "Credit/Debit Card"}
                                    {order.paymentMethod === "paypal" && "PayPal"}
                                    {order.paymentMethod === "cod" && "Cash on Delivery"}
                                </p>
                                <p className="text-sm text-gray-600">Payment confirmed</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Delivery Status Info */}
                <div className="bg-gradient-to-r from-premium-primary to-premium-accent text-white rounded-[--radius-card] shadow-lg p-6 mb-6">
                    <div className="flex items-start gap-4">
                        <div className="text-4xl">📦</div>
                        <div>
                            <h3 className="text-xl font-bold mb-2">What's Next?</h3>
                            <p className="text-white/90 mb-2">
                                We're preparing your order for delivery! You'll receive an email confirmation shortly.
                            </p>
                            <p className="text-white/90">
                                Estimated delivery: <span className="font-bold">2-3 business days</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={downloadPDF}
                        disabled={isDownloading}
                        className="flex-1 bg-premium-accent hover:bg-opacity-90 text-white py-3 px-6 rounded-[--radius-button] font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                        {isDownloading ? (
                            <>
                                <svg
                                    className="animate-spin h-5 w-5"
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
                                Generating PDF...
                            </>
                        ) : (
                            <>
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
                                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    />
                                </svg>
                                Download PDF Invoice
                            </>
                        )}
                    </button>
                    <button
                        onClick={() => navigate("/profile")}
                        className="flex-1 bg-premium-secondary hover:bg-opacity-90 text-white py-3 px-6 rounded-[--radius-button] font-semibold shadow-lg hover:shadow-xl transition-all duration-200">
                        View Order History
                    </button>
                    <button
                        onClick={() => navigate("/")}
                        className="flex-1 bg-white border-2 border-premium-primary text-premium-primary hover:bg-premium-primary hover:text-white py-3 px-6 rounded-[--radius-button] font-semibold transition-all duration-200">
                        Continue Shopping
                    </button>
                </div>

                {/* Support Info */}
                <div className="mt-8 text-center text-gray-600">
                    <p className="text-sm">Need help with your order?</p>
                    <p className="text-sm">
                        Contact us at{" "}
                        <a
                            href="mailto:support@freshexpress.com"
                            className="text-premium-primary hover:underline font-semibold">
                            support@freshexpress.com
                        </a>{" "}
                        or call <span className="font-semibold">+1 (555) 123-4567</span>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default OrderConfirmation
