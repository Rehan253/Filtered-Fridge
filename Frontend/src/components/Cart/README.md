# Cart Component Module 🛒

Shopping cart sidebar with real-time updates and checkout integration.

## Components

### CartSidebar

A sliding sidebar that displays cart items, allows quantity management, and provides checkout functionality.

## Features

-   **Sliding Sidebar** - Smooth slide-in animation from the right (380px width on desktop)
-   **Overlay Background** - Light semi-transparent backdrop when cart is open
-   **Real-time Updates** - Cart updates instantly when items are added/removed
-   **Quantity Management** - Increase/decrease item quantities
-   **Remove Items** - Delete items from cart
-   **Price Breakdown** - Subtotal, tax, shipping, and total
-   **Free Shipping Indicator** - Shows progress towards free shipping ($50+)
-   **Empty State** - Friendly message when cart is empty
-   **Checkout Button** - Navigates to delivery address page
-   **LocalStorage Persistence** - Cart persists across page refreshes
-   **Responsive Design** - Full width on mobile, 380px on desktop

## Usage

### Basic Implementation

```jsx
import { CartSidebar } from "../../components/Cart"
import { CartProvider } from "../../context/CartContext"

function App() {
    return (
        <CartProvider>
            <YourPage />
            <CartSidebar />
        </CartProvider>
    )
}
```

### Using Cart Context

```jsx
import { useCart } from "../../context/CartContext"

function ProductCard({ product }) {
    const { addToCart, toggleCart, cartCount } = useCart()

    const handleAddToCart = () => {
        addToCart(product)
        // Cart automatically opens when item is added
    }

    return (
        <div>
            <h3>{product.name}</h3>
            <button onClick={handleAddToCart}>Add to Cart</button>
            <button onClick={toggleCart}>Cart ({cartCount})</button>
        </div>
    )
}
```

## Cart Context API

### State

| Property   | Type    | Description                    |
| ---------- | ------- | ------------------------------ |
| cartItems  | Array   | Array of cart item objects     |
| isCartOpen | Boolean | Whether cart sidebar is open   |
| cartCount  | Number  | Total number of items in cart  |
| subtotal   | Number  | Sum of all item prices         |
| tax        | Number  | 10% of subtotal                |
| shipping   | Number  | $5.99 or FREE if subtotal >$50 |
| total      | Number  | Subtotal + tax + shipping      |

### Methods

| Method         | Parameters       | Description                   |
| -------------- | ---------------- | ----------------------------- |
| addToCart      | (product)        | Add item or increase quantity |
| removeFromCart | (productId)      | Remove item from cart         |
| updateQuantity | (productId, qty) | Update item quantity          |
| clearCart      | ()               | Remove all items              |
| toggleCart     | ()               | Toggle cart open/closed       |
| openCart       | ()               | Open cart sidebar             |
| closeCart      | ()               | Close cart sidebar            |

## Cart Item Structure

```javascript
{
    id: number,              // Product ID
    name: string,            // Product name
    price: number,           // Unit price
    quantity: number,        // Quantity in cart
    icon: string,            // Emoji icon
    image: string,           // Product image URL (optional)
    unit: string,            // Unit of measurement (optional)
    category: string,        // Product category (optional)
    // ... other product properties
}
```

## Features in Detail

### 1. Manual Cart Opening

Cart only opens when user clicks the cart icon in the navbar. When products are added, a visual confirmation shows on the product card instead.

### 2. LocalStorage Persistence

Cart data is saved to `localStorage` under the key `freshexpress-cart` and persists across sessions.

### 3. Free Shipping Progress

Shows a message when user is close to free shipping threshold:

```
"Add $12.50 more for FREE shipping!"
```

### 4. Quantity Controls

-   **Minus Button** - Decreases quantity (removes item if quantity reaches 0)
-   **Plus Button** - Increases quantity
-   **Remove Button** - Instantly removes item from cart

### 5. Price Calculations

-   **Subtotal**: Sum of (price × quantity) for all items
-   **Tax**: 10% of subtotal
-   **Shipping**: $5.99 flat rate, FREE if subtotal > $50
-   **Total**: Subtotal + Tax + Shipping

## Styling

### Theme Colors

-   **Header**: Navy (`bg-premium-secondary`)
-   **Buttons**: Orange (`bg-premium-primary`)
-   **Background**: Off-white (`bg-premium-background`)
-   **Prices**: Orange (`text-premium-primary`)

### Animations

-   **Slide In/Out**: 300ms ease-in-out transform
-   **Overlay Fade**: 300ms opacity transition
-   **Hover Effects**: Scale and shadow transitions

## Integration with Checkout

When "Proceed to Checkout" is clicked:

1. Cart sidebar closes
2. User is navigated to `/checkout/delivery`
3. Cart data is accessible via `useCart()` hook
4. Cart persists throughout checkout flow

## Responsive Behavior

**Mobile (< 640px):**

-   Full width sidebar
-   Stacked layout for cart items

**Desktop (≥ 640px):**

-   Fixed 380px width sidebar
-   Scrollable cart items area with flexbox layout

## Example: Complete Integration

```jsx
// App.jsx
import { CartProvider } from "./context/CartContext"
import { CartSidebar } from "./components/Cart"

function App() {
    return (
        <CartProvider>
            <Router>
                <Routes>
                    <Route
                        path="/"
                        element={<Shop />}
                    />
                    {/* ... other routes */}
                </Routes>
            </Router>
            <CartSidebar />
        </CartProvider>
    )
}

// Shop.jsx
import { useCart } from "../../context/CartContext"

function Shop() {
    const { addToCart } = useCart()

    return (
        <div>
            <Navbar /> {/* Shows cart count */}
            <ProductGrid onAddToCart={addToCart} />
        </div>
    )
}

// Navbar.jsx
import { useCart } from "../../context/CartContext"

function Navbar() {
    const { cartCount, toggleCart } = useCart()

    return (
        <nav>
            <button onClick={toggleCart}>Cart ({cartCount})</button>
        </nav>
    )
}
```

## Accessibility

-   ✅ Keyboard navigation support
-   ✅ Focus management when opening/closing
-   ✅ ARIA labels on interactive elements
-   ✅ Semantic HTML structure
-   ✅ Screen reader friendly

## Performance

-   **LocalStorage**: Automatic save on cart changes
-   **Optimized Rendering**: Only re-renders on cart state changes
-   **Smooth Animations**: Hardware-accelerated transforms

## Future Enhancements

1. **Promo Codes** - Apply discount codes
2. **Save for Later** - Move items to wishlist
3. **Recommended Products** - Show related items
4. **Mini Cart Preview** - Hover preview without opening sidebar
5. **Cart Expiry** - Clear cart after X days
6. **Stock Validation** - Check availability before checkout

## Related Documentation

-   **Cart Context:** `/context/CartContext.jsx`
-   **Checkout Flow:** `/pages/Checkout/README.md`
-   **Product Components:** `/components/Products/README.md`

---

**Module:** Cart  
**Components:** 1 (CartSidebar)  
**Context:** CartContext  
**Status:** ✅ Complete and Production Ready  
**Last Updated:** 2026-01-18
