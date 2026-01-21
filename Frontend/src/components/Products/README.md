# Products Component Module 🛒

Comprehensive module containing all product-related display and browsing components for the FreshExpress grocery store.

## Components

### 1. ProductCard

### 2. ProductGrid

### 3. CategorySidebar

---

## 1. ProductCard Component

A beautifully designed product card for displaying grocery items with premium styling and interactions.

### Features

-   **Light grey image container** with smooth hover effects
-   **Product name** in bold Navy (#004E89) text
-   **Price display** in Primary Orange (#FF6B35) color
-   **Price per unit** shown below main price in muted grey (e.g., "$4.99 / lb")
-   **Circular '+' button** in bottom right corner for adding to cart
-   **Add to Cart Animation** - Green overlay with checkmark appears for 2 seconds when item is added
-   **Premium hover effect** - Card scales up (hover:scale-105) with enhanced shadow depth (shadow-xl)
-   **"ON SALE" badge** in Ruby Red (#D81159) in top right corner when discount is present
-   **Discount percentage badge** in top left corner showing savings
-   **Stock indicators** for low inventory (when not on sale)
-   **Rating display** with stars and review count
-   **Category tags** with custom styling
-   **Smooth animations** including pulse effect on sale badges

### Usage

```jsx
import { ProductCard } from "../components/Products"

function MyComponent() {
    const product = {
        id: 1,
        name: "Fresh Red Apples",
        category: "Fruits",
        price: 4.99,
        originalPrice: 6.99,
        discount: 20,
        unit: "lb",
        icon: "🍎",
        description: "Crisp and sweet red apples",
        stock: 45,
        rating: 4.5,
        reviews: 128
    }

    const handleAddToCart = (product) => {
        console.log("Added:", product)
    }

    return (
        <ProductCard
            product={product}
            onAddToCart={handleAddToCart}
        />
    )
}
```

### Props

| Prop          | Type     | Required | Description                                   |
| ------------- | -------- | -------- | --------------------------------------------- |
| `product`     | Object   | Yes      | Product data object (see structure below)     |
| `onAddToCart` | Function | No       | Callback function when add to cart is clicked |

### Product Object Structure

```javascript
{
    id: number,              // Unique identifier
    name: string,            // Product name
    category: string,        // Product category
    price: number,           // Current price
    originalPrice: number,   // Optional: Original price for discount display
    discount: number,        // Optional: Discount percentage
    unit: string,            // Optional: Unit of measurement (lb, kg, pack, etc.)
    icon: string,            // Optional: Emoji icon to display
    image: string,           // Optional: Product image URL
    description: string,     // Optional: Short product description
    stock: number,           // Optional: Available stock
    rating: number,          // Optional: Product rating (0-5)
    reviews: number          // Optional: Number of reviews
}
```

---

## 2. ProductGrid Component

Responsive grid layout for displaying multiple product cards with filtering and sorting capabilities.

### Features

-   **Responsive grid layout** (1-4 columns based on screen size)
-   **Category filtering** integration
-   **Sort functionality** (Featured, Price Low-High, Price High-Low, Name, Newest)
-   **Product count display**
-   **Empty state handling**
-   **Grid animations** with staggered appearance

### Usage

```jsx
import { ProductGrid } from "../components/Products"
import { sampleProducts } from "../data/products"

function Shop() {
    const [selectedCategory, setSelectedCategory] = useState("All")

    const handleAddToCart = (product) => {
        console.log("Added:", product)
    }

    return (
        <ProductGrid
            products={sampleProducts}
            selectedCategory={selectedCategory}
            onAddToCart={handleAddToCart}
        />
    )
}
```

### Props

| Prop               | Type     | Required | Description                               |
| ------------------ | -------- | -------- | ----------------------------------------- |
| `products`         | Array    | Yes      | Array of product objects                  |
| `selectedCategory` | String   | No       | Currently selected category for filtering |
| `onAddToCart`      | Function | No       | Callback when product is added to cart    |

### Responsive Breakpoints

-   **Mobile (< 640px)**: 1 column
-   **Small tablet (640px-768px)**: 2 columns
-   **Tablet (768px-1024px)**: 3 columns
-   **Desktop (> 1024px)**: 4 columns

---

## 3. CategorySidebar Component

A vertical navigation sidebar for browsing product categories with interactive selection and product counts.

### Features

-   **White card background** with soft shadow and rounded corners
-   **Vertical category list** with icons and product counts
-   **Active category highlighting** in Primary Orange
-   **Sticky positioning** - stays visible while scrolling
-   **Product count badges** for each category
-   **Promotional section** at the bottom
-   **Smooth transitions** and hover effects

### Usage

```jsx
import { CategorySidebar } from "../components/Products"

function Shop() {
    const handleCategorySelect = (category) => {
        console.log("Selected:", category)
        // Filter products by category
    }

    return (
        <div className="flex gap-6">
            <div className="w-1/5">
                <CategorySidebar onCategorySelect={handleCategorySelect} />
            </div>
            {/* Main content */}
        </div>
    )
}
```

### Props

| Prop               | Type     | Required | Description                          |
| ------------------ | -------- | -------- | ------------------------------------ |
| `onCategorySelect` | Function | No       | Callback when a category is selected |

### Categories

The sidebar includes these categories by default:

-   🛒 All (156 products)
-   🍎 Fruits (24 products)
-   🥕 Vegetables (32 products)
-   🥛 Dairy (18 products)
-   🍞 Bakery (15 products)
-   🥩 Meat (12 products)
-   🐟 Seafood (10 products)
-   🥤 Beverages (28 products)
-   🍿 Snacks (17 products)

### Styling

-   Width: Approximately 20% of container on desktop
-   Background: White with shadow-md
-   Border radius: 12px (--radius-card)
-   Sticky positioning at top: 24px (below navbar)
-   Active state: Orange background with white text
-   Promotional banner included at bottom

---

## Complete Usage Example

### Import all components from the module:

```jsx
import { CategorySidebar, ProductGrid, ProductCard } from "../components/Products"
import { sampleProducts } from "../data/products"
import { useState } from "react"

function Shop() {
    const [selectedCategory, setSelectedCategory] = useState("All")
    const [cart, setCart] = useState(0)

    const handleCategorySelect = (category) => {
        setSelectedCategory(category)
    }

    const handleAddToCart = (product) => {
        setCart(cart + 1)
        console.log("Added to cart:", product.name)
    }

    return (
        <div className="min-h-screen bg-premium-background">
            {/* Two-column layout */}
            <div className="container mx-auto px-4 py-6">
                <div className="flex gap-6">
                    {/* Left Sidebar - 20% */}
                    <div className="hidden lg:block w-1/5">
                        <CategorySidebar onCategorySelect={handleCategorySelect} />
                    </div>

                    {/* Right Content - 80% */}
                    <div className="w-full lg:w-4/5">
                        <ProductGrid
                            products={sampleProducts}
                            selectedCategory={selectedCategory}
                            onAddToCart={handleAddToCart}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Shop
```

---

## Module Structure

```
components/Products/
├── ProductCard.jsx          # Individual product display
├── ProductGrid.jsx          # Grid layout with filtering
├── CategorySidebar.jsx      # Category navigation
├── index.js                 # Barrel export
└── README.md                # This file
```

---

## Theme Consistency

All components follow the **FreshExpress Premium Theme**:

**Colors:**

-   Primary: `#FF6B35` (Orange) - Prices, buttons, active states
-   Secondary: `#004E89` (Navy) - Headers, product names
-   Accent: `#D81159` (Ruby Red) - "ON SALE" badges
-   Background: `#F4F7F6` (Off-white) - Page background
-   Text: `#1A1A1A` (Dark) - Main text

**Styling:**

-   Cards: 12px border radius (`--radius-card`)
-   Buttons: 30px border radius (`--radius-button`)
-   Transitions: 200-300ms smooth
-   Hover: Scale transform (1.05x for cards, 1.10x for buttons)
-   Shadows: `shadow-sm` default, `shadow-xl` on hover

---

## Data Integration

### Product Data Structure

All components expect product data from `/data/products.js`:

```javascript
export const sampleProducts = [
    {
        id: 1,
        name: "Fresh Red Apples",
        category: "Fruits",
        price: 4.99,
        originalPrice: 6.99,
        discount: 20,
        unit: "lb",
        icon: "🍎",
        description: "Crisp and sweet red apples",
        stock: 45,
        rating: 4.5,
        reviews: 128
    }
    // ... more products
]
```

### Category Filtering

The `ProductGrid` automatically filters products based on the `selectedCategory`:

-   If `selectedCategory === "All"`, shows all products
-   Otherwise, filters by `product.category === selectedCategory`

### Sort Options

ProductGrid includes sorting by:

1. **Featured** - Default order
2. **Price: Low to High** - Ascending price
3. **Price: High to Low** - Descending price
4. **Name** - Alphabetical
5. **Newest** - Most recent first

---

## Performance Considerations

-   **Lazy Loading**: Consider implementing lazy loading for images
-   **Virtualization**: For large product lists (> 100 items), consider react-window
-   **Memoization**: ProductCard can be wrapped with React.memo for optimization
-   **Debouncing**: Search and filter operations should be debounced

---

## Accessibility

-   ✅ Semantic HTML elements (`<aside>`, `<button>`, etc.)
-   ✅ ARIA labels on interactive elements
-   ✅ Keyboard navigation support
-   ✅ Focus states on all interactive elements
-   ✅ Alt text for product images
-   ✅ Proper heading hierarchy

---

## Mobile Responsiveness

### CategorySidebar

-   Hidden on mobile (< lg breakpoint)
-   Consider adding a mobile drawer/modal for category selection

### ProductGrid

-   1 column on mobile
-   2 columns on small tablets
-   3-4 columns on desktop

### ProductCard

-   Maintains readability at all screen sizes
-   Touch-friendly button sizes (44x44px minimum)

---

## Future Enhancements

1. **Wishlist Integration** - Add heart icon to ProductCard
2. **Quick View Modal** - Preview product details without navigation
3. **Compare Products** - Select and compare multiple products
4. **Advanced Filters** - Price range, ratings, brands, etc.
5. **Product Variants** - Size, color, weight options
6. **Bulk Actions** - Add multiple items to cart at once
7. **Infinite Scroll** - Load more products dynamically
8. **Image Gallery** - Multiple product images with carousel

---

## Dependencies

**Internal:**

-   `/data/products.js` - Product catalog data

**External:**

-   React (hooks: useState)
-   Tailwind CSS (styling)

**No external libraries required!** Pure React components.

---

## Testing

### Component Tests (Suggested)

```javascript
// ProductCard.test.jsx
- Renders product information correctly
- Shows discount badge when discount prop present
- Calls onAddToCart when button clicked
- Displays rating stars correctly
- Shows low stock warning

// ProductGrid.test.jsx
- Renders all products
- Filters by category correctly
- Sorts products correctly
- Handles empty product array
- Responsive column layout

// CategorySidebar.test.jsx
- Renders all categories
- Highlights selected category
- Calls onCategorySelect callback
- Shows correct product counts
- Displays promotional section
```

---

## Related Documentation

-   **Shop Page:** `/pages/Products/README.md`
-   **Product Data:** `/data/products.js`
-   **Main README:** `/README.md`

---

**Module:** Products  
**Components:** 3 (ProductCard, ProductGrid, CategorySidebar)  
**Status:** ✅ Complete and Production Ready  
**Last Updated:** 2026-01-18
