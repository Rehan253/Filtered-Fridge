/**
 * Check if a product matches user dietary preferences
 * @param {Object} product - Product object
 * @param {Object} preferences - User preferences object
 * @returns {boolean} - True if product matches preferences
 */
export const matchesUserPreferences = (product, preferences) => {
    if (!preferences) return true

    const getDietaryTags = () => {
        const tags = product.dietaryTags || product.dietary_tags
        if (Array.isArray(tags)) {
            return tags.map((tag) => String(tag).toLowerCase())
        }
        if (typeof tags === "string") {
            return tags
                .split(",")
                .map((tag) => tag.trim().toLowerCase())
                .filter(Boolean)
        }

        const text = `${product.category || ""} ${product.name || ""}`.toLowerCase()
        const derived = []
        if (text.includes("halal")) derived.push("halal")
        if (text.includes("kosher")) derived.push("kosher")
        if (text.includes("vegan")) derived.push("vegan")
        if (text.includes("vegetarian")) derived.push("vegetarian")
        return derived
    }

    const dietaryTags = getDietaryTags()

    // Check dietary preferences
    if (preferences.halalOnly && !dietaryTags.includes("halal")) {
        return false
    }
    if (preferences.vegetarian && !dietaryTags.includes("vegetarian")) {
        return false
    }
    if (preferences.vegan && !dietaryTags.includes("vegan")) {
        return false
    }
    if (preferences.kosher && !dietaryTags.includes("kosher")) {
        return false
    }

    // Check allergies - exclude products containing allergens
    if (preferences.allergies && preferences.allergies.length > 0) {
        const rawIngredients = product.ingredients || []
        const productIngredients = (Array.isArray(rawIngredients)
            ? rawIngredients
            : String(rawIngredients).split(",")
        )
            .map((ing) => ing.toLowerCase().trim())
            .filter(Boolean)
        const allergenKeywords = preferences.allergies.map((a) => a.toLowerCase())

        // Check if any allergen is in product ingredients
        for (const allergen of allergenKeywords) {
            // Direct match
            if (productIngredients.some((ing) => ing.includes(allergen) || allergen.includes(ing))) {
                return false
            }

            // Common allergen mappings
            const allergenMap = {
                nuts: ["almond", "walnut", "cashew", "pistachio", "hazelnut", "pecan", "macadamia", "brazil nut"],
                peanuts: ["peanut", "groundnut"],
                dairy: ["milk", "cheese", "butter", "cream", "yogurt", "whey", "casein"],
                eggs: ["egg", "albumin", "lecithin"],
                soy: ["soy", "soya", "tofu", "tempeh"],
                wheat: ["wheat", "flour", "gluten"],
                gluten: ["wheat", "barley", "rye", "flour", "gluten"],
                shellfish: ["shrimp", "crab", "lobster", "prawn", "scallop", "mussel", "oyster"],
                fish: ["fish", "salmon", "tuna", "cod", "sardine", "anchovy"],
                sesame: ["sesame", "tahini"],
                sulfites: ["sulfite", "sulphite"],
                lactose: ["lactose", "milk", "dairy"]
            }

            const mappedAllergens = allergenMap[allergen] || []
            if (
                mappedAllergens.some((mapped) =>
                    productIngredients.some((ing) => ing.includes(mapped) || mapped.includes(ing))
                )
            ) {
                return false
            }
        }
    }

    return true
}

/**
 * Filter products based on user preferences
 * @param {Array} products - Array of product objects
 * @param {Object} preferences - User preferences object
 * @returns {Array} - Filtered products
 */
export const filterProductsByPreferences = (products, preferences) => {
    if (!preferences || Object.keys(preferences).length === 0) {
        return products
    }

    return products.filter((product) => matchesUserPreferences(product, preferences))
}
