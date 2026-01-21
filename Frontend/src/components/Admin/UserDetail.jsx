import { getUserStatusColor, getRoleColor } from "../../data/users"

const UserDetail = ({ user, onClose, onStatusChange }) => {
    if (!user) return null

    const formatDate = (dateString) => {
        if (!dateString) return "N/A"
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
        })
    }

    const formatCurrency = (amount) => {
        return `$${amount.toFixed(2)}`
    }

    return (
        <div
            className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}>
            <div
                className="bg-white rounded-[--radius-card] shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="bg-premium-secondary text-white p-6 flex items-center justify-between sticky top-0 z-10">
                    <div>
                        <h2 className="text-2xl font-bold">User Details</h2>
                        <p className="text-sm opacity-90">Manage user information and settings</p>
                    </div>
                    <button
                        onClick={onClose}
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

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* User Profile Section */}
                    <div className="flex items-start gap-6 pb-6 border-b border-gray-200">
                        <div className="w-24 h-24 bg-gradient-to-br from-premium-primary to-premium-accent rounded-full flex items-center justify-center text-white text-3xl font-bold">
                            {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                        </div>
                        <div className="flex-1">
                            <h3 className="text-2xl font-bold text-premium-text mb-2">{user.name}</h3>
                            <div className="flex items-center gap-3 mb-3">
                                <span
                                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getRoleColor(
                                        user.role
                                    )}`}>
                                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                </span>
                                <span
                                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getUserStatusColor(
                                        user.status
                                    )}`}>
                                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                                </span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                <span>📧 {user.email}</span>
                                <span>📞 {user.phone}</span>
                            </div>
                        </div>
                    </div>

                    {/* User Information Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-premium-background p-4 rounded-lg">
                            <h4 className="font-semibold text-premium-text mb-2">Account Information</h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">User ID:</span>
                                    <span className="font-semibold">#{user.id}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Join Date:</span>
                                    <span className="font-semibold">{formatDate(user.joinDate)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Last Order:</span>
                                    <span className="font-semibold">{formatDate(user.lastOrderDate)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-premium-background p-4 rounded-lg">
                            <h4 className="font-semibold text-premium-text mb-2">Order Statistics</h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Total Orders:</span>
                                    <span className="font-semibold text-premium-primary">{user.totalOrders}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Total Spent:</span>
                                    <span className="font-semibold text-premium-primary">
                                        {formatCurrency(user.totalSpent)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Average Order:</span>
                                    <span className="font-semibold">
                                        {user.totalOrders > 0
                                            ? formatCurrency(user.totalSpent / user.totalOrders)
                                            : "$0.00"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Address */}
                    <div className="bg-premium-background p-4 rounded-lg">
                        <h4 className="font-semibold text-premium-text mb-2">Delivery Address</h4>
                        <p className="text-sm text-gray-700">{user.address}</p>
                    </div>

                    {/* Status Management */}
                    <div className="bg-yellow-50 border-2 border-yellow-200 p-4 rounded-lg">
                        <h4 className="font-semibold text-premium-text mb-3">Status Management</h4>
                        <div className="flex items-center gap-4">
                            <label className="text-sm font-medium text-gray-700">Change Status:</label>
                            <select
                                value={user.status}
                                onChange={(e) => onStatusChange && onStatusChange(user.id, e.target.value)}
                                className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-premium-primary transition-colors">
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="suspended">Suspended</option>
                            </select>
                            <span className="text-xs text-gray-600">
                                {user.status === "active" && "User can place orders"}
                                {user.status === "inactive" && "User account is inactive"}
                                {user.status === "suspended" && "User account is suspended"}
                            </span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 pt-4 border-t border-gray-200">
                        <button className="flex-1 bg-premium-primary hover:bg-opacity-90 text-white py-3 rounded-[--radius-button] font-semibold transition-all duration-200">
                            Edit User
                        </button>
                        <button className="flex-1 bg-white border-2 border-premium-secondary text-premium-secondary hover:bg-premium-secondary hover:text-white py-3 rounded-[--radius-button] font-semibold transition-all duration-200">
                            View Orders
                        </button>
                        {user.status !== "suspended" && (
                            <button className="px-6 bg-red-500 hover:bg-red-600 text-white py-3 rounded-[--radius-button] font-semibold transition-all duration-200">
                                Suspend
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserDetail
