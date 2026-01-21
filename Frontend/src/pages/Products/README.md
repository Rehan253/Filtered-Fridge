# Products Module 🛒

Product browsing, shopping, and catalog pages.

## Pages

### Shop (`/`)

Main product browsing and shopping page with full catalog.

**Features:**

-   Two-column layout (20% sidebar + 80% product grid)
-   Category sidebar navigation
    -   9 categories with icons and product counts
    -   Active state highlighting
    -   Promotional section
    -   Sticky positioning
-   Product grid (1-4 columns responsive)
    -   26 sample products across 8 categories
    -   "ON SALE" badges in Ruby Red
    -   Price display in Orange
    -   Product ratings and reviews
    -   Circular '+' add to cart button
    -   Hover effects and animations
-   Category filtering
-   Sort options (Featured, Price, Name, Newest)
-   Add to cart functionality
-   Responsive design (stacked on mobile)

**File:** `Products/Shop.jsx`

**Route:** `/` (home/landing page)

**Components Used:**

-   `Navbar` - Main navigation
-   `CategorySidebar` - Category browsing
-   `ProductGrid` - Product layout
-   `ProductCard` - Individual products

**Data:**

-   `sampleProducts` - 26 products from `/data/products.js`

---

## Future Pages (Suggested)

This module can be expanded with additional product-related pages:

### ProductDetail (`/product/:id`)

Individual product details page.

**Features (suggested):**

-   Large product images
-   Full description
-   Reviews and ratings
-   Related products
-   Add to cart with quantity
-   Nutrition information

### Cart (`/cart`)

Shopping cart page.

**Features (suggested):**

-   Cart items list
-   Quantity adjustment
-   Remove items
-   Apply coupon codes
-   Price summary
-   Checkout button

### Checkout (`/checkout`)

Order checkout and payment.

**Features (suggested):**

-   Delivery address
-   Payment method
-   Order summary
-   Place order

### Search (`/search`)

Product search results page.

**Features (suggested):**

-   Search query display
-   Filtered results
-   Sort options
-   Filters (price, category, rating)

---

## Usage

```jsx
// Import from Products module
import { Shop } from "./pages/Products"

// Or from main pages export
import { Shop } from "./pages"

// Use in routes
;<Route
    path="/"
    element={<Shop />}
/>
```

## Data Structure

### Product Object

```javascript
{
    id: 1,
    name: "Fresh Red Apples",
    category: "Fruits",
    price: 4.99,
    originalPrice: 6.99,  // Optional
    discount: 20,         // Optional (%)
    unit: "lb",
    icon: "🍎",
    description: "Crisp and sweet red apples",
    stock: 45,
    rating: 4.5,
    reviews: 128
}
```

## State Management

**Shop Page State:**

```javascript
const [cart, setCart] = useState(0)
const [selectedCategory, setSelectedCategory] = useState("All")
```

## Integration Points

### Add to Cart

```javascript
const handleAddToCart = (product) => {
    setCart(cart + 1)
    // TODO: Add to cart state management
    // - Use Context API or Zustand
    // - Store in localStorage
    // - Sync with backend
}
```

### Category Selection

```javascript
const handleCategorySelect = (category) => {
    setSelectedCategory(category)
    // Filters products in ProductGrid
}
```

## Theme

Uses the **FreshExpress Premium Theme**:

-   Orange (#FF6B35) - Add to cart buttons, prices
-   Navy (#004E89) - Category sidebar header, product names
-   Ruby Red (#D81159) - "ON SALE" badges
-   Off-white (#F4F7F6) - Page background
-   12px card radius, 30px button radius

## Categories

8 product categories:

1. 🍎 Fruits (4 products)
2. 🥕 Vegetables (4 products)
3. 🥛 Dairy (4 products)
4. 🍞 Bakery (3 products)
5. 🥩 Meat (3 products)
6. 🐟 Seafood (2 products)
7. 🥤 Beverages (3 products)
8. 🍿 Snacks (3 products)

## Responsive Behavior

**Desktop (lg+):**

-   Sidebar: 20% fixed width, sticky
-   Product grid: 4 columns
-   Full navbar with search

**Tablet (md):**

-   Sidebar: Adjusted width
-   Product grid: 2-3 columns
-   Navbar search below

**Mobile (< md):**

-   Stacked layout
-   Sidebar: Full width, not sticky
-   Product grid: 1-2 columns
-   Collapsible category menu

## Related Components

**Component Module:**

-   `/components/Navbar/` - Navigation
-   `/components/CategorySidebar/` - Category filtering
-   `/components/ProductCard/` - Product display
-   `/components/Products/ProductGrid.jsx` - Grid layout

**Data:**

-   `/data/products.js` - Product catalog

## Related Documentation

-   **Product Components:** `/components/ProductCard/README.md`
-   **Product Data:** `/data/products.js`

---

**Module:** Products  
**Pages:** 1 (Shop) - Expandable to 4+ pages  
**Sample Data:** 26 products  
**Status:** ✅ Complete
