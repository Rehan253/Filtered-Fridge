import { createContext, useContext, useState, useEffect } from "react"
import authStore from "../data/Auth"

const CartContext = createContext()

export const useCart = () => {
    const context = useContext(CartContext)
    if (!context) {
        throw new Error("useCart must be used within a CartProvider")
    }
    return context
}

export const CartProvider = ({ children }) => {
    const { user } = authStore()
    const getStorageKey = (userId) => (userId ? `freshexpress-cart:${userId}` : "freshexpress-cart:guest")

    // Initialize cart from localStorage
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem(getStorageKey(user?.id))
        return savedCart ? JSON.parse(savedCart) : []
    })
    const [isCartOpen, setIsCartOpen] = useState(false)

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem(getStorageKey(user?.id), JSON.stringify(cartItems))
    }, [cartItems, user?.id])

    useEffect(() => {
        const savedCart = localStorage.getItem(getStorageKey(user?.id))
        setCartItems(savedCart ? JSON.parse(savedCart) : [])
    }, [user?.id])

    const addToCart = (product) => {
        setCartItems((prevItems) => {
            const existingItem = prevItems.find((item) => item.id === product.id)
            if (existingItem) {
                // Increase quantity if item already in cart
                return prevItems.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                )
            } else {
                // Add new item to cart
                return [...prevItems, { ...product, quantity: 1 }]
            }
        })
        // Don't auto-open cart - user will open it manually
    }

    const removeFromCart = (productId) => {
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId))
    }

    const updateQuantity = (productId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(productId)
        } else {
            setCartItems((prevItems) => prevItems.map((item) => (item.id === productId ? { ...item, quantity } : item)))
        }
    }

    const clearCart = () => {
        setCartItems([])
    }

    const toggleCart = () => {
        setIsCartOpen(!isCartOpen)
    }

    const closeCart = () => {
        setIsCartOpen(false)
    }

    const openCart = () => {
        setIsCartOpen(true)
    }

    // Calculate totals
    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0)
    const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
    const tax = subtotal * 0.1 // 10% tax
    const shipping = subtotal > 50 ? 0 : 5.99 // Free shipping over $50
    const total = subtotal + tax + shipping

    const value = {
        cartItems,
        isCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleCart,
        closeCart,
        openCart,
        cartCount,
        subtotal,
        tax,
        shipping,
        total
    }

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
