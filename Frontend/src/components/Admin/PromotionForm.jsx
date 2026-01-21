import { useState, useEffect } from "react"

const PromotionForm = ({ promotion, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        discountType: "percentage",
        discountValue: "",
        startDate: "",
        endDate: "",
        categories: [],
        minPurchase: "",
        status: "active",
        promoCode: "",
        image: "",
        icon: ""
    })
    const [errors, setErrors] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false)

    const categories = ["Fruits", "Vegetables", "Dairy", "Bakery", "Meat", "Seafood", "Beverages", "Snacks"]
    const discountTypes = [
        { value: "percentage", label: "Percentage (%)" },
        { value: "fixed", label: "Fixed Amount ($)" },
        { value: "shipping", label: "Free Shipping" },
        { value: "bogo", label: "Buy X Get Y Free" }
    ]

    useEffect(() => {
        if (promotion) {
            setFormData({
                title: promotion.title || "",
                description: promotion.description || "",
                discountType: promotion.discountType || "percentage",
                discountValue: promotion.discountValue || "",
                startDate: promotion.startDate || "",
                endDate: promotion.endDate || "",
                categories: promotion.categories || [],
                minPurchase: promotion.minPurchase || "",
                status: promotion.status || "active",
                promoCode: promotion.promoCode || "",
                image: promotion.image || "",
                icon: promotion.icon || ""
            })
        }
    }, [promotion])

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

    const handleCategoryToggle = (category) => {
        setFormData((prev) => {
            if (prev.categories.includes("All")) {
                // If "All" is selected, remove it and select this category
                return {
                    ...prev,
                    categories: [category]
                }
            } else if (category === "All") {
                // If selecting "All", clear other selections
                return {
                    ...prev,
                    categories: ["All"]
                }
            } else {
                // Toggle individual category
                const newCategories = prev.categories.includes(category)
                    ? prev.categories.filter((c) => c !== category)
                    : [...prev.categories, category]
                return {
                    ...prev,
                    categories: newCategories.length > 0 ? newCategories : ["All"]
                }
            }
        })
    }

    const validateForm = () => {
        const newErrors = {}

        if (!formData.title.trim()) newErrors.title = "Title is required"
        if (!formData.description.trim()) newErrors.description = "Description is required"
        if (!formData.startDate) newErrors.startDate = "Start date is required"
        if (!formData.endDate) newErrors.endDate = "End date is required"
        if (new Date(formData.endDate) < new Date(formData.startDate)) {
            newErrors.endDate = "End date must be after start date"
        }
        if (
            formData.discountType !== "shipping" &&
            (!formData.discountValue || parseFloat(formData.discountValue) <= 0)
        ) {
            newErrors.discountValue = "Valid discount value is required"
        }
        if (formData.discountType === "percentage" && parseFloat(formData.discountValue) > 100) {
            newErrors.discountValue = "Percentage cannot exceed 100%"
        }
        if (formData.categories.length === 0) {
            newErrors.categories = "At least one category must be selected"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (validateForm()) {
            setIsSubmitting(true)

            // Prepare promotion data
            const promotionData = {
                ...formData,
                discountValue: formData.discountType === "shipping" ? 0 : parseFloat(formData.discountValue),
                minPurchase: formData.minPurchase ? parseFloat(formData.minPurchase) : 0,
                categories: formData.categories.length === 0 ? ["All"] : formData.categories
            }

            await (onSave ? onSave(promotionData) : Promise.resolve())
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
                        <h2 className="text-2xl font-bold">{promotion ? "Edit Promotion" : "Create New Promotion"}</h2>
                        <p className="text-sm opacity-90">Add or modify promotion information</p>
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
                                    Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none transition-colors ${
                                        errors.title
                                            ? "border-red-500 focus:border-red-500"
                                            : "border-gray-300 focus:border-premium-primary"
                                    }`}
                                    placeholder="Free Shipping on Orders Over $50!"
                                />
                                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-premium-primary transition-colors">
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={3}
                                    className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none transition-colors ${
                                        errors.description
                                            ? "border-red-500 focus:border-red-500"
                                            : "border-gray-300 focus:border-premium-primary"
                                    }`}
                                    placeholder="Promotion description..."></textarea>
                                {errors.description && (
                                    <p className="text-red-500 text-xs mt-1">{errors.description}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Discount Settings */}
                    <div>
                        <h3 className="text-lg font-bold text-premium-secondary mb-4">Discount Settings</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Discount Type <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="discountType"
                                    value={formData.discountType}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-premium-primary transition-colors">
                                    {discountTypes.map((type) => (
                                        <option
                                            key={type.value}
                                            value={type.value}>
                                            {type.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {formData.discountType !== "shipping" && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Discount Value <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        step={formData.discountType === "percentage" ? "0.1" : "0.01"}
                                        min="0"
                                        max={formData.discountType === "percentage" ? "100" : undefined}
                                        name="discountValue"
                                        value={formData.discountValue}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none transition-colors ${
                                            errors.discountValue
                                                ? "border-red-500 focus:border-red-500"
                                                : "border-gray-300 focus:border-premium-primary"
                                        }`}
                                        placeholder={formData.discountType === "percentage" ? "20" : "10"}
                                    />
                                    {errors.discountValue && (
                                        <p className="text-red-500 text-xs mt-1">{errors.discountValue}</p>
                                    )}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Minimum Purchase ($)
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    name="minPurchase"
                                    value={formData.minPurchase}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-premium-primary transition-colors"
                                    placeholder="0"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Promo Code</label>
                                <input
                                    type="text"
                                    name="promoCode"
                                    value={formData.promoCode}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-premium-primary transition-colors"
                                    placeholder="FREESHIP50"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Date Range */}
                    <div>
                        <h3 className="text-lg font-bold text-premium-secondary mb-4">Date Range</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Start Date <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none transition-colors ${
                                        errors.startDate
                                            ? "border-red-500 focus:border-red-500"
                                            : "border-gray-300 focus:border-premium-primary"
                                    }`}
                                />
                                {errors.startDate && <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    End Date <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    name="endDate"
                                    value={formData.endDate}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none transition-colors ${
                                        errors.endDate
                                            ? "border-red-500 focus:border-red-500"
                                            : "border-gray-300 focus:border-premium-primary"
                                    }`}
                                />
                                {errors.endDate && <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="text-lg font-bold text-premium-secondary mb-4">
                            Applicable Categories <span className="text-red-500">*</span>
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {["All", ...categories].map((category) => (
                                <button
                                    key={category}
                                    type="button"
                                    onClick={() => handleCategoryToggle(category)}
                                    className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                                        formData.categories.includes(category)
                                            ? "bg-premium-primary text-white border-premium-primary"
                                            : "bg-white text-gray-700 border-gray-300 hover:border-premium-primary"
                                    }`}>
                                    {category}
                                </button>
                            ))}
                        </div>
                        {errors.categories && <p className="text-red-500 text-xs mt-2">{errors.categories}</p>}
                    </div>

                    {/* Display Options */}
                    <div>
                        <h3 className="text-lg font-bold text-premium-secondary mb-4">Display Options</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Icon (Emoji)</label>
                                <input
                                    type="text"
                                    name="icon"
                                    value={formData.icon}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-premium-primary transition-colors"
                                    placeholder="🚚"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                                <input
                                    type="url"
                                    name="image"
                                    value={formData.image}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-premium-primary transition-colors"
                                    placeholder="https://example.com/promo.jpg"
                                />
                            </div>
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
                            ) : promotion ? (
                                "Update Promotion"
                            ) : (
                                "Create Promotion"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default PromotionForm
