import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"
import * as api from "../api/products"

const normalizeIngredients = (ingredients) => {
    if (!ingredients) return []
    if (Array.isArray(ingredients)) return ingredients
    return String(ingredients)
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
}

const mapProductFromApi = (product) => ({
    ...product,
    stock: product.quantity_in_stock ?? product.stock ?? 0,
    image: product.picture_url ?? product.image ?? "",
    ingredients: normalizeIngredients(product.ingredients),
    description: product.description ?? "",
    unit: product.unit ?? "unit",
    originalPrice: product.originalPrice ?? null,
    discount: product.discount ?? null
})

const mapProductToApi = (product) => ({
    name: product.name,
    brand: product.brand || "Generic",
    category: product.category,
    description: product.description || "",
    unit: product.unit || "unit",
    price: product.price,
    originalPrice: product.originalPrice ?? null,
    discount: product.discount ?? null,
    quantity_in_stock: product.stock,
    picture_url: product.image || null,
    icon: product.icon || null,
    rating: product.rating ?? null,
    reviews: product.reviews ?? null,
    ingredients: product.ingredients
})

const productStore = create(
    devtools(
        persist(
            (set, get) => ({
                products: [],
                product: null,
                isLoading: false,
                error: null,
                totalCount: 0,

                // Fetch all products (no pagination, backend returns all at once)
                fetchProducts: async (filters = {}) => {
                    set({ isLoading: true, error: null }, false, "fetchProducts/start")
                    try {
                        const response = await api.getProducts(filters)

                        // Check for API error response
                        if (response && response.status === "Error") {
                            const errorMessage = response.errorMessage || "Failed to fetch products"
                            set({ isLoading: false, error: errorMessage }, false, "fetchProducts/error")
                            return { success: false, error: errorMessage }
                        }

                        if (Array.isArray(response)) {
                            set(
                                {
                                    products: response.map(mapProductFromApi),
                                    isLoading: false,
                                    error: null,
                                    totalCount: response.length
                                },
                                false,
                                "fetchProducts/success"
                            )
                            return { success: true, data: response }
                        } else if (response && response.data) {
                            set(
                                {
                                    products: response.data.map(mapProductFromApi),
                                    isLoading: false,
                                    error: null,
                                    totalCount: response.count || response.data.length
                                },
                                false,
                                "fetchProducts/success"
                            )
                            return { success: true, data: response.data }
                        }
                    } catch (err) {
                        const errorMessage = err.message || "Failed to fetch products"
                        set({ isLoading: false, error: errorMessage }, false, "fetchProducts/error")
                        return { success: false, error: errorMessage }
                    }
                },

                // Fetch single product
                fetchProductById: async (id) => {
                    set({ isLoading: true, error: null }, false, "fetchProductById/start")
                    try {
                        const response = await api.getProductById(id)

                        // Check for API error response
                        if (response && response.status === "Error") {
                            const errorMessage = response.errorMessage || "Failed to fetch product"
                            set({ isLoading: false, error: errorMessage }, false, "fetchProductById/error")
                            return { success: false, error: errorMessage }
                        }

                        if (response) {
                            set(
                                { product: mapProductFromApi(response), isLoading: false, error: null },
                                false,
                                "fetchProductById/success"
                            )
                            return { success: true, data: response }
                        }
                    } catch (err) {
                        const errorMessage = err.message || "Failed to fetch product"
                        set({ isLoading: false, error: errorMessage }, false, "fetchProductById/error")
                        return { success: false, error: errorMessage }
                    }
                },

                // Create product
                createProduct: async (productData) => {
                    set({ isLoading: true, error: null }, false, "createProduct/start")
                    try {
                        const response = await api.createProduct(mapProductToApi(productData))

                        // Check for API error response
                        if (response && response.status === "Error") {
                            const errorMessage = response.errorMessage || "Failed to create product"
                            set({ isLoading: false, error: errorMessage }, false, "createProduct/error")
                            return { success: false, error: errorMessage }
                        }

                        if (response) {
                            const mapped = mapProductFromApi(response)
                            set(
                                (state) => ({
                                    products: [mapped, ...state.products],
                                    isLoading: false,
                                    error: null
                                }),
                                false,
                                "createProduct/success"
                            )
                            return { success: true, data: mapped }
                        }
                    } catch (err) {
                        const errorMessage = err.response?.data?.message || err.message || "Failed to create product"
                        set({ isLoading: false, error: errorMessage }, false, "createProduct/error")
                        return { success: false, error: errorMessage }
                    }
                },

                // Update product
                updateProduct: async (id, productData) => {
                    set({ isLoading: true, error: null }, false, "updateProduct/start")
                    try {
                        const response = await api.updateProduct(id, mapProductToApi(productData))

                        // Check for API error response
                        if (response && response.status === "Error") {
                            const errorMessage = response.errorMessage || "Failed to update product"
                            set({ isLoading: false, error: errorMessage }, false, "updateProduct/error")
                            return { success: false, error: errorMessage }
                        }

                        if (response) {
                            const mapped = mapProductFromApi(response)
                            set(
                                (state) => ({
                                    products: state.products.map((p) => (p.id === id ? mapped : p)),
                                    product: mapped,
                                    isLoading: false,
                                    error: null
                                }),
                                false,
                                "updateProduct/success"
                            )
                            return { success: true, data: mapped }
                        }
                    } catch (err) {
                        const errorMessage = err.response?.data?.message || err.message || "Failed to update product"
                        set({ isLoading: false, error: errorMessage }, false, "updateProduct/error")
                        return { success: false, error: errorMessage }
                    }
                },

                // Delete product
                deleteProduct: async (id) => {
                    set({ isLoading: true, error: null }, false, "deleteProduct/start")
                    try {
                        const response = await api.deleteProduct(id)

                        // Check for API error response
                        if (response && response.status === "Error") {
                            const errorMessage = response.errorMessage || "Failed to delete product"
                            set({ isLoading: false, error: errorMessage }, false, "deleteProduct/error")
                            return { success: false, error: errorMessage }
                        }

                        set(
                            (state) => ({
                                products: state.products.filter((p) => p.id !== id),
                                product: state.product?.id === id ? null : state.product,
                                isLoading: false,
                                error: null
                            }),
                            false,
                            "deleteProduct/success"
                        )
                        return { success: true }
                    } catch (err) {
                        const errorMessage = err.response?.data?.message || err.message || "Failed to delete product"
                        set({ isLoading: false, error: errorMessage }, false, "deleteProduct/error")
                        return { success: false, error: errorMessage }
                    }
                },

                // Clear errors
                clearError: () => set({ error: null }, false, "clearError"),

                // Reset store
                reset: () =>
                    set(
                        {
                            products: [],
                            product: null,
                            isLoading: false,
                            error: null,
                            totalCount: 0
                        },
                        false,
                        "reset"
                    )
            }),
            {
                name: "productStore",
                partialize: (state) => ({
                    products: state.products,
                    totalCount: state.totalCount
                })
            }
        ),
        { name: "productStore" }
    )
)

export default productStore
