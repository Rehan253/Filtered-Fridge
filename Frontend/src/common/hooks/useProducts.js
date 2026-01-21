import { useEffect } from "react"
import productStore from "../data/Products"

/**
 * Hook to fetch products on component mount
 * @param {object} filters - Filter parameters (optional)
 * @param {number} page - Page number (default: 1)
 * @param {number} pageSize - Items per page (default: 12)
 */
export const useFetchProducts = (filters = {}, page = 1, pageSize = 12) => {
    const { fetchProducts, products, isLoading, error } = productStore()

    useEffect(() => {
        fetchProducts(page, pageSize, filters)
    }, [page, pageSize, filters])

    return { products, isLoading, error }
}

/**
 * Hook to fetch single product
 * @param {number} id - Product ID
 */
export const useFetchProduct = (id) => {
    const { fetchProductById, product, isLoading, error } = productStore()

    useEffect(() => {
        if (id) {
            fetchProductById(id)
        }
    }, [id])

    return { product, isLoading, error }
}
