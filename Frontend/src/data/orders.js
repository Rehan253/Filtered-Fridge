export const sampleOrders = [
    {
        id: "ORD-2026-001",
        date: "2026-01-15",
        status: "delivered",
        total: 87.45,
        items: [
            {
                id: 1,
                name: "Fresh Red Apples",
                quantity: 2,
                price: 4.99,
                unit: "lb",
                icon: "🍎"
            },
            {
                id: 9,
                name: "Organic Whole Milk",
                quantity: 1,
                price: 4.49,
                unit: "gallon",
                icon: "🥛"
            },
            {
                id: 13,
                name: "Whole Wheat Bread",
                quantity: 3,
                price: 3.99,
                unit: "loaf",
                icon: "🍞"
            },
            {
                id: 16,
                name: "Premium Beef Steak",
                quantity: 2,
                price: 14.99,
                unit: "lb",
                icon: "🥩"
            },
            {
                id: 19,
                name: "Atlantic Salmon",
                quantity: 1,
                price: 16.99,
                unit: "lb",
                icon: "🐟"
            }
        ],
        deliveryAddress: "123 Oak Street, Apt 4B, New York, NY 10001",
        deliveryDate: "2026-01-16",
        paymentMethod: "Credit Card ending in 4242"
    },
    {
        id: "ORD-2026-002",
        date: "2026-01-12",
        status: "delivered",
        total: 45.67,
        items: [
            {
                id: 2,
                name: "Organic Bananas",
                quantity: 2,
                price: 2.99,
                unit: "bunch",
                icon: "🍌"
            },
            {
                id: 5,
                name: "Organic Carrots",
                quantity: 1,
                price: 3.49,
                unit: "lb",
                icon: "🥕"
            },
            {
                id: 7,
                name: "Cherry Tomatoes",
                quantity: 2,
                price: 4.99,
                unit: "pack",
                icon: "🍅"
            },
            {
                id: 10,
                name: "Greek Yogurt",
                quantity: 3,
                price: 5.99,
                unit: "pack",
                icon: "🥛"
            }
        ],
        deliveryAddress: "123 Oak Street, Apt 4B, New York, NY 10001",
        deliveryDate: "2026-01-13",
        paymentMethod: "Credit Card ending in 4242"
    },
    {
        id: "ORD-2026-003",
        date: "2026-01-10",
        status: "processing",
        total: 124.89,
        items: [
            {
                id: 4,
                name: "Fresh Strawberries",
                quantity: 3,
                price: 6.99,
                unit: "pack",
                icon: "🍓"
            },
            {
                id: 11,
                name: "Cheddar Cheese",
                quantity: 2,
                price: 6.99,
                unit: "lb",
                icon: "🧀"
            },
            {
                id: 14,
                name: "Croissants",
                quantity: 2,
                price: 5.49,
                unit: "pack",
                icon: "🥐"
            },
            {
                id: 17,
                name: "Chicken Breast",
                quantity: 3,
                price: 9.99,
                unit: "lb",
                icon: "🍗"
            },
            {
                id: 20,
                name: "Large Shrimp",
                quantity: 2,
                price: 12.99,
                unit: "lb",
                icon: "🦐"
            },
            {
                id: 21,
                name: "Orange Juice",
                quantity: 2,
                price: 5.99,
                unit: "carton",
                icon: "🧃"
            }
        ],
        deliveryAddress: "123 Oak Street, Apt 4B, New York, NY 10001",
        estimatedDelivery: "2026-01-18",
        paymentMethod: "Credit Card ending in 4242"
    },
    {
        id: "ORD-2026-004",
        date: "2026-01-08",
        status: "shipped",
        total: 67.23,
        items: [
            {
                id: 6,
                name: "Fresh Broccoli",
                quantity: 4,
                price: 4.29,
                unit: "head",
                icon: "🥦"
            },
            {
                id: 8,
                name: "Fresh Lettuce",
                quantity: 2,
                price: 2.99,
                unit: "head",
                icon: "🥬"
            },
            {
                id: 12,
                name: "Fresh Butter",
                quantity: 1,
                price: 4.99,
                unit: "lb",
                icon: "🧈"
            },
            {
                id: 22,
                name: "Green Tea",
                quantity: 3,
                price: 4.49,
                unit: "box",
                icon: "🍵"
            },
            {
                id: 24,
                name: "Mixed Nuts",
                quantity: 2,
                price: 7.99,
                unit: "bag",
                icon: "🥜"
            }
        ],
        deliveryAddress: "123 Oak Street, Apt 4B, New York, NY 10001",
        estimatedDelivery: "2026-01-17",
        paymentMethod: "PayPal"
    },
    {
        id: "ORD-2026-005",
        date: "2026-01-05",
        status: "cancelled",
        total: 34.56,
        items: [
            {
                id: 15,
                name: "Bagels",
                quantity: 2,
                price: 4.99,
                unit: "pack",
                icon: "🥯"
            },
            {
                id: 23,
                name: "Sparkling Water",
                quantity: 3,
                price: 6.99,
                unit: "pack",
                icon: "💧"
            }
        ],
        deliveryAddress: "123 Oak Street, Apt 4B, New York, NY 10001",
        cancelledDate: "2026-01-06",
        paymentMethod: "Credit Card ending in 4242",
        cancellationReason: "Changed my mind"
    },
    {
        id: "ORD-2026-006",
        date: "2026-01-03",
        status: "delivered",
        total: 156.78,
        items: [
            {
                id: 3,
                name: "Juicy Oranges",
                quantity: 3,
                price: 5.49,
                unit: "lb",
                icon: "🍊"
            },
            {
                id: 18,
                name: "Ground Turkey",
                quantity: 2,
                price: 8.49,
                unit: "lb",
                icon: "🦃"
            },
            {
                id: 25,
                name: "Potato Chips",
                quantity: 4,
                price: 3.99,
                unit: "bag",
                icon: "🥔"
            },
            {
                id: 26,
                name: "Popcorn",
                quantity: 3,
                price: 4.49,
                unit: "pack",
                icon: "🍿"
            }
        ],
        deliveryAddress: "123 Oak Street, Apt 4B, New York, NY 10001",
        deliveryDate: "2026-01-04",
        paymentMethod: "Credit Card ending in 4242"
    }
]

export const getOrderStatusColor = (status) => {
    const colors = {
        delivered: "bg-green-100 text-green-800",
        shipped: "bg-blue-100 text-blue-800",
        processing: "bg-yellow-100 text-yellow-800",
        cancelled: "bg-red-100 text-red-800"
    }
    return colors[status] || "bg-gray-100 text-gray-800"
}

export const getOrderStatusIcon = (status) => {
    const icons = {
        delivered: "✓",
        shipped: "🚚",
        processing: "⏳",
        cancelled: "✕"
    }
    return icons[status] || "?"
}
