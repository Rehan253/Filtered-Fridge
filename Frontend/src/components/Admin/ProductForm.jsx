import { useState, useEffect } from "react"

const ProductForm = ({ product, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: "",
        category: "",
        price: "",
        originalPrice: "",
        discount: "",
        unit: "",
        description: "",
        ingredients: "",
        stock: "",
        rating: "",
        reviews: "",
        icon: "",
        image: ""
    })
    const [errors, setErrors] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false)

    const categories = ["Fruits", "Vegetables", "Dairy", "Bakery", "Meat", "Seafood", "Beverages", "Snacks"]

    useEffect(() => {
        if (product) {
            // Convert ingredients array to comma-separated string if it's an array
            const ingredientsString = Array.isArray(product.ingredients)
                ? product.ingredients.join(", ")
                : product.ingredients || ""

            setFormData({
                name: product.name || "",
                category: product.category || "",
                price: product.price || "",
                originalPrice: product.originalPrice || "",
                discount: product.discount || "",
                unit: product.unit || "",
                description: product.description || "",
                ingredients: ingredientsString,
                stock: product.stock || "",
                rating: product.rating || "",
                reviews: product.reviews || "",
                icon: product.icon || "",
                image: product.image || ""
            })
        }
    }, [product])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: ""
            }))
        }
    }

    const validateForm = () => {
        const newErrors = {}

        if (!formData.name.trim()) newErrors.name = "Product name is required"
        if (!formData.category) newErrors.category = "Category is required"
        if (!formData.price || parseFloat(formData.price) <= 0) {
            newErrors.price = "Valid price is required"
        }
        if (formData.originalPrice && parseFloat(formData.originalPrice) <= parseFloat(formData.price)) {
            newErrors.originalPrice = "Original price must be greater than current price"
        }
        if (formData.discount && (parseFloat(formData.discount) < 0 || parseFloat(formData.discount) > 100)) {
            newErrors.discount = "Discount must be between 0 and 100"
        }
        if (!formData.unit) newErrors.unit = "Unit is required"
        if (!formData.stock || parseInt(formData.stock) < 0) {
            newErrors.stock = "Valid stock quantity is required"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (validateForm()) {
            setIsSubmitting(true)

            // Prepare product data
            const productData = {
                ...formData,
                price: parseFloat(formData.price),
                originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
                discount: formData.discount ? parseFloat(formData.discount) : undefined,
                stock: parseInt(formData.stock),
                rating: formData.rating ? parseFloat(formData.rating) : undefined,
                reviews: formData.reviews ? parseInt(formData.reviews) : undefined,
                ingredients: formData.ingredients
                    .split(",")
                    .map((ing) => ing.trim())
                    .filter((ing) => ing.length > 0)
            }

            await (onSave ? onSave(productData) : Promise.resolve())
            setIsSubmitting(false)
        }
    }

    return (
        <div
            className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onCancel}>
            <div
                className="bg-white rounded-[--radius-card] shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="bg-premium-secondary text-white p-6 flex items-center justify-between sticky top-0 z-10">
                    <div>
                        <h2 className="text-2xl font-bold">{product ? "Edit Product" : "Create New Product"}</h2>
                        <p className="text-sm opacity-90">Add or modify product information</p>
                    </div>
                    <button
                        onClick={onCancel}
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

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="p-6 space-y-6">
                    {/* Basic Information */}
                    <div>
                        <h3 className="text-lg font-bold text-premium-secondary mb-4">Basic Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Product Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none transition-colors ${
                                        errors.name
                                            ? "border-red-500 focus:border-red-500"
                                            : "border-gray-300 focus:border-premium-primary"
                                    }`}
                                    placeholder="Fresh Red Apples"
                                />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Category <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none transition-colors ${
                                        errors.category
                                            ? "border-red-500 focus:border-red-500"
                                            : "border-gray-300 focus:border-premium-primary"
                                    }`}>
                                    <option value="">Select Category</option>
                                    {categories.map((cat) => (
                                        <option
                                            key={cat}
                                            value={cat}>
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                                {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={3}
                                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-premium-primary transition-colors"
                                    placeholder="Product description..."></textarea>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Ingredients <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    name="ingredients"
                                    value={formData.ingredients}
                                    onChange={handleChange}
                                    rows={3}
                                    className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none transition-colors ${
                                        errors.ingredients
                                            ? "border-red-500 focus:border-red-500"
                                            : "border-gray-300 focus:border-premium-primary"
                                    }`}
                                    placeholder="Enter ingredients separated by commas (e.g., Apples, Sugar, Cinnamon)"></textarea>
                                <p className="text-xs text-gray-500 mt-1">Separate multiple ingredients with commas</p>
                                {errors.ingredients && (
                                    <p className="text-red-500 text-xs mt-1">{errors.ingredients}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Pricing */}
                    <div>
                        <h3 className="text-lg font-bold text-premium-secondary mb-4">Pricing</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Price ($) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none transition-colors ${
                                        errors.price
                                            ? "border-red-500 focus:border-red-500"
                                            : "border-gray-300 focus:border-premium-primary"
                                    }`}
                                    placeholder="4.99"
                                />
                                {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Original Price ($)
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    name="originalPrice"
                                    value={formData.originalPrice}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none transition-colors ${
                                        errors.originalPrice
                                            ? "border-red-500 focus:border-red-500"
                                            : "border-gray-300 focus:border-premium-primary"
                                    }`}
                                    placeholder="6.99"
                                />
                                {errors.originalPrice && (
                                    <p className="text-red-500 text-xs mt-1">{errors.originalPrice}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    name="discount"
                                    value={formData.discount}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none transition-colors ${
                                        errors.discount
                                            ? "border-red-500 focus:border-red-500"
                                            : "border-gray-300 focus:border-premium-primary"
                                    }`}
                                    placeholder="20"
                                />
                                {errors.discount && <p className="text-red-500 text-xs mt-1">{errors.discount}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Unit <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="unit"
                                    value={formData.unit}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none transition-colors ${
                                        errors.unit
                                            ? "border-red-500 focus:border-red-500"
                                            : "border-gray-300 focus:border-premium-primary"
                                    }`}
                                    placeholder="lb, kg, pack, etc."
                                />
                                {errors.unit && <p className="text-red-500 text-xs mt-1">{errors.unit}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Inventory & Display */}
                    <div>
                        <h3 className="text-lg font-bold text-premium-secondary mb-4">Inventory & Display</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Stock Quantity <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none transition-colors ${
                                        errors.stock
                                            ? "border-red-500 focus:border-red-500"
                                            : "border-gray-300 focus:border-premium-primary"
                                    }`}
                                    placeholder="100"
                                />
                                {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Icon (Emoji)</label>
                                <input
                                    type="text"
                                    name="icon"
                                    value={formData.icon}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-premium-primary transition-colors"
                                    placeholder="🍎"
                                />
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                            <input
                                type="url"
                                name="image"
                                value={formData.image}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-premium-primary transition-colors"
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-[--radius-button] font-semibold hover:bg-gray-50 transition-all duration-200">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 bg-premium-primary hover:bg-opacity-90 text-white py-3 rounded-[--radius-button] font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                            {isSubmitting ? (
                                <span className="flex items-center justify-center gap-2">
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
                                    Saving...
                                </span>
                            ) : product ? (
                                "Update Product"
                            ) : (
                                "Create Product"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ProductForm
