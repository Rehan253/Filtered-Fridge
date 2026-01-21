import { useState } from "react"
import { getUserStatusColor, getRoleColor } from "../../data/users"

const UserTable = ({ users, onUserClick, onStatusChange }) => {
    const [sortField, setSortField] = useState("name")
    const [sortDirection, setSortDirection] = useState("asc")
    const [filterRole, setFilterRole] = useState("all")
    const [filterStatus, setFilterStatus] = useState("all")
    const [searchQuery, setSearchQuery] = useState("")

    // Filter and search users
    const filteredUsers = users.filter((user) => {
        const matchesRole = filterRole === "all" || user.role === filterRole
        const matchesStatus = filterStatus === "all" || user.status === filterStatus
        const matchesSearch =
            searchQuery === "" ||
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.phone.includes(searchQuery)

        return matchesRole && matchesStatus && matchesSearch
    })

    // Sort users
    const sortedUsers = [...filteredUsers].sort((a, b) => {
        let aValue = a[sortField]
        let bValue = b[sortField]

        // Handle date fields
        if (sortField === "joinDate" || sortField === "lastOrderDate") {
            aValue = aValue ? new Date(aValue).getTime() : 0
            bValue = bValue ? new Date(bValue).getTime() : 0
        }

        // Handle numeric fields
        if (sortField === "totalOrders" || sortField === "totalSpent") {
            aValue = aValue || 0
            bValue = bValue || 0
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

    const formatDate = (dateString) => {
        if (!dateString) return "N/A"
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric"
        })
    }

    const formatCurrency = (amount) => {
        return `$${amount.toFixed(2)}`
    }

    return (
        <div className="bg-white rounded-[--radius-card] shadow-md overflow-hidden">
            {/* Filters and Search */}
            <div className="p-6 border-b border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Search */}
                    <div className="md:col-span-2">
                        <input
                            type="text"
                            placeholder="Search by name, email, or phone..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-premium-primary transition-colors"
                        />
                    </div>

                    {/* Role Filter */}
                    <div>
                        <select
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value)}
                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-premium-primary transition-colors">
                            <option value="all">All Roles</option>
                            <option value="admin">Admin</option>
                            <option value="customer">Customer</option>
                        </select>
                    </div>

                    {/* Status Filter */}
                    <div>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-premium-primary transition-colors">
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="suspended">Suspended</option>
                        </select>
                    </div>
                </div>

                {/* Results Count */}
                <div className="mt-4 text-sm text-gray-600">
                    Showing {sortedUsers.length} of {users.length} users
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
                                    Name
                                    {sortField === "name" && (
                                        <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                                    )}
                                </div>
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-semibold text-premium-text uppercase cursor-pointer hover:bg-gray-100 transition-colors"
                                onClick={() => handleSort("email")}>
                                <div className="flex items-center gap-2">
                                    Email
                                    {sortField === "email" && (
                                        <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                                    )}
                                </div>
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-semibold text-premium-text uppercase cursor-pointer hover:bg-gray-100 transition-colors"
                                onClick={() => handleSort("role")}>
                                <div className="flex items-center gap-2">
                                    Role
                                    {sortField === "role" && (
                                        <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                                    )}
                                </div>
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-semibold text-premium-text uppercase cursor-pointer hover:bg-gray-100 transition-colors"
                                onClick={() => handleSort("status")}>
                                <div className="flex items-center gap-2">
                                    Status
                                    {sortField === "status" && (
                                        <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                                    )}
                                </div>
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-semibold text-premium-text uppercase cursor-pointer hover:bg-gray-100 transition-colors"
                                onClick={() => handleSort("totalOrders")}>
                                <div className="flex items-center gap-2">
                                    Orders
                                    {sortField === "totalOrders" && (
                                        <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                                    )}
                                </div>
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-semibold text-premium-text uppercase cursor-pointer hover:bg-gray-100 transition-colors"
                                onClick={() => handleSort("totalSpent")}>
                                <div className="flex items-center gap-2">
                                    Total Spent
                                    {sortField === "totalSpent" && (
                                        <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                                    )}
                                </div>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-premium-text uppercase">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {sortedUsers.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="7"
                                    className="px-6 py-12 text-center text-gray-500">
                                    No users found matching your criteria
                                </td>
                            </tr>
                        ) : (
                            sortedUsers.map((user) => (
                                <tr
                                    key={user.id}
                                    className="hover:bg-premium-background transition-colors cursor-pointer"
                                    onClick={() => onUserClick && onUserClick(user)}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-gradient-to-br from-premium-primary to-premium-accent rounded-full flex items-center justify-center text-white font-bold mr-3">
                                                {user.name
                                                    .split(" ")
                                                    .map((n) => n[0])
                                                    .join("")}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-premium-text">{user.name}</div>
                                                <div className="text-sm text-gray-500">{user.phone}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-700">{user.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getRoleColor(
                                                user.role
                                            )}`}>
                                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getUserStatusColor(
                                                user.status
                                            )}`}>
                                            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {user.totalOrders}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-premium-primary">
                                        {formatCurrency(user.totalSpent)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    onUserClick && onUserClick(user)
                                                }}
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
                                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                    />
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                    />
                                                </svg>
                                            </button>
                                            <select
                                                value={user.status}
                                                onChange={(e) => {
                                                    e.stopPropagation()
                                                    onStatusChange && onStatusChange(user.id, e.target.value)
                                                }}
                                                onClick={(e) => e.stopPropagation()}
                                                className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-premium-primary">
                                                <option value="active">Active</option>
                                                <option value="inactive">Inactive</option>
                                                <option value="suspended">Suspended</option>
                                            </select>
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

export default UserTable
