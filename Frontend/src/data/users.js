export const sampleUsers = [
    {
        id: 1,
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "+1 (555) 123-4567",
        role: "customer",
        status: "active",
        joinDate: "2025-12-15",
        totalOrders: 12,
        totalSpent: 1245.67,
        lastOrderDate: "2026-01-15",
        address: "123 Oak Street, Apt 4B, New York, NY 10001"
    },
    {
        id: 2,
        name: "Jane Smith",
        email: "jane.smith@example.com",
        phone: "+1 (555) 234-5678",
        role: "customer",
        status: "active",
        joinDate: "2025-11-20",
        totalOrders: 8,
        totalSpent: 567.89,
        lastOrderDate: "2026-01-12",
        address: "456 Maple Avenue, Los Angeles, CA 90001"
    },
    {
        id: 3,
        name: "Bob Johnson",
        email: "bob.johnson@example.com",
        phone: "+1 (555) 345-6789",
        role: "customer",
        status: "inactive",
        joinDate: "2025-10-05",
        totalOrders: 3,
        totalSpent: 234.56,
        lastOrderDate: "2025-12-20",
        address: "789 Pine Road, Chicago, IL 60601"
    },
    {
        id: 4,
        name: "Alice Williams",
        email: "alice.williams@example.com",
        phone: "+1 (555) 456-7890",
        role: "customer",
        status: "active",
        joinDate: "2025-09-18",
        totalOrders: 15,
        totalSpent: 1890.23,
        lastOrderDate: "2026-01-18",
        address: "321 Elm Street, Houston, TX 77001"
    },
    {
        id: 5,
        name: "Charlie Brown",
        email: "charlie.brown@example.com",
        phone: "+1 (555) 567-8901",
        role: "customer",
        status: "active",
        joinDate: "2026-01-05",
        totalOrders: 2,
        totalSpent: 89.45,
        lastOrderDate: "2026-01-10",
        address: "654 Cedar Lane, Phoenix, AZ 85001"
    },
    {
        id: 6,
        name: "Diana Prince",
        email: "diana.prince@example.com",
        phone: "+1 (555) 678-9012",
        role: "admin",
        status: "active",
        joinDate: "2025-08-01",
        totalOrders: 0,
        totalSpent: 0,
        lastOrderDate: null,
        address: "987 Birch Boulevard, Miami, FL 33101"
    },
    {
        id: 7,
        name: "Edward Norton",
        email: "edward.norton@example.com",
        phone: "+1 (555) 789-0123",
        role: "customer",
        status: "suspended",
        joinDate: "2025-07-12",
        totalOrders: 5,
        totalSpent: 456.78,
        lastOrderDate: "2025-11-15",
        address: "147 Spruce Drive, Seattle, WA 98101"
    },
    {
        id: 8,
        name: "Fiona Green",
        email: "fiona.green@example.com",
        phone: "+1 (555) 890-1234",
        role: "customer",
        status: "active",
        joinDate: "2025-06-25",
        totalOrders: 20,
        totalSpent: 2345.67,
        lastOrderDate: "2026-01-17",
        address: "258 Willow Way, Boston, MA 02101"
    }
]

export const getUserStatusColor = (status) => {
    switch (status) {
        case "active":
            return "bg-green-100 text-green-800"
        case "inactive":
            return "bg-gray-100 text-gray-800"
        case "suspended":
            return "bg-red-100 text-red-800"
        default:
            return "bg-gray-100 text-gray-800"
    }
}

export const getRoleColor = (role) => {
    switch (role) {
        case "admin":
            return "bg-premium-accent text-white"
        case "customer":
            return "bg-premium-secondary text-white"
        default:
            return "bg-gray-100 text-gray-800"
    }
}
