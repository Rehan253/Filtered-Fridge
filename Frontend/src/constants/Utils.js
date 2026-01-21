// Error message formatter
export const formatErrorMessage = (error) => {
    if (!error) return "An unknown error occurred"
    if (typeof error === "string") return error
    if (error.message) return error.message
    if (error.data && error.data.message) return error.data.message
    return "An error occurred"
}

// Success message formatter
export const formatSuccessMessage = (message) => {
    if (!message) return "Operation successful"
    return message
}

// Storage utilities
export const saveToLocalStorage = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
        console.error("Error saving to localStorage:", error)
    }
}

export const getFromLocalStorage = (key) => {
    try {
        const item = localStorage.getItem(key)
        return item ? JSON.parse(item) : null
    } catch (error) {
        console.error("Error getting from localStorage:", error)
        return null
    }
}

export const removeFromLocalStorage = (key) => {
    try {
        localStorage.removeItem(key)
    } catch (error) {
        console.error("Error removing from localStorage:", error)
    }
}
