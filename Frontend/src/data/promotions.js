export const samplePromotions = [
    {
        id: 1,
        title: "Free Shipping on Orders Over $50!",
        description: "Fresh groceries, delivered to your door.",
        discountType: "shipping", // "percentage", "fixed", "shipping"
        discountValue: 0, // For shipping, 0 means free
        startDate: "2026-01-01",
        endDate: "2026-12-31",
        categories: ["All"], // ["All"] means all categories
        minPurchase: 50,
        status: "active",
        promoCode: "FREESHIP50",
        image: "",
        icon: "🚚"
    },
    {
        id: 2,
        title: "20% Off Fresh Fruits & Vegetables",
        description: "Healthy eating starts here.",
        discountType: "percentage",
        discountValue: 20,
        startDate: "2026-01-15",
        endDate: "2026-02-15",
        categories: ["Fruits", "Vegetables"],
        minPurchase: 0,
        status: "active",
        promoCode: "FRESH20",
        image: "",
        icon: "🍎"
    },
    {
        id: 3,
        title: "Buy 2 Get 1 Free on Dairy Products",
        description: "Stock up on your favorites!",
        discountType: "bogo", // Buy One Get One
        discountValue: 1, // Get 1 free
        startDate: "2026-01-10",
        endDate: "2026-01-31",
        categories: ["Dairy"],
        minPurchase: 0,
        status: "active",
        promoCode: "DAIRYBOGO",
        image: "",
        icon: "🥛"
    },
    {
        id: 4,
        title: "Weekend Special: 15% Off Everything!",
        description: "Don't miss out on amazing deals.",
        discountType: "percentage",
        discountValue: 15,
        startDate: "2026-01-20",
        endDate: "2026-01-21",
        categories: ["All"],
        minPurchase: 25,
        status: "active",
        promoCode: "WEEKEND15",
        image: "",
        icon: "🎉"
    },
    {
        id: 5,
        title: "$10 Off Orders Over $100",
        description: "Save big on large orders!",
        discountType: "fixed",
        discountValue: 10,
        startDate: "2026-01-01",
        endDate: "2026-03-31",
        categories: ["All"],
        minPurchase: 100,
        status: "active",
        promoCode: "SAVE10",
        image: "",
        icon: "💰"
    }
]

export const getPromotionStatus = (promotion) => {
    const now = new Date()
    const startDate = new Date(promotion.startDate)
    const endDate = new Date(promotion.endDate)

    if (promotion.status === "inactive") return "inactive"
    if (now < startDate) return "scheduled"
    if (now > endDate) return "expired"
    return "active"
}

export const getPromotionStatusColor = (status) => {
    switch (status) {
        case "active":
            return "bg-green-100 text-green-800"
        case "scheduled":
            return "bg-blue-100 text-blue-800"
        case "expired":
            return "bg-gray-100 text-gray-800"
        case "inactive":
            return "bg-red-100 text-red-800"
        default:
            return "bg-gray-100 text-gray-800"
    }
}
