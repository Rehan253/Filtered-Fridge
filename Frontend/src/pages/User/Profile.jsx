import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import Navbar from "../../components/Navbar"
import { sampleOrders, getOrderStatusColor, getOrderStatusIcon } from "../../data/orders"
import { generateInvoicePDF } from "../../utils/pdfInvoice"
import authStore from "../../data/Auth"
import { getUserPreferences, updateUserPreferences } from "../../api/auth"
import { getInvoiceById, getMyInvoices } from "../../api/invoices"

const Profile = () => {
    const [activeTab, setActiveTab] = useState("preferences")
    const [expandedOrder, setExpandedOrder] = useState(null)
    const [isDownloading, setIsDownloading] = useState(null)
    const { user, isAuthenticated, getMe } = authStore()
    const [orders, setOrders] = useState([])
    const [ordersLoading, setOrdersLoading] = useState(false)
    const [ordersError, setOrdersError] = useState(null)

    const getPreferenceStorageKey = (userId) => (userId ? `userPreferences:${userId}` : "userPreferences:guest")

    const [preferences, setPreferences] = useState({
        allergies: [],
        dietaryPreferences: [],
        halalOnly: false,
        vegetarian: false,
        vegan: false,
        kosher: false
    })

    const displayUser = {
        name:
            [user?.first_name, user?.last_name].filter(Boolean).join(" ").trim() ||
            "John Doe",
        email: user?.email || "john.doe@example.com",
        phone: user?.phone_number || "+1 (555) 123-4567",
        joinDate: user?.created_at || user?.joinDate || "2025-12-15",
        totalOrders: orders.length ?? sampleOrders.length,
        membershipLevel: user?.role === "admin" ? "Admin" : "Gold"
    }

    const savePreferences = async (newPreferences) => {
        setPreferences(newPreferences)
        const storageKey = getPreferenceStorageKey(user?.id)
        localStorage.setItem(storageKey, JSON.stringify(newPreferences))
        if (isAuthenticated) {
            await updateUserPreferences(newPreferences)
        }
    }

    useEffect(() => {
        const loadPreferences = async () => {
            const storageKey = getPreferenceStorageKey(user?.id)
            const saved = localStorage.getItem(storageKey)
            if (saved) {
                try {
                    setPreferences(JSON.parse(saved))
                } catch {
                    localStorage.removeItem(storageKey)
                }
            }

            if (isAuthenticated) {
                const response = await getUserPreferences()
                if (!(response && response.status === "Error") && response) {
                    setPreferences(response)
                    localStorage.setItem(storageKey, JSON.stringify(response))
                }
            }
        }

        loadPreferences()
    }, [isAuthenticated, user?.id])

    useEffect(() => {
        if (isAuthenticated) {
            getMe()
        }
    }, [isAuthenticated, getMe])

    useEffect(() => {
        const loadOrders = async () => {
            if (!isAuthenticated) {
                setOrders(sampleOrders)
                return
            }

            setOrdersLoading(true)
            setOrdersError(null)

            const invoices = await getMyInvoices()
            if (invoices && invoices.status === "Error") {
                setOrdersError(invoices.errorMessage || "Failed to load orders")
                setOrdersLoading(false)
                return
            }

            const list = Array.isArray(invoices) ? invoices : invoices?.data || []
            if (!list.length) {
                setOrders([])
                setOrdersLoading(false)
                return
            }

            const details = await Promise.all(
                list.map((invoice) => getInvoiceById(invoice.invoice_id))
            )

            const mapped = details
                .filter((item) => item && item.status !== "Error")
                .map((invoice) => ({
                    id: `INV-${invoice.invoice_id}`,
                    date: invoice.created_at,
                    status: "processing",
                    total: invoice.total_amount,
                    items: invoice.items.map((item) => ({
                        id: item.product_id,
                        name: item.product_name,
                        quantity: item.quantity,
                        price: item.unit_price,
                        unit: "unit",
                        icon: "🛒"
                    })),
                    deliveryAddress: invoice.deliveryAddress?.address
                        ? [
                              invoice.deliveryAddress.address,
                              invoice.deliveryAddress.apartment,
                              invoice.deliveryAddress.city,
                              invoice.deliveryAddress.state,
                              invoice.deliveryAddress.zipCode
                          ]
                              .filter(Boolean)
                              .join(", ")
                        : user?.address
                        ? [user.address, user.city, user.zip_code, user.country].filter(Boolean).join(", ")
                        : "N/A",
                    paymentMethod: invoice.paymentMethod || "N/A"
                }))

            setOrders(mapped)
            setOrdersLoading(false)
        }

        loadOrders()
    }, [isAuthenticated, user?.address, user?.city, user?.zip_code, user?.country])

    const toggleOrderExpansion = (orderId) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId)
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
        })
    }

    const downloadInvoice = (order) => {
        setIsDownloading(order.id)
        // Small delay to show loading state
        setTimeout(() => {
            generateInvoicePDF(order)
            setIsDownloading(null)
        }, 300)
    }

    return (
        <div className="min-h-screen bg-premium-background">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-premium-text mb-2">My Account</h1>
                    <p className="text-gray-600">Manage your profile and view your order history</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Sidebar - User Info */}
                    <div className="lg:w-1/4">
                        <div className="bg-white rounded-[--radius-card] shadow-md p-6 sticky top-24">
                            {/* Profile Picture Placeholder */}
                            <div className="flex flex-col items-center mb-6">
                                <div className="w-24 h-24 bg-gradient-to-br from-premium-primary to-premium-accent rounded-full flex items-center justify-center text-white text-3xl font-bold mb-3">
                                    {displayUser.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                </div>
                                <h2 className="text-xl font-bold text-premium-text">{displayUser.name}</h2>
                                <p className="text-sm text-gray-500">{displayUser.membershipLevel} Member</p>
                            </div>

                            {/* User Info */}
                            <div className="space-y-3 mb-6">
                                <div className="flex items-start gap-2">
                                    <svg
                                        className="w-5 h-5 text-premium-secondary mt-0.5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                        />
                                    </svg>
                                    <div>
                                        <p className="text-xs text-gray-500">Email</p>
                                        <p className="text-sm text-premium-text">{displayUser.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <svg
                                        className="w-5 h-5 text-premium-secondary mt-0.5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                        />
                                    </svg>
                                    <div>
                                        <p className="text-xs text-gray-500">Phone</p>
                                        <p className="text-sm text-premium-text">{displayUser.phone}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <svg
                                        className="w-5 h-5 text-premium-secondary mt-0.5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        />
                                    </svg>
                                    <div>
                                        <p className="text-xs text-gray-500">Member Since</p>
                                        <p className="text-sm text-premium-text">{formatDate(displayUser.joinDate)}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="border-t border-gray-200 pt-4 mb-6">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm text-gray-600">Total Orders</span>
                                    <span className="text-lg font-bold text-premium-primary">{displayUser.totalOrders}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Member Points</span>
                                    <span className="text-lg font-bold text-premium-secondary">1,250</span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <Link
                                to="/edit-profile"
                                className="w-full bg-premium-primary hover:bg-opacity-90 text-white py-2 rounded-[--radius-button] font-semibold mb-2 transition-all duration-200 block text-center">
                                Edit Profile
                            </Link>
                            <button className="w-full bg-white border-2 border-gray-300 hover:border-premium-secondary text-premium-text py-2 rounded-[--radius-button] font-semibold transition-all duration-200">
                                Log Out
                            </button>
                        </div>
                    </div>

                    {/* Main Content - Orders */}
                    <div className="lg:w-3/4">
                        {/* Tabs */}
                        <div className="bg-white rounded-[--radius-card] shadow-md mb-6">
                            <div className="flex border-b border-gray-200">
                                <button
                                    onClick={() => setActiveTab("preferences")}
                                    className={`flex-1 py-4 px-6 font-semibold transition-colors ${
                                        activeTab === "preferences"
                                            ? "text-premium-primary border-b-2 border-premium-primary"
                                            : "text-gray-500 hover:text-premium-secondary"
                                    }`}>
                                    Preferences
                                </button>
                                <button
                                    onClick={() => setActiveTab("orders")}
                                    className={`flex-1 py-4 px-6 font-semibold transition-colors ${
                                        activeTab === "orders"
                                            ? "text-premium-primary border-b-2 border-premium-primary"
                                            : "text-gray-500 hover:text-premium-secondary"
                                    }`}>
                                    Order History
                                </button>
                                <button
                                    onClick={() => setActiveTab("addresses")}
                                    className={`flex-1 py-4 px-6 font-semibold transition-colors ${
                                        activeTab === "addresses"
                                            ? "text-premium-primary border-b-2 border-premium-primary"
                                            : "text-gray-500 hover:text-premium-secondary"
                                    }`}>
                                    Addresses
                                </button>
                            </div>
                        </div>

                        {/* Preferences Tab */}
                        {activeTab === "preferences" && (
                            <div className="bg-white rounded-[--radius-card] shadow-md p-8">
                                <h3 className="text-2xl font-bold text-premium-text mb-6">
                                    Dietary Preferences & Allergies
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    Set your dietary preferences and allergies to see only products that match your
                                    needs.
                                </p>

                                <div className="space-y-8">
                                    {/* Dietary Preferences */}
                                    <div>
                                        <h4 className="text-lg font-semibold text-premium-text mb-4">
                                            Dietary Preferences
                                        </h4>
                                        <div className="space-y-3">
                                            <label className="flex items-center gap-3 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={preferences.halalOnly}
                                                    onChange={(e) =>
                                                        savePreferences({
                                                            ...preferences,
                                                            halalOnly: e.target.checked
                                                        })
                                                    }
                                                    className="w-5 h-5 text-premium-primary border-gray-300 rounded focus:ring-premium-primary"
                                                />
                                                <span className="text-premium-text font-medium">Halal Only</span>
                                            </label>
                                            <label className="flex items-center gap-3 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={preferences.vegetarian}
                                                    onChange={(e) =>
                                                        savePreferences({
                                                            ...preferences,
                                                            vegetarian: e.target.checked
                                                        })
                                                    }
                                                    className="w-5 h-5 text-premium-primary border-gray-300 rounded focus:ring-premium-primary"
                                                />
                                                <span className="text-premium-text font-medium">Vegetarian</span>
                                            </label>
                                            <label className="flex items-center gap-3 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={preferences.vegan}
                                                    onChange={(e) =>
                                                        savePreferences({
                                                            ...preferences,
                                                            vegan: e.target.checked
                                                        })
                                                    }
                                                    className="w-5 h-5 text-premium-primary border-gray-300 rounded focus:ring-premium-primary"
                                                />
                                                <span className="text-premium-text font-medium">Vegan</span>
                                            </label>
                                            <label className="flex items-center gap-3 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={preferences.kosher}
                                                    onChange={(e) =>
                                                        savePreferences({
                                                            ...preferences,
                                                            kosher: e.target.checked
                                                        })
                                                    }
                                                    className="w-5 h-5 text-premium-primary border-gray-300 rounded focus:ring-premium-primary"
                                                />
                                                <span className="text-premium-text font-medium">Kosher</span>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Allergies */}
                                    <div>
                                        <h4 className="text-lg font-semibold text-premium-text mb-4">Allergies</h4>
                                        <p className="text-sm text-gray-500 mb-3">
                                            Select all that apply. Products containing these ingredients will be hidden.
                                        </p>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                            {[
                                                "Nuts",
                                                "Peanuts",
                                                "Dairy",
                                                "Eggs",
                                                "Soy",
                                                "Wheat",
                                                "Gluten",
                                                "Shellfish",
                                                "Fish",
                                                "Sesame",
                                                "Sulfites",
                                                "Lactose"
                                            ].map((allergy) => (
                                                <label
                                                    key={allergy}
                                                    className="flex items-center gap-2 cursor-pointer p-3 bg-premium-background rounded-lg hover:bg-gray-100 transition-colors">
                                                    <input
                                                        type="checkbox"
                                                        checked={preferences.allergies.includes(allergy)}
                                                        onChange={(e) => {
                                                            const newAllergies = e.target.checked
                                                                ? [...preferences.allergies, allergy]
                                                                : preferences.allergies.filter((a) => a !== allergy)
                                                            savePreferences({
                                                                ...preferences,
                                                                allergies: newAllergies
                                                            })
                                                        }}
                                                        className="w-4 h-4 text-premium-primary border-gray-300 rounded focus:ring-premium-primary"
                                                    />
                                                    <span className="text-sm text-premium-text">{allergy}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Save Button */}
                                    <div className="pt-4 border-t border-gray-200">
                                        <button
                                            onClick={() => {
                                                // Trigger storage event to update Shop page
                                                window.dispatchEvent(new Event("storage"))
                                                // Also trigger a custom event
                                                window.dispatchEvent(
                                                    new CustomEvent("preferencesUpdated", {
                                                        detail: preferences
                                                    })
                                                )
                                                alert(
                                                    "Preferences saved successfully! Products will be filtered based on your preferences."
                                                )
                                            }}
                                            className="bg-premium-primary hover:bg-opacity-90 text-white px-8 py-3 rounded-[--radius-button] font-semibold transition-all duration-200">
                                            Save Preferences
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Orders List */}
                        {activeTab === "orders" && (
                            <div className="space-y-4">
                                    {ordersLoading ? (
                                        <div className="bg-white rounded-[--radius-card] shadow-md p-12 text-center">
                                            <div className="text-4xl mb-4">⏳</div>
                                            <h3 className="text-xl font-bold text-premium-text mb-2">
                                                Loading orders...
                                            </h3>
                                        </div>
                                    ) : ordersError ? (
                                        <div className="bg-white rounded-[--radius-card] shadow-md p-12 text-center">
                                            <div className="text-4xl mb-4">⚠️</div>
                                            <h3 className="text-xl font-bold text-premium-text mb-2">
                                                {ordersError}
                                            </h3>
                                        </div>
                                    ) : orders.length > 0 ? (
                                        orders.map((order) => (
                                        <div
                                            key={order.id}
                                            className="bg-white rounded-[--radius-card] shadow-md overflow-hidden">
                                            {/* Order Header */}
                                            <div
                                                className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                                                onClick={() => toggleOrderExpansion(order.id)}>
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <h3 className="text-lg font-bold text-premium-text mb-1">
                                                            Order {order.id}
                                                        </h3>
                                                        <p className="text-sm text-gray-500">
                                                            Placed on {formatDate(order.date)}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-2xl font-bold text-premium-primary mb-1">
                                                            ${order.total.toFixed(2)}
                                                        </p>
                                                        <span
                                                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getOrderStatusColor(
                                                                order.status
                                                            )}`}>
                                                            <span>{getOrderStatusIcon(order.status)}</span>
                                                            {order.status.charAt(0).toUpperCase() +
                                                                order.status.slice(1)}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Quick Order Summary */}
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm text-gray-600">
                                                            {order.items.length} item
                                                            {order.items.length !== 1 ? "s" : ""}
                                                        </span>
                                                        <span className="text-gray-300">•</span>
                                                        <div className="flex -space-x-2">
                                                            {order.items.slice(0, 4).map((item, idx) => (
                                                                <div
                                                                    key={idx}
                                                                    className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center border-2 border-white">
                                                                    <span className="text-sm">{item.icon}</span>
                                                                </div>
                                                            ))}
                                                            {order.items.length > 4 && (
                                                                <div className="w-8 h-8 bg-premium-primary text-white rounded-full flex items-center justify-center border-2 border-white text-xs font-bold">
                                                                    +{order.items.length - 4}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <svg
                                                        className={`w-5 h-5 text-gray-400 transition-transform ${
                                                            expandedOrder === order.id ? "transform rotate-180" : ""
                                                        }`}
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor">
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M19 9l-7 7-7-7"
                                                        />
                                                    </svg>
                                                </div>
                                            </div>

                                            {/* Expanded Order Details */}
                                            {expandedOrder === order.id && (
                                                <div className="border-t border-gray-200 p-6 bg-gray-50">
                                                    {/* Order Items */}
                                                    <div className="mb-6">
                                                        <h4 className="font-semibold text-premium-text mb-3">
                                                            Order Items
                                                        </h4>
                                                        <div className="space-y-3">
                                                            {order.items.map((item, idx) => (
                                                                <div
                                                                    key={idx}
                                                                    className="flex items-center justify-between bg-white p-3 rounded-lg">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                                                            <span className="text-2xl">
                                                                                {item.icon}
                                                                            </span>
                                                                        </div>
                                                                        <div>
                                                                            <p className="font-semibold text-premium-text">
                                                                                {item.name}
                                                                            </p>
                                                                            <p className="text-sm text-gray-500">
                                                                                Qty: {item.quantity} × ${item.price}/
                                                                                {item.unit}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    <p className="font-bold text-premium-primary">
                                                                        ${(item.quantity * item.price).toFixed(2)}
                                                                    </p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Delivery Info */}
                                                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                                                        <div className="bg-white p-4 rounded-lg">
                                                            <h4 className="font-semibold text-premium-text mb-2">
                                                                Delivery Address
                                                            </h4>
                                                            <p className="text-sm text-gray-600">
                                                                {order.deliveryAddress}
                                                            </p>
                                                        </div>
                                                        <div className="bg-white p-4 rounded-lg">
                                                            <h4 className="font-semibold text-premium-text mb-2">
                                                                Delivery Date
                                                            </h4>
                                                            <p className="text-sm text-gray-600">
                                                                {order.deliveryDate
                                                                    ? formatDate(order.deliveryDate)
                                                                    : order.estimatedDelivery
                                                                    ? `Estimated: ${formatDate(
                                                                          order.estimatedDelivery
                                                                      )}`
                                                                    : "N/A"}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Order Actions */}
                                                    <div className="flex justify-center gap-3">
                                                        {order.status === "processing" && (
                                                            <button className="flex-1 bg-premium-accent hover:bg-opacity-90 text-white py-2 px-4 rounded-[--radius-button] font-semibold transition-all duration-200">
                                                                Cancel Order
                                                            </button>
                                                        )}
                                                        {order.status !== "cancelled" && (
                                                            <button
                                                                onClick={() => downloadInvoice(order)}
                                                                disabled={isDownloading === order.id}
                                                                className="px-6 bg-premium-accent hover:bg-opacity-90 text-white py-2 rounded-[--radius-button] font-semibold transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                                                                {isDownloading === order.id ? (
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
                                                                        Generating...
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
                                                                        Download Invoice
                                                                    </>
                                                                )}
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="bg-white rounded-[--radius-card] shadow-md p-12 text-center">
                                        <div className="text-6xl mb-4">📦</div>
                                        <h3 className="text-xl font-bold text-premium-text mb-2">No Orders Yet</h3>
                                        <p className="text-gray-600 mb-6">
                                            Start shopping to see your order history here
                                        </p>
                                        <Link
                                            to="/"
                                            className="inline-block bg-premium-primary hover:bg-opacity-90 text-white px-8 py-3 rounded-[--radius-button] font-semibold transition-all duration-200">
                                            Start Shopping
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Addresses Tab */}
                        {activeTab === "addresses" && (
                            <div className="bg-white rounded-[--radius-card] shadow-md p-8 text-center">
                                <div className="text-6xl mb-4">🏠</div>
                                <h3 className="text-xl font-bold text-premium-text mb-2">Saved Addresses</h3>
                                <p className="text-gray-600 mb-6">Your delivery addresses will appear here</p>
                                <button className="bg-premium-primary hover:bg-opacity-90 text-white px-8 py-3 rounded-[--radius-button] font-semibold transition-all duration-200">
                                    Add New Address
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-premium-secondary text-white py-8 px-4 sm:px-6 lg:px-8 mt-16">
                <div className="max-w-7xl mx-auto text-center">
                    <p className="font-semibold">The Filtered Fridge - Premium Online Grocery Store</p>
                    <p className="text-sm opacity-80 mt-2">© 2026 The Filtered Fridge. All rights reserved.</p>
                </div>
            </footer>
        </div>
    )
}

export default Profile
