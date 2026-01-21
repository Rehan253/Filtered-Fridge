import { useEffect, useState } from "react"
import Navbar from "../../components/Navbar"
import { ProductTable, ProductForm } from "../../components/Admin"
import productStore from "../../data/Products.jsx"
import { getCategoryName } from "../../utils/categoryMapping"

const ProductManagement = () => {
    const { products, isLoading, error, fetchProducts, createProduct, updateProduct, deleteProduct, clearError } =
        productStore()
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingProduct, setEditingProduct] = useState(null)
    const [notification, setNotification] = useState(null)

    // Load products on mount
    useEffect(() => {
        fetchProducts()
    }, [fetchProducts])

    // Show notification
    const showNotification = (message, type = "success") => {
        setNotification({ message, type })
        setTimeout(() => setNotification(null), 3000)
    }

    const handleCreate = () => {
        setEditingProduct(null)
        setIsFormOpen(true)
    }

    const handleEdit = (product) => {
        setEditingProduct(product)
        setIsFormOpen(true)
    }

    const handleSave = async (productData) => {
        try {
            if (editingProduct) {
                // Update existing product
                const result = await updateProduct(editingProduct.id, productData)
                if (result.success) {
                    showNotification("Product updated successfully")
                } else {
                    showNotification(result.error || "Failed to update product", "error")
                }
            } else {
                // Create new product
                const result = await createProduct(productData)
                if (result.success) {
                    showNotification("Product created successfully")
                } else {
                    showNotification(result.error || "Failed to create product", "error")
                }
            }
            setIsFormOpen(false)
            setEditingProduct(null)
        } catch (err) {
            showNotification(err.message || "An error occurred", "error")
        }
    }

    const handleDelete = async (productId) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                const result = await deleteProduct(productId)
                if (result.success) {
                    showNotification("Product deleted successfully")
                } else {
                    showNotification(result.error || "Failed to delete product", "error")
                }
            } catch (err) {
                showNotification(err.message || "An error occurred", "error")
            }
        }
    }

    const handleCancel = () => {
        setIsFormOpen(false)
        setEditingProduct(null)
    }

    // Calculate statistics
    const stats = {
        total: products.length,
        byCategory: products.reduce((acc, product) => {
            const category = getCategoryName(product)
            acc[category] = (acc[category] || 0) + 1
            return acc
        }, {}),
        lowStock: products.filter((p) => (p.stock ?? p.quantity_in_stock ?? 0) < 10).length,
        onSale: products.filter((p) => p.discount).length,
        totalValue: products.reduce((sum, p) => sum + p.price * (p.stock ?? p.quantity_in_stock ?? 0), 0)
    }

    return (
        <div className="min-h-screen bg-premium-background">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Notifications */}
                {notification && (
                    <div
                        className={`mb-4 p-4 rounded-[--radius-card] ${
                            notification.type === "success"
                                ? "bg-green-100 text-green-700 border border-green-300"
                                : "bg-red-100 text-red-700 border border-red-300"
                        }`}>
                        {notification.message}
                    </div>
                )}

                {error && (
                    <div className="mb-4 p-4 rounded-[--radius-card] bg-red-100 text-red-700 border border-red-300 flex justify-between items-center">
                        <span>{error}</span>
                        <button
                            onClick={() => clearError()}
                            className="text-sm font-semibold hover:underline">
                            Dismiss
                        </button>
                    </div>
                )}

                {/* Page Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-premium-text mb-2">Product Management</h1>
                        <p className="text-gray-600">Manage products, inventory, and pricing</p>
                    </div>
                    <button
                        onClick={handleCreate}
                        disabled={isLoading}
                        className="bg-premium-primary hover:bg-opacity-90 text-white px-6 py-3 rounded-[--radius-button] font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
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
                                d="M12 4v16m8-8H4"
                            />
                        </svg>
                        {isLoading && products.length === 0 ? "Loading..." : "Create Product"}
                    </button>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
                    <div className="bg-white rounded-[--radius-card] shadow-md p-4">
                        <div className="text-2xl font-bold text-premium-text">{stats.total}</div>
                        <div className="text-sm text-gray-600">Total Products</div>
                    </div>
                    <div className="bg-white rounded-[--radius-card] shadow-md p-4">
                        <div className="text-2xl font-bold text-red-600">{stats.lowStock}</div>
                        <div className="text-sm text-gray-600">Low Stock</div>
                    </div>
                    <div className="bg-white rounded-[--radius-card] shadow-md p-4">
                        <div className="text-2xl font-bold text-premium-accent">{stats.onSale}</div>
                        <div className="text-sm text-gray-600">On Sale</div>
                    </div>
                    <div className="bg-white rounded-[--radius-card] shadow-md p-4">
                        <div className="text-2xl font-bold text-premium-primary">
                            ${(stats.totalValue / 1000).toFixed(1)}k
                        </div>
                        <div className="text-sm text-gray-600">Inventory Value</div>
                    </div>
                    <div className="bg-white rounded-[--radius-card] shadow-md p-4">
                        <div className="text-2xl font-bold text-premium-secondary">
                            {stats.byCategory["Fruits"] || 0}
                        </div>
                        <div className="text-sm text-gray-600">Fruits</div>
                    </div>
                    <div className="bg-white rounded-[--radius-card] shadow-md p-4">
                        <div className="text-2xl font-bold text-premium-secondary">
                            {stats.byCategory["Vegetables"] || 0}
                        </div>
                        <div className="text-sm text-gray-600">Vegetables</div>
                    </div>
                </div>

                {/* Product Table */}
                <ProductTable
                    products={products}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />

                {/* Product Form Modal */}
                {isFormOpen && (
                    <ProductForm
                        product={editingProduct}
                        onSave={handleSave}
                        onCancel={handleCancel}
                    />
                )}
            </div>
        </div>
    )
}

export default ProductManagement
