export const CATEGORY_ORDER = [
    "Fruits",
    "Vegetables",
    "Dairy",
    "Bakery",
    "Meat",
    "Seafood",
    "Beverages",
    "Snacks",
    "Other"
]

const CATEGORY_RULES = [
    { name: "Beverages", keywords: ["beverage", "beverages", "drinks", "water", "juice", "soda", "cola", "coffee", "tea", "sparkling", "beer", "wine", "smoothie"] },
    { name: "Dairy", keywords: ["dairy", "milk", "cheese", "yogurt", "butter", "cream", "kefir"] },
    { name: "Seafood", keywords: ["seafood", "fish", "shrimp", "prawn", "crab", "lobster", "oyster", "mussel", "scallop", "tuna", "salmon", "sardine", "anchovy"] },
    { name: "Meat", keywords: ["meat", "beef", "pork", "chicken", "turkey", "lamb", "veal", "duck", "bacon", "ham", "sausage"] },
    { name: "Vegetables", keywords: ["vegetable", "vegetables", "legume", "legumes", "tomato", "carrot", "onion", "potato", "spinach", "pepper", "courgette", "zucchini", "aubergine", "eggplant"] },
    { name: "Fruits", keywords: ["fruit", "fruits", "apple", "banana", "berry", "citrus", "orange", "grape", "pear", "peach", "mango", "pineapple", "strawberry", "raspberry", "blueberry"] },
    { name: "Bakery", keywords: ["bakery", "bread", "biscuit", "cake", "pastry", "croissant", "muffin", "cookie", "brioche", "bun", "bagel"] },
    { name: "Snacks", keywords: ["snack", "snacks", "chocolate", "candy", "sweet", "bar", "chips", "crackers", "nuts", "granola", "muesli", "popcorn"] }
]

const normalizeTokens = (value) =>
    String(value)
        .toLowerCase()
        .replace(/[_-]/g, " ")
        .split(",")
        .map((token) => token.trim())
        .filter(Boolean)

export const getCategoryName = (product) => {
    const categoryTokens = normalizeTokens(product?.category || "")
    for (const rule of CATEGORY_RULES) {
        if (categoryTokens.some((token) => rule.keywords.some((keyword) => token.includes(keyword)))) {
            return rule.name
        }
    }

    const nameTokens = normalizeTokens(product?.name || "")
    for (const rule of CATEGORY_RULES) {
        if (nameTokens.some((token) => rule.keywords.some((keyword) => token.includes(keyword)))) {
            return rule.name
        }
    }

    return "Other"
}
