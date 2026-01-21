import { useState } from "react"
import { getPromotionStatus, getPromotionStatusColor } from "../../data/promotions"

const PromotionTable = ({ promotions, onEdit, onDelete }) => {
    const [sortField, setSortField] = useState("title")
    const [sortDirection, setSortDirection] = useState("asc")
    const [filterStatus, setFilterStatus] = useState("all")
    const [searchQuery, setSearchQuery] = useState("")

    // Filter and search promotions
    const filteredPromotions = promotions.filter((promotion) => {
        const matchesSearch =
            searchQuery === "" ||
            promotion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            promotion.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (promotion.promoCode && promotion.promoCode.toLowerCase().includes(searchQuery.toLowerCase()))

        const status = getPromotionStatus(promotion)
        const matchesStatus = filterStatus === "all" || status === filterStatus

        return matchesSearch && matchesStatus
    })

    // Sort promotions
    const sortedPromotions = [...filteredPromotions].sort((a, b) => {
        let aValue = a[sortField]
        let bValue = b[sortField]

        if (sortField === "startDate" || sortField === "endDate") {
            aValue = new Date(aValue).getTime()
            bValue = new Date(bValue).getTime()
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

    const formatDiscount = (promotion) => {
        switch (promotion.discountType) {
            case "percentage":
                return `${promotion.discountValue}% OFF`
            case "fixed":
                return `$${promotion.discountValue} OFF`
            case "shipping":
                return "FREE SHIPPING"
            case "bogo":
                return `Buy 2 Get ${promotion.discountValue} Free`
            default:
                return "Discount"
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
                            placeholder="Search by title, description, or promo code..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-premium-primary transition-colors"
                        />
                    </div>

                    {/* Status Filter */}
                    <div>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-premium-primary transition-colors">
                            <option value="all">All Statuses</option>
                            <option value="active">Active</option>
                            <option value="scheduled">Scheduled</option>
                            <option value="expired">Expired</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                </div>

                {/* Results Count */}
                <div className="mt-4 text-sm text-gray-600">
                    Showing {sortedPromotions.length} of {promotions.length} promotions
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-premium-background">
                        <tr>
                            <th
                                className="px-6 py-3 text-left text-xs font-semibold text-premium-text uppercase cursor-pointer hover:bg-gray-100 transition-colors"
                                onClick={() => handleSort("title")}>
                                <div className="flex items-center gap-2">
                                    Promotion
                                    {sortField === "title" && <span>{sortDirection === "asc" ? "↑" : "↓"}</span>}
                                </div>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-premium-text uppercase">Discount</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-premium-text uppercase">Categories</th>
                            <th
                                className="px-6 py-3 text-left text-xs font-semibold text-premium-text uppercase cursor-pointer hover:bg-gray-100 transition-colors"
                                onClick={() => handleSort("startDate")}>
                                <div className="flex items-center gap-2">
                                    Start Date
                                    {sortField === "startDate" && <span>{sortDirection === "asc" ? "↑" : "↓"}</span>}
                                </div>
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-semibold text-premium-text uppercase cursor-pointer hover:bg-gray-100 transition-colors"
                                onClick={() => handleSort("endDate")}>
                                <div className="flex items-center gap-2">
                                    End Date
                                    {sortField === "endDate" && <span>{sortDirection === "asc" ? "↑" : "↓"}</span>}
                                </div>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-premium-text uppercase">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-premium-text uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {sortedPromotions.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="7"
                                    className="px-6 py-12 text-center text-gray-500">
                                    No promotions found matching your criteria
                                </td>
                            </tr>
                        ) : (
                            sortedPromotions.map((promotion) => {
                                const status = getPromotionStatus(promotion)
                                return (
                                    <tr
                                        key={promotion.id}
                                        className="hover:bg-premium-background transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                                                    {promotion.icon || "🎉"}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-premium-text">{promotion.title}</div>
                                                    <div className="text-sm text-gray-500 line-clamp-1">{promotion.description}</div>
                                                    {promotion.promoCode && (
                                                        <div className="text-xs text-premium-primary font-mono mt-1">
                                                            Code: {promotion.promoCode}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm">
                                                <span className="font-bold text-premium-primary">{formatDiscount(promotion)}</span>
                                                {promotion.minPurchase > 0 && (
                                                    <div className="text-xs text-gray-500">Min: ${promotion.minPurchase}</div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {promotion.categories.includes("All") ? (
                                                    <span className="text-xs bg-premium-secondary text-white px-2 py-1 rounded">All</span>
                                                ) : (
                                                    promotion.categories.slice(0, 2).map((cat, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                                            {cat}
                                                        </span>
                                                    ))
                                                )}
                                                {promotion.categories.length > 2 && !promotion.categories.includes("All") && (
                                                    <span className="text-xs text-gray-500">+{promotion.categories.length - 2}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {new Date(promotion.startDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {new Date(promotion.endDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPromotionStatusColor(status)}`}>
                                                {status.charAt(0).toUpperCase() + status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => onEdit && onEdit(promotion)}
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
                                                    onClick={() => onDelete && onDelete(promotion.id)}
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
                                )
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default PromotionTable
