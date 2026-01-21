# User Profile & Orders Page

Complete user profile page with order history, matching the FreshExpress premium theme.

## Overview

The Profile page provides users with:

-   Personal information overview
-   Complete order history with detailed views
-   Order management actions (reorder, track, cancel, review)
-   Address management (placeholder)
-   Payment method management (placeholder)

## Features

### 👤 User Profile Sidebar

**Profile Information:**

-   Avatar with user initials
-   Full name and membership level
-   Email address
-   Phone number
-   Member since date
-   Total orders count
-   Member points

**Actions:**

-   Edit Profile button
-   Log Out button

**Stats Display:**

-   Total Orders: Number of orders placed
-   Member Points: Loyalty/rewards points

### 📦 Order History (Main Content)

**Order List Features:**

-   Expandable order cards
-   Order summary with quick glance info
-   Status badges with color coding:
    -   ✓ Delivered (Green)
    -   🚚 Shipped (Blue)
    -   ⏳ Processing (Yellow)
    -   ✕ Cancelled (Red)

**Each Order Card Shows:**

-   Order ID
-   Order date
-   Total amount (prominent)
-   Status badge
-   Number of items
-   Product icons preview (first 4 items + count)
-   Expandable details

**Expanded Order Details:**

-   Complete item list with:
    -   Product icons
    -   Product names
    -   Quantity × Price
    -   Subtotal per item
-   Delivery address
-   Delivery/estimated delivery date
-   Payment method

**Order Actions (Context-Aware):**

-   **Delivered Orders:**
    -   Reorder button
    -   Leave Review button
    -   View Invoice button
-   **Shipped Orders:**
    -   Track Order button
    -   View Invoice button
-   **Processing Orders:**
    -   Cancel Order button
    -   View Invoice button

### 📑 Tab Navigation

**Three Tabs:**

1. **Order History** - Full order management (implemented)
2. **Addresses** - Saved delivery addresses (placeholder)
3. **Payment Methods** - Saved payment options (placeholder)

## Data Structure

### User Object

```javascript
{
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    joinDate: "2025-12-15",
    totalOrders: 6,
    membershipLevel: "Gold"
}
```

### Order Object

```javascript
{
    id: "ORD-2026-001",
    date: "2026-01-15",
    status: "delivered", // delivered | shipped | processing | cancelled
    total: 87.45,
    items: [
        {
            id: 1,
            name: "Fresh Red Apples",
            quantity: 2,
            price: 4.99,
            unit: "lb",
            icon: "🍎"
        }
        // ... more items
    ],
    deliveryAddress: "123 Oak Street, Apt 4B, New York, NY 10001",
    deliveryDate: "2026-01-16", // for delivered
    estimatedDelivery: "2026-01-18", // for in-progress
    paymentMethod: "Credit Card ending in 4242"
}
```

## Design System

### Colors

