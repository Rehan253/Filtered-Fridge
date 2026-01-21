import { useEffect, useState } from "react"
import Navbar from "../../components/Navbar"
import { UserTable, UserDetail } from "../../components/Admin"
import { getAdminUser, getAdminUsers, updateAdminUserStatus } from "../../api/adminUsers"

const UserManagement = () => {
    const [users, setUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const loadUsers = async () => {
            setIsLoading(true)
            setError(null)
            const response = await getAdminUsers()
            if (response && response.status === "Error") {
                setError(response.errorMessage || "Failed to load users")
                setIsLoading(false)
                return
            }
            const data = response?.data || response || []
            setUsers(Array.isArray(data) ? data : [])
            setIsLoading(false)
        }

        loadUsers()
    }, [])

    const handleUserClick = async (user) => {
        const response = await getAdminUser(user.id)
        if (response && response.status === "Error") {
            setSelectedUser(user)
            return
        }
        setSelectedUser(response || user)
    }

    const handleStatusChange = async (userId, newStatus) => {
        const response = await updateAdminUserStatus(userId, newStatus)
        if (response && response.status === "Error") {
            setError(response.errorMessage || "Failed to update status")
            return
        }
        setUsers((prevUsers) =>
            prevUsers.map((user) => (user.id === userId ? { ...user, status: newStatus } : user))
        )
        // Update selected user if it's the one being changed
        if (selectedUser && selectedUser.id === userId) {
            setSelectedUser({ ...selectedUser, status: newStatus })
        }
    }

    const handleCloseDetail = () => {
        setSelectedUser(null)
    }

    // Calculate statistics
    const stats = {
        total: users.length,
        active: users.filter((u) => u.status === "active").length,
        inactive: users.filter((u) => u.status === "inactive").length,
        suspended: users.filter((u) => u.status === "suspended").length,
        customers: users.filter((u) => u.role === "customer").length,
        admins: users.filter((u) => u.role === "admin").length
    }

    return (
        <div className="min-h-screen bg-premium-background">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-premium-text mb-2">User Management</h1>
                    <p className="text-gray-600">Manage all users, their status, and account information</p>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                    <div className="bg-white rounded-[--radius-card] shadow-md p-4">
                        <div className="text-2xl font-bold text-premium-text">{stats.total}</div>
                        <div className="text-sm text-gray-600">Total Users</div>
                    </div>
                    <div className="bg-white rounded-[--radius-card] shadow-md p-4">
                        <div className="text-2xl font-bold text-green-600">{stats.active}</div>
                        <div className="text-sm text-gray-600">Active</div>
                    </div>
                    <div className="bg-white rounded-[--radius-card] shadow-md p-4">
                        <div className="text-2xl font-bold text-gray-600">{stats.inactive}</div>
                        <div className="text-sm text-gray-600">Inactive</div>
                    </div>
                    <div className="bg-white rounded-[--radius-card] shadow-md p-4">
                        <div className="text-2xl font-bold text-red-600">{stats.suspended}</div>
                        <div className="text-sm text-gray-600">Suspended</div>
                    </div>
                    <div className="bg-white rounded-[--radius-card] shadow-md p-4">
                        <div className="text-2xl font-bold text-premium-secondary">{stats.customers}</div>
                        <div className="text-sm text-gray-600">Customers</div>
                    </div>
                    <div className="bg-white rounded-[--radius-card] shadow-md p-4">
                        <div className="text-2xl font-bold text-premium-accent">{stats.admins}</div>
                        <div className="text-sm text-gray-600">Admins</div>
                    </div>
                </div>

                {/* User Table */}
                {error && (
                    <div className="mb-6 p-4 rounded-[--radius-card] bg-red-100 text-red-700 border border-red-300">
                        {error}
                    </div>
                )}
                {isLoading ? (
                    <div className="bg-white rounded-[--radius-card] shadow-md p-8 text-center text-gray-600">
                        Loading users...
                    </div>
                ) : (
                    <UserTable
                        users={users}
                        onUserClick={handleUserClick}
                        onStatusChange={handleStatusChange}
                    />
                )}

                {/* User Detail Modal */}
                {selectedUser && (
                    <UserDetail
                        user={selectedUser}
                        onClose={handleCloseDetail}
                        onStatusChange={handleStatusChange}
                    />
                )}
            </div>
        </div>
    )
}

export default UserManagement
