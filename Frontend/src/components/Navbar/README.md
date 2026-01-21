# Navbar Component

A responsive navigation component for FreshExpress grocery store with search functionality and category navigation.

## Features

-   **Brand Name**: 'FreshExpress' in Navy (#004E89) with Poppins font
-   **Search Bar**: Wide search bar with 30px border radius, light grey border, and search icon
-   **Cart Icon**: Shopping cart with orange (#FF6B35) notification badge
-   **Category Bar**: Horizontal list of grocery categories (Fruits, Dairy, Bakery, etc.)
-   **Fully Responsive**: Mobile-friendly with collapsible menu
-   **Sticky Navigation**: Stays at the top while scrolling

## Usage

```jsx
import Navbar from "./components/Navbar"

function App() {
    const [cartCount, setCartCount] = useState(0)

    return (
        <div>
            <Navbar cartCount={cartCount} />
            {/* Your other components */}
        </div>
    )
}
```

## Props

| Prop        | Type   | Default | Description                          |
| ----------- | ------ | ------- | ------------------------------------ |
| `cartCount` | number | 0       | Number of items in the shopping cart |

## Categories

The navbar includes the following categories:

-   🍎 Fruits
-   🥕 Vegetables
-   🥛 Dairy
-   🍞 Bakery
-   🥩 Meat
-   🐟 Seafood
-   🥤 Beverages
-   🍿 Snacks

## Mobile Behavior

-   On mobile devices (< 768px):
    -   Search bar appears below the main navbar
    -   Menu button toggles category list
    -   Categories display in a 2-column grid when menu is open

## Desktop Behavior

-   Search bar is centered in the main navbar
-   Categories display in a horizontal scrollable list
-   Hover effects on all interactive elements
