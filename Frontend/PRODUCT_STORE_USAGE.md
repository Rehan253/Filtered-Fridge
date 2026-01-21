/\*\*

- PRODUCT STORE & API INTEGRATION GUIDE
-
- This file shows examples of how to use the product store and API
- in your React components.
  \*/

// ============================================
// EXAMPLE 1: Basic Product Listing
// ============================================

import { useEffect, useState } from "react"
import productStore from "../data/Products"

function ProductListExample() {
const { fetchProducts, products, isLoading, error } = productStore()

    useEffect(() => {
        // Fetch products on component mount
        fetchProducts(1, 12) // page 1, 12 items per page
    }, [])

    if (isLoading) return <div>Loading products...</div>
    if (error) return <div>Error: {error}</div>

    return (
        <div>
            <h2>Products</h2>
            <div className="grid grid-cols-4 gap-4">
                {products.map((product) => (
                    <div key={product.id}>
                        <img src={product.picture_url} alt={product.name} />
                        <h3>{product.name}</h3>
                        <p>${product.price}</p>
                        <p>Stock: {product.quantity_in_stock}</p>
                    </div>
                ))}
            </div>
        </div>
    )

}

// ============================================
// EXAMPLE 2: Using the Custom Hook
// ============================================

import { useFetchProducts, useFetchProduct } from "../common/hooks/useProducts"

function ProductDetailExample({ productId }) {
const { product, isLoading, error } = useFetchProduct(productId)

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>Error: {error}</div>

    return (
        <div>
            <h1>{product?.name}</h1>
            <p>Brand: {product?.brand}</p>
            <p>Price: ${product?.price}</p>
            <img src={product?.picture_url} alt={product?.name} />
        </div>
    )

}

// ============================================
// EXAMPLE 3: Create Product (Admin)
// ============================================

function CreateProductExample() {
const { createProduct, isLoading, error } = productStore()
const [formData, setFormData] = useState({
name: "Red Bull",
brand: "Red Bull",
category: "Energy Drinks",
price: 1,
quantity_in_stock: 200,
picture_url: "https://...",
nutritional_info: "{...}"
})

    const handleSubmit = async (e) => {
        e.preventDefault()
        const result = await createProduct(formData)
        if (result.success) {
            alert("Product created successfully!")
        } else {
            alert("Error: " + result.error)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Product name"
            />
            <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="Price"
            />
            <button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Product"}
            </button>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
    )

}

// ============================================
// EXAMPLE 4: Update Product
// ============================================

function UpdateProductExample({ productId }) {
const { updateProduct, product, fetchProductById, isLoading, error } = productStore()
const [formData, setFormData] = useState(null)

    useEffect(() => {
        fetchProductById(productId)
    }, [productId])

    useEffect(() => {
        if (product) {
            setFormData(product)
        }
    }, [product])

    const handleSubmit = async (e) => {
        e.preventDefault()
        const result = await updateProduct(productId, formData)
        if (result.success) {
            alert("Product updated successfully!")
        }
    }

    if (!formData) return <div>Loading...</div>

    return (
        <form onSubmit={handleSubmit}>
            <input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            />
            <button type="submit" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update Product"}
            </button>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
    )

}

// ============================================
// EXAMPLE 5: Delete Product
// ============================================

function DeleteProductExample({ productId, onDeleted }) {
const { deleteProduct, isLoading, error } = productStore()

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            const result = await deleteProduct(productId)
            if (result.success) {
                alert("Product deleted!")
                onDeleted()
            }
        }
    }

    return (
        <div>
            <button onClick={handleDelete} disabled={isLoading} style={{ color: "red" }}>
                {isLoading ? "Deleting..." : "Delete Product"}
            </button>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    )

}

// ============================================
// EXAMPLE 6: Product Search/Filter
// ============================================

function SearchProductsExample() {
const { fetchProducts, products, isLoading } = productStore()
const [searchTerm, setSearchTerm] = useState("")

    const handleSearch = (e) => {
        e.preventDefault()
        // Apply search filter
        fetchProducts(1, 12, { search: searchTerm })
    }

    return (
        <div>
            <form onSubmit={handleSearch}>
                <input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search products..."
                />
                <button type="submit">Search</button>
            </form>
            {products.map((product) => (
                <div key={product.id}>{product.name}</div>
            ))}
        </div>
    )

}

export {
ProductListExample,
ProductDetailExample,
CreateProductExample,
UpdateProductExample,
DeleteProductExample,
SearchProductsExample
}