-   **Status Colors:**
    -   Delivered: Green (#10B981)
    -   Shipped: Blue (#3B82F6)
    -   Processing: Yellow (#F59E0B)
    -   Cancelled: Red (#EF4444)
-   **Primary Actions:** Orange (#FF6B35)
-   **Secondary Actions:** Navy (#004E89)
-   **Text:** Dark (#1A1A1A)

### Components

-   **Sidebar:** White card, 12px radius, shadow-md, sticky
-   **Order Cards:** White, 12px radius, shadow-md, hover effects
-   **Buttons:** 30px radius (pill shape), premium colors
-   **Tabs:** Border bottom indicator for active tab

### Spacing

-   Main container: max-w-7xl
-   Sidebar: 25% width on desktop
-   Main content: 75% width on desktop
-   Mobile: Stacked layout

## Usage

### Basic Navigation

```jsx
// From anywhere in the app
<Link to="/profile">View Profile</Link>

// Navbar already includes profile icon
// Click the user icon in top-right corner
```

### Integration with Auth

The page uses mock data currently. To integrate with real authentication:

```jsx
// Replace mock user data with auth context
import { useAuth } from "../context/AuthContext"

const Profile = () => {
    const { user } = useAuth()

    // Use user.name, user.email, etc.
    // ...
}
```

### Fetching Real Orders

```jsx
// Replace sampleOrders with API call
import { useState, useEffect } from "react"

const Profile = () => {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch("/api/user/orders", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                const data = await response.json()
                setOrders(data.orders)
            } catch (error) {
                console.error("Failed to fetch orders:", error)
            }
            setLoading(false)
        }

        fetchOrders()
    }, [])

    // ...
}
```

## Interactive Features

### Order Expansion

Click any order card to expand/collapse details:

-   Shows complete item list
-   Displays delivery information
-   Reveals action buttons

### Order Actions

**Reorder:**

```javascript
const handleReorder = (order) => {
    // Add all order items to cart
    order.items.forEach((item) => {
        addToCart(item)
    })
    navigate("/")
}
```

**Track Order:**

```javascript
const handleTrackOrder = (orderId) => {
    navigate(`/track/${orderId}`)
}
```

**Cancel Order:**

```javascript
const handleCancelOrder = async (orderId) => {
    const confirmed = window.confirm("Are you sure you want to cancel this order?")
    if (confirmed) {
        await fetch(`/api/orders/${orderId}/cancel`, {
            method: "POST"
        })
        // Refresh orders
    }
}
```

## Responsive Behavior

### Desktop (lg+)

-   Two-column layout: Sidebar (25%) + Main Content (75%)
-   Sidebar is sticky during scroll
-   All tabs visible in navigation

### Tablet (md)

-   Two-column layout with adjusted widths
-   Order cards maintain structure
-   Item list scrolls horizontally if needed

### Mobile (< md)

-   Single column, stacked layout
-   Sidebar becomes full width, not sticky
-   Order cards full width
-   Tab navigation scrollable

## Sample Data

The page includes 6 sample orders with various statuses:

1. **ORD-2026-001** - Delivered ($87.45)
2. **ORD-2026-002** - Delivered ($45.67)
3. **ORD-2026-003** - Processing ($124.89)
4. **ORD-2026-004** - Shipped ($67.23)
5. **ORD-2026-005** - Cancelled ($34.56)
6. **ORD-2026-006** - Delivered ($156.78)

## Customization

### Adding New Tabs

```jsx
// Add to tabs array
const tabs = [
    { id: "orders", label: "Order History" },
    { id: "addresses", label: "Addresses" },
    { id: "payments", label: "Payment Methods" },
    { id: "wishlist", label: "Wishlist" } // New tab
]

// Add corresponding content
{
    activeTab === "wishlist" && <WishlistContent />
}
```

### Custom Order Actions

```jsx
// Add custom action buttons
<button onClick={() => handleCustomAction(order)}>Custom Action</button>
```

### Membership Tiers

```jsx
const getMembershipBadge = (level) => {
    const badges = {
        Bronze: "🥉",
        Silver: "🥈",
        Gold: "🥇",
        Platinum: "💎"
    }
    return badges[level]
}
```

## Empty States

The page handles empty states gracefully:

**No Orders:**

-   Shows package icon 📦
-   "No Orders Yet" message
-   "Start Shopping" CTA button

**Placeholder Tabs:**

-   Icon representation (🏠 for addresses, 💳 for payments)
-   Descriptive message
-   Action button to add new item

## Future Enhancements

-   [ ] Order tracking timeline
-   [ ] Leave product reviews
-   [ ] Download invoice PDF
-   [ ] Order filters (by status, date range)
-   [ ] Search orders
-   [ ] Saved addresses management
-   [ ] Payment methods management
-   [ ] Order notifications
-   [ ] Reorder with modifications
-   [ ] Subscription orders
-   [ ] Wishlist integration
-   [ ] Order analytics/insights

## Accessibility

-   ✅ Keyboard navigation
-   ✅ ARIA labels on interactive elements
-   ✅ Focus states visible
-   ✅ Color contrast compliance
-   ✅ Screen reader friendly

## Performance

-   Order expansion: Client-side toggle (no API calls)
-   Lazy loading: Can implement for large order lists
-   Caching: Order data can be cached client-side

---

**Status:** ✅ Complete - Ready for Backend Integration

**Route:** `/profile`

**Sample Data:** 6 orders included for testing
