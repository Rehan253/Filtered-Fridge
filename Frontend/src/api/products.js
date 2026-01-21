import { sendGet, sendPost, sendPut, sendDelete } from "./generic"

// Get all products (no pagination support in backend)
export const getProducts = (filters = {}) => {
    // Remove pagination parameters, backend returns all products
    const { page, per_page, ...otherFilters } = filters
    const params = new URLSearchParams(otherFilters).toString()
    const url = params ? `products/?${params}` : "products/"
    return sendGet(url)
}

// Get single product by ID
export const getProductById = (id) => {
    return sendGet(`products/${id}/`)
}

// Create new product
export const createProduct = (productData) => {
    return sendPost("products/", productData)
}

// Update product
export const updateProduct = (id, productData) => {
    return sendPut(`products/${id}/`, productData)
}

// Delete product
export const deleteProduct = (id) => {
    return sendDelete(`products/${id}/`)
}
