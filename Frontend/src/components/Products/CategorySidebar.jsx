import { useMemo } from "react"
import { getCategoryName, CATEGORY_ORDER } from "../../utils/categoryMapping"

const CATEGORY_ICONS = {
    All: "🛒",
    Fruits: "🍎",
    Vegetables: "🥕",
    Dairy: "🥛",
    Bakery: "🍞",
    Meat: "🥩",
    Seafood: "🐟",
    Beverages: "🥤",
    Snacks: "🍿",
    Other: "🧺"
}

const CategorySidebar = ({ onCategorySelect, selectedCategory, products }) => {
    const categories = useMemo(() => {
        const counts = CATEGORY_ORDER.reduce((acc, name) => {
            acc[name] = 0
            return acc
        }, {})

        for (const product of products || []) {
            const name = getCategoryName(product)
            counts[name] = (counts[name] || 0) + 1
        }

        const list = CATEGORY_ORDER.map((name) => ({
            name,
            icon: CATEGORY_ICONS[name] || "🧺",
            count: counts[name] || 0
        }))

        list.unshift({
            name: "All",
            icon: CATEGORY_ICONS.All,
            count: (products || []).length
        })

        return list
    }, [products])

    const handleCategoryClick = (categoryName) => {
        if (onCategorySelect) {
            onCategorySelect(categoryName)
        }
    }

    return (
        <aside className="w-full">
            <div className="bg-white rounded-[--radius-card] shadow-md overflow-hidden sticky top-24">
                {/* Sidebar Header */}
                <div className="bg-premium-secondary text-white p-4">
                    <h2 className="text-lg font-bold">Categories</h2>
                    <p className="text-xs opacity-90">Browse by category</p>
                </div>

                {/* Category List */}
                <div className="p-2">
                    {categories.map((category) => (
                        <button
                            key={category.name}
                            onClick={() => handleCategoryClick(category.name)}
                            className={`w-full flex items-center justify-between p-3 rounded-lg mb-1 transition-all duration-200 ${
                                selectedCategory === category.name
                                    ? "bg-premium-primary text-white shadow-md transform scale-105"
                                    : "hover:bg-premium-background text-premium-text"
                            }`}>
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">{category.icon}</span>
                                <span className="font-semibold text-left">{category.name}</span>
                            </div>
                            <span
                                className={`text-xs px-2 py-1 rounded-full ${
                                    selectedCategory === category.name
                                        ? "bg-white text-premium-primary"
                                        : "bg-premium-background text-premium-text"
                                }`}>
                                {category.count}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </aside>
    )
}

export default CategorySidebar
