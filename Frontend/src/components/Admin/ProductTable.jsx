import { useState } from "react"
import { CATEGORY_ORDER, getCategoryName } from "../../utils/categoryMapping"

const ProductTable = ({ products, onProductClick, onEdit, onDelete }) => {
    const [sortField, setSortField] = useState("name")
    const [sortDirection, setSortDirection] = useState("asc")
    const [filterCategory, setFilterCategory] = useState("all")
    const [searchQuery, setSearchQuery] = useState("")

    const categories = ["All", ...CATEGORY_ORDER]

    // Filter and search products
    const filteredProducts = products.filter((product) => {
        const matchesCategory =
            filterCategory === "all" || getCategoryName(product) === filterCategory
        const matchesSearch =
            searchQuery === "" ||
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (product.ingredients &&
                product.ingredients.some((ing) => ing.toLowerCase().includes(searchQuery.toLowerCase())))

        return matchesCategory && matchesSearch
    })

    // Sort products
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        let aValue = a[sortField]
        let bValue = b[sortField]

        if (sortField === "category") {
            aValue = getCategoryName(a)
            bValue = getCategoryName(b)
        }

        if (sortField === "stock") {
            aValue = aValue ?? a.quantity_in_stock ?? 0
            bValue = bValue ?? b.quantity_in_stock ?? 0
        }

        if (sortField === "price" || sortField === "rating") {
            aValue = aValue ?? 0
            bValue = bValue ?? 0
        }

        if (typeof aValue === "string") {
            aValue = aValue.toLowerCase()
            bValue = bValue.toLowerCase()
        }

        if (sortDirection === "asc") {
            return aValue > bValue ? 1 : aValue < bValue ? -1 : 0
        } else {
            return aValue < bValue ? 1 : aValue > bValue ? -1 : 0
        }
    })

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc")
        } else {
            setSortField(field)
            setSortDirection("asc")
        }
    }

    return (
        <div className="bg-white rounded-[--radius-card] shadow-md overflow-hidden">
            {/* Filters and Search */}
            <div className="p-6 border-b border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Search */}
                    <div>
                        <input
                            type="text"
                            placeholder="Search by name, description, or ingredients..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-premium-primary transition-colors"
                        />
                    </div>

                    {/* Category Filter */}
                    <div>
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-premium-primary transition-colors">
                            {categories.map((cat) => (
                                <option
                                    key={cat}
                                    value={cat === "All" ? "all" : cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Results Count */}
                <div className="mt-4 text-sm text-gray-600">
                    Showing {sortedProducts.length} of {products.length} products
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-premium-background">
                        <tr>
                            <th
                                className="px-6 py-3 text-left text-xs font-semibold text-premium-text uppercase cursor-pointer hover:bg-gray-100 transition-colors"
                                onClick={() => handleSort("name")}>
                                <div className="flex items-center gap-2">
                                    Product
                                    {sortField === "name" && <span>{sortDirection === "asc" ? "↑" : "↓"}</span>}
                                </div>
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-semibold text-premium-text uppercase cursor-pointer hover:bg-gray-100 transition-colors"
                                onClick={() => handleSort("category")}>
                                <div className="flex items-center gap-2">
                                    Category
                                    {sortField === "category" && <span>{sortDirection === "asc" ? "↑" : "↓"}</span>}
                                </div>
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-semibold text-premium-text uppercase cursor-pointer hover:bg-gray-100 transition-colors"
                                onClick={() => handleSort("price")}>
                                <div className="flex items-center gap-2">
                                    Price
                                    {sortField === "price" && <span>{sortDirection === "asc" ? "↑" : "↓"}</span>}
                                </div>
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-semibold text-premium-text uppercase cursor-pointer hover:bg-gray-100 transition-colors"
                                onClick={() => handleSort("stock")}>
                                <div className="flex items-center gap-2">
                                    Stock
                                    {sortField === "stock" && <span>{sortDirection === "asc" ? "↑" : "↓"}</span>}
                                </div>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-premium-text uppercase">
                                Ingredients
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-premium-text uppercase">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {sortedProducts.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="6"
                                    className="px-6 py-12 text-center text-gray-500">
                                    No products found matching your criteria
                                </td>
                            </tr>
                        ) : (
                            sortedProducts.map((product) => (
                                <tr
                                    key={product.id}
                                    className="hover:bg-premium-background transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                                                {product.icon || "🛒"}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-premium-text">{product.name}</div>
                                                {product.discount && (
                                                    <span className="text-xs text-premium-accent font-bold">
                                                        {product.discount}% OFF
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm text-gray-700 bg-premium-background px-2 py-1 rounded-full">
                                            {getCategoryName(product)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm">
                                            <span className="font-bold text-premium-primary">
                                                ${Number(product.price || 0).toFixed(2)}
                                            </span>
                                            {product.originalPrice && (
                                                <span className="text-gray-400 line-through ml-2">
                                                    ${product.originalPrice.toFixed(2)}
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            ${Number(product.price || 0)} / {product.unit || "-"}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {(() => {
                                            const stockValue = product.stock ?? product.quantity_in_stock ?? 0
                                            return (
                                        <span
                                            className={`text-sm font-semibold ${
                                                stockValue < 10
                                                    ? "text-red-600"
                                                    : stockValue < 50
                                                    ? "text-yellow-600"
                                                    : "text-green-600"
                                            }`}>
                                            {stockValue}
                                        </span>
                                            )
                                        })()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-700 max-w-xs">
                                            {product.ingredients && product.ingredients.length > 0 ? (
                                                <div className="flex flex-wrap gap-1">
                                                    {product.ingredients.slice(0, 3).map((ing, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="bg-gray-100 px-2 py-1 rounded text-xs">
                                                            {ing}
                                                        </span>
                                                    ))}
                                                    {product.ingredients.length > 3 && (
                                                        <span className="text-gray-500 text-xs">
                                                            +{product.ingredients.length - 3} more
                                                        </span>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 text-xs">No ingredients</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => onEdit && onEdit(product)}
                                                className="text-premium-primary hover:text-premium-accent transition-colors">
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
                                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                    />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => onDelete && onDelete(product.id)}
                                                className="text-red-500 hover:text-red-700 transition-colors">
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
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ProductTable
