import jsPDF from "jspdf"

/**
 * Formats a date string to a readable format
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
    })
}

/**
 * Generates a PDF invoice from order data
 * Works with both Profile order format and Checkout order format
 * @param {Object} order - Order object
 * @param {string} order.id - Order ID (e.g., "ORD-2026-001" or "FE1737123456789")
 * @param {string} order.orderNumber - Alternative order number field
 * @param {string} order.date - Order date
 * @param {string} order.status - Order status (optional)
 * @param {Array} order.items - Order items array
 * @param {string|Object} order.deliveryAddress - Delivery address (string or object)
 * @param {string} order.paymentMethod - Payment method
 * @param {number} order.total - Total amount
 * @param {number} order.subtotal - Subtotal (optional, will be calculated if not provided)
 * @param {number} order.tax - Tax amount (optional, will be calculated if not provided)
 * @param {number} order.shipping - Shipping amount (optional, will be calculated if not provided)
 * @returns {void} Downloads the PDF file
 */
export const generateInvoicePDF = (order) => {
    // Create new PDF document
    const doc = new jsPDF()

    // Set colors
    const primaryColor = [255, 107, 53] // #FF6B35
    const secondaryColor = [0, 78, 137] // #004E89
    const textColor = [26, 26, 26] // #1A1A1A

    // Calculate order details if not provided
    const subtotal =
        order.subtotal !== undefined
            ? order.subtotal
            : order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const tax = order.tax !== undefined ? order.tax : subtotal * 0.1 // 10% tax
    const shipping = order.shipping !== undefined ? order.shipping : order.total - subtotal - tax

    // Get order number (support both formats)
    const orderNumber = order.orderNumber || order.id

    // Header - Company Name
    doc.setFillColor(...primaryColor)
    doc.rect(0, 0, 210, 40, "F")
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(28)
    doc.setFont("helvetica", "bold")
    doc.text("The Filtered Fridge", 105, 25, { align: "center" })
    doc.setFontSize(12)
    doc.setFont("helvetica", "normal")
    doc.text("Premium Online Grocery Store", 105, 33, { align: "center" })

    // Order Title
    doc.setTextColor(...secondaryColor)
    doc.setFontSize(22)
    doc.setFont("helvetica", "bold")
    doc.text("Order Invoice", 20, 55)

    // Order Details Box
    doc.setTextColor(...textColor)
    doc.setFontSize(11)
    doc.setFont("helvetica", "normal")
    doc.text(`Order Number: ${orderNumber}`, 20, 70)
    doc.text(`Order Date: ${formatDate(order.date)}`, 20, 77)
    if (order.status) {
        doc.text(`Status: ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}`, 20, 84)
    }

    // Delivery Address - Handle both string and object formats
    let addressY = order.status ? 97 : 90
    doc.setFont("helvetica", "bold")
    doc.text("Delivery Address:", 20, addressY)
    doc.setFont("helvetica", "normal")

    if (typeof order.deliveryAddress === "string") {
        // Profile page format (string)
        const addressLines = order.deliveryAddress.split(",")
        addressY += 7
        addressLines.forEach((line) => {
            doc.text(line.trim(), 20, addressY)
            addressY += 7
        })
    } else {
        // Checkout page format (object)
        addressY += 7
        doc.text(order.deliveryAddress.fullName, 20, addressY)
        addressY += 7
        doc.text(order.deliveryAddress.address, 20, addressY)
        if (order.deliveryAddress.apartment) {
            addressY += 7
            doc.text(order.deliveryAddress.apartment, 20, addressY)
        }
        addressY += 7
        doc.text(
            `${order.deliveryAddress.city}, ${order.deliveryAddress.state} ${order.deliveryAddress.zipCode}`,
            20,
            addressY
        )
        if (order.deliveryAddress.phone) {
            addressY += 7
            doc.text(`Phone: ${order.deliveryAddress.phone}`, 20, addressY)
        }
        if (order.deliveryAddress.email) {
            addressY += 7
            doc.text(`Email: ${order.deliveryAddress.email}`, 20, addressY)
        }
    }

    // Order Items Table Header
    const startY = addressY + 10
    doc.setFillColor(...secondaryColor)
    doc.rect(20, startY, 170, 10, "F")
    doc.setTextColor(255, 255, 255)
    doc.setFont("helvetica", "bold")
    doc.setFontSize(10)
    doc.text("Item", 25, startY + 7)
    doc.text("Qty", 120, startY + 7)
    doc.text("Price", 145, startY + 7)
    doc.text("Total", 170, startY + 7)

    // Order Items
    doc.setTextColor(...textColor)
    doc.setFont("helvetica", "normal")
    let currentY = startY + 15
    order.items.forEach((item) => {
        if (currentY > 270) {
            doc.addPage()
            currentY = 20
        }
        doc.text(item.name, 25, currentY)
        doc.text(item.quantity.toString(), 125, currentY, { align: "center" })
        doc.text(`$${item.price.toFixed(2)}`, 150, currentY, { align: "center" })
        doc.text(`$${(item.price * item.quantity).toFixed(2)}`, 175, currentY, { align: "center" })
        currentY += 7
    })

    // Summary
    currentY += 10
    doc.setDrawColor(200, 200, 200)
    doc.line(120, currentY, 190, currentY)

    currentY += 8
    doc.text("Subtotal:", 120, currentY)
    doc.text(`$${subtotal.toFixed(2)}`, 175, currentY, { align: "center" })

    currentY += 7
    doc.text("Tax (10%):", 120, currentY)
    doc.text(`$${tax.toFixed(2)}`, 175, currentY, { align: "center" })

    currentY += 7
    doc.text("Shipping:", 120, currentY)
    doc.text(shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`, 175, currentY, {
        align: "center"
    })

    currentY += 10
    doc.setDrawColor(...secondaryColor)
    doc.setLineWidth(0.5)
    doc.line(120, currentY, 190, currentY)

    currentY += 8
    doc.setFont("helvetica", "bold")
    doc.setFontSize(12)
    doc.text("Total:", 120, currentY)
    doc.setTextColor(...primaryColor)
    doc.text(`$${order.total.toFixed(2)}`, 175, currentY, { align: "center" })

    // Payment Method
    if (order.paymentMethod) {
        currentY += 15
        doc.setTextColor(...textColor)
        doc.setFontSize(10)
        doc.setFont("helvetica", "bold")
        doc.text("Payment Method:", 20, currentY)
        doc.setFont("helvetica", "normal")
        // Handle both string format (Profile) and code format (Checkout)
        const paymentText =
            typeof order.paymentMethod === "string" && order.paymentMethod.length > 10
                ? order.paymentMethod // Full string like "Credit Card ending in 4242"
                : order.paymentMethod === "card"
                ? "Credit/Debit Card"
                : order.paymentMethod === "paypal"
                ? "PayPal"
                : order.paymentMethod === "cod"
                ? "Cash on Delivery"
                : order.paymentMethod
        doc.text(paymentText, 60, currentY)
    }

    // Footer
    doc.setFontSize(9)
    doc.setTextColor(150, 150, 150)
    doc.text("Thank you for shopping with The Filtered Fridge!", 105, 280, { align: "center" })
    doc.text("For support: support@freshexpress.com | +1 (555) 123-4567", 105, 286, {
        align: "center"
    })

    // Save PDF
    doc.save(`TheFilteredFridge-Invoice-${orderNumber}.pdf`)
}
