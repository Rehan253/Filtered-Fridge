# Utils 📦

Utility functions and helpers for the FreshExpress application.

## Functions

### `generateInvoicePDF(order)`

Generates and downloads a professional PDF invoice from order data.

**Location:** `/utils/pdfInvoice.js`

**Usage:**

```javascript
import { generateInvoicePDF } from "../utils/pdfInvoice"

// In your component
const handleDownload = () => {
    generateInvoicePDF(order)
}
```

**Parameters:**

| Parameter | Type   | Required | Description                  |
| --------- | ------ | -------- | ---------------------------- |
| `order`   | Object | Yes      | Order object (see structure) |

**Order Object Structure:**

The function accepts order objects in two formats:

**Format 1: Profile Page Format**

```javascript
{
    id: "ORD-2026-001",              // Order ID
    date: "2026-01-15",              // ISO date string
    status: "delivered",             // Order status (optional)
    total: 87.45,                    // Total amount
    items: [                          // Array of items
        {
            name: "Fresh Red Apples",
            quantity: 2,
            price: 4.99,
            unit: "lb",
            icon: "🍎"
        }
    ],
    deliveryAddress: "123 Oak Street, Apt 4B, New York, NY 10001", // String format
    paymentMethod: "Credit Card ending in 4242" // Full string
}
```

**Format 2: Checkout Page Format**

```javascript
{
    orderNumber: "FE1737123456789",  // Order number
    date: "2026-01-18T12:00:00.000Z", // ISO date string
    total: 50.59,                     // Total amount
    subtotal: 45.99,                  // Subtotal (optional, calculated if missing)
    tax: 4.60,                        // Tax amount (optional, calculated if missing)
    shipping: 0,                      // Shipping amount (optional, calculated if missing)
    items: [                          // Array of items
        {
            name: "Fresh Red Apples",
            quantity: 2,
            price: 4.99
        }
    ],
    deliveryAddress: {                // Object format
        fullName: "John Doe",
        address: "123 Main Street",
        apartment: "Apt 4B",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        phone: "(555) 123-4567",
        email: "john@example.com"
    },
    paymentMethod: "card"             // Code format: "card", "paypal", "cod"
}
```

**Features:**

-   ✅ **Flexible Input** - Handles both order formats automatically
-   ✅ **Auto-Calculation** - Calculates subtotal, tax, shipping if not provided
-   ✅ **Professional Design** - Branded with FreshExpress colors
-   ✅ **Complete Details** - Order info, items, pricing, delivery address
-   ✅ **Auto-Pagination** - Handles long orders with multiple pages
-   ✅ **Payment Formatting** - Converts payment codes to readable text

**PDF Contents:**

1. **Header** - FreshExpress branding with orange background
2. **Order Details** - Order number, date, status (if available)
3. **Delivery Address** - Full shipping information
4. **Items Table** - All products with quantities, prices, totals
5. **Price Summary** - Subtotal, tax (10%), shipping, grand total
6. **Payment Method** - Confirmed payment type
7. **Footer** - Support contact information

**File Output:**

Downloads as: `FreshExpress-Invoice-{orderNumber}.pdf`

**Examples:**

```javascript
// Profile page order
const profileOrder = {
    id: "ORD-2026-001",
    date: "2026-01-15",
    status: "delivered",
    total: 87.45,
    items: [...],
    deliveryAddress: "123 Oak Street, New York, NY 10001",
    paymentMethod: "Credit Card ending in 4242"
}
generateInvoicePDF(profileOrder)
// Downloads: FreshExpress-Invoice-ORD-2026-001.pdf

// Checkout page order
const checkoutOrder = {
    orderNumber: "FE1737123456789",
    date: "2026-01-18T12:00:00.000Z",
    total: 50.59,
    subtotal: 45.99,
    tax: 4.60,
    shipping: 0,
    items: [...],
    deliveryAddress: {
        fullName: "John Doe",
        address: "123 Main Street",
        city: "New York",
        state: "NY",
        zipCode: "10001"
    },
    paymentMethod: "card"
}
generateInvoicePDF(checkoutOrder)
// Downloads: FreshExpress-Invoice-FE1737123456789.pdf
```

**Used By:**

-   `/pages/User/Profile.jsx` - Download invoice from order history
-   `/pages/Checkout/OrderConfirmation.jsx` - Download invoice after checkout

**Dependencies:**

-   `jspdf` - PDF generation library

---

**Module:** Utils  
**Functions:** 1 (generateInvoicePDF)  
**Status:** ✅ Complete and Production Ready  
**Last Updated:** 2026-01-18
