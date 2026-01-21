# FreshExpress Components Structure 🏗️

Organized, modular component architecture following best practices.

## 📁 Folder Structure

```
Frontend/src/
├── components/
│   ├── Navbar/                   # Main navigation bar
│   │   ├── Navbar.jsx
│   │   ├── index.js
│   │   └── README.md
│   │
│   ├── Products/                 # Product components module
│   │   ├── ProductCard.jsx       # Individual product display
│   │   ├── ProductGrid.jsx       # Product grid layout
│   │   ├── CategorySidebar.jsx   # Category navigation
│   │   ├── index.js
│   │   └── README.md
│   │
│   └── UserProfile/              # User profile & settings components
│       ├── ProfileHeader.jsx     # Page header with back nav
│       ├── ProfileAvatar.jsx     # User avatar with initials
│       ├── FormInput.jsx         # Standard text input
│       ├── PasswordInput.jsx     # Password with visibility toggle
│       ├── TabNavigation.jsx     # Horizontal tabs
│       ├── LoadingButton.jsx     # Button with loading state
│       ├── index.js
│       └── README.md
│
├── pages/                        # Page modules
│   ├── Products/                 # Products/Shopping module
│   │   ├── Shop.jsx              # Main shop/browse page
│   │   ├── index.js
│   │   └── README.md
│   ├── Auth/                     # Authentication module
│   │   ├── Login.jsx             # User login
│   │   ├── Signup.jsx            # User registration
│   │   ├── index.js
│   │   └── README.md
│   ├── User/                     # User profile module
│   │   ├── Profile.jsx           # User profile & orders
│   │   ├── EditProfile.jsx       # Edit profile & password
│   │   ├── index.js
│   │   └── README.md
│   ├── index.js
│   ├── README.md
│   └── PROFILE_README.md
│
└── data/                         # Sample/mock data
    ├── products.js               # Product catalog
    └── orders.js                 # Order history
```

## 🎯 Module Organization Principles

### 1. **Component Modules**

Each feature has its own folder containing:

-   Component file(s) (`ComponentName.jsx`)
-   Export barrel (`index.js`)
-   Documentation (`README.md`)

### 2. **Page Modules**

Related pages are grouped into feature modules:

-   **Auth/** - Authentication pages (Login, Signup)
-   **User/** - User profile pages (Profile, EditProfile)
-   This makes the codebase more organized and easier to navigate

### 3. **Single Responsibility**

Each component has one clear purpose:

-   ✅ `FormInput` - Text input fields
-   ✅ `PasswordInput` - Password-specific input
-   ✅ `LoadingButton` - Buttons with loading states
-   ✅ `TabNavigation` - Tab interface

### 4. **Reusability**

Components are generic and reusable:

```jsx
// Can be used anywhere
<FormInput
    label="Any Field"
    value={value}
    onChange={handler}
/>
```

### 5. **Export Patterns**

**Module exports** (`index.js`):

```javascript
// Named exports for multiple items
export { default as ProfileHeader } from "./ProfileHeader"
export { default as FormInput } from "./FormInput"

// Page module exports
export { Login, Signup } from "./Auth"
export { Profile, EditProfile } from "./User"

// Or single default export
export { default } from "./Navbar"
```

**Import patterns**:

```javascript
// Import from component module
import { FormInput, PasswordInput } from "../components/UserProfile"

// Import from page module
import { Login, Signup } from "../pages/Auth"

// Import via main barrel
import { Login, Profile } from "../pages"

// Import single component
import Navbar from "../components/Navbar"
```

## 📦 Component Categories

### **Navigation Components**

```
Navbar/          - Main site navigation with search, cart, profile
CategorySidebar/ - Product category browsing
```

### **Product Components**

```
ProductCard/     - Individual product with "ON SALE" badge, price
ProductGrid/     - Responsive grid layout for products
```

### **User Profile Components**

```
UserProfile/
  ProfileHeader    - Page headers with back navigation
  ProfileAvatar    - User avatar with photo upload
  FormInput        - Standard text/email/tel inputs
  PasswordInput    - Password with show/hide toggle
  TabNavigation    - Horizontal tab interface
  LoadingButton    - Action buttons with loading states
```

## 📄 Page Modules

### **Auth Module** (`pages/Auth/`)

Authentication-related pages grouped together.

**Pages:**

-   `Login.jsx` - User login with email/password
-   `Signup.jsx` - User registration form

**Export:**

```javascript
// Auth/index.js
export { default as Login } from "./Login"
export { default as Signup } from "./Signup"
```

**Usage:**

```javascript
import { Login, Signup } from "./pages/Auth"
// or
import { Login, Signup } from "./pages"
```

---

### **User Module** (`pages/User/`)

User profile and account management pages.

**Pages:**

-   `Profile.jsx` - User profile with order history
-   `EditProfile.jsx` - Edit profile information & password

**Export:**

```javascript
// User/index.js
export { default as Profile } from "./Profile"
export { default as EditProfile } from "./EditProfile"
```

**Usage:**

```javascript
import { Profile, EditProfile } from "./pages/User"
// or
import { Profile, EditProfile } from "./pages"
```

---

### **Standalone Pages**

-   `Home.jsx` - Main landing page (not in a module)

## 🔄 Component Relationships

```
Pages (High-Level)
    ↓
  Uses
    ↓
Components (Reusable Modules)
    ↓
  Styled with
    ↓
Premium Theme (Tailwind CSS)
```

### Example Flow:

```
EditProfile.jsx (Page)
    ↓ imports
UserProfile Components (Module)
    ↓ uses
FormInput, PasswordInput, LoadingButton
    ↓ styled with
Premium colors, borders, animations
```

## 🎨 Theme Consistency

All components follow the **FreshExpress Premium Theme**:

**Colors:**

-   Primary: `#FF6B35` (Orange)
-   Secondary: `#004E89` (Navy)
-   Accent: `#D81159` (Ruby Red)
-   Background: `#F4F7F6` (Off-white)
-   Text: `#1A1A1A` (Dark)

**Spacing:**

-   Cards: `12px` border radius
-   Buttons: `30px` border radius (pill shape)
-   Padding: Consistent 8/16/24/32px scale

**Interactions:**

-   Hover: Scale transform (1.05x)
-   Focus: Orange border
-   Transitions: 200-300ms smooth
-   Loading: Spinner with disabled state

## 📝 Usage Examples

### **1. Using UserProfile Components**

```jsx
import { useState } from "react"
import { ProfileHeader, FormInput, LoadingButton } from "../components/UserProfile"

const MyPage = () => {
    const [formData, setFormData] = useState({ name: "" })
    const [loading, setLoading] = useState(false)

    return (
        <div>
            <ProfileHeader
                title="My Page"
                backLink="/profile"
            />

            <FormInput
                label="Name"
                id="name"
                name="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
            />

            <LoadingButton loading={loading}>Submit</LoadingButton>
        </div>
    )
}
```

### **2. Using Product Components**

```jsx
import ProductCard from "../components/ProductCard"
import { ProductGrid } from "../components/Products"
import { sampleProducts } from "../data/products"

const Shop = () => {
    const handleAddToCart = (product) => {
        console.log("Added:", product)
    }

    return (
        <ProductGrid
            products={sampleProducts}
            onAddToCart={handleAddToCart}
        />
    )
}
```

### **3. Using Navigation Components**

```jsx
import Navbar from "../components/Navbar"
import CategorySidebar from "../components/CategorySidebar"

const Layout = () => {
    return (
        <div>
            <Navbar cartCount={5} />

            <div className="flex">
                <CategorySidebar onCategorySelect={(cat) => console.log(cat)} />
                <main>{/* Content */}</main>
            </div>
        </div>
    )
}
```

## ✅ Benefits of This Structure

### **1. Maintainability**

-   Easy to find and update components
-   Clear separation of concerns
-   Documented with README files

### **2. Scalability**

-   Add new modules easily
-   Extend existing components
-   No file size bloat

### **3. Reusability**

-   Components work anywhere
-   Consistent behavior
-   DRY (Don't Repeat Yourself)

### **4. Team Collaboration**

-   Clear ownership per module
-   Easy code reviews
-   Standard patterns

### **5. Testing**

-   Test components in isolation
-   Mock dependencies easily
-   Unit test coverage

## 🚀 Adding New Components

To add a new component module:

1. **Create folder**: `components/NewModule/`
2. **Add component**: `NewModule.jsx`
3. **Add barrel export**: `index.js`
4. **Document it**: `README.md`

**Example:**

```bash
mkdir components/CartModule
touch components/CartModule/CartItem.jsx
touch components/CartModule/CartSummary.jsx
touch components/CartModule/index.js
touch components/CartModule/README.md
```

**index.js:**

```javascript
export { default as CartItem } from "./CartItem"
export { default as CartSummary } from "./CartSummary"
```

**Usage:**

```javascript
import { CartItem, CartSummary } from "../components/CartModule"
```

## 📚 Documentation

Each module includes:

-   **Component docs** in module README
-   **Props specification** with types
-   **Usage examples** with code
-   **Features list** describing behavior

## 🎯 Best Practices

1. ✅ Keep components small and focused
2. ✅ Use prop-types or TypeScript for type safety
3. ✅ Document all props and usage
4. ✅ Follow naming conventions
5. ✅ Maintain consistent styling
6. ✅ Write reusable, generic code
7. ✅ Test components independently

---

**Current Status:** ✅ **Fully Organized & Production Ready**

**Total Modules:** 5 (Navbar, CategorySidebar, ProductCard, Products, UserProfile)

**Total Components:** 13+ individual components

**All documented:** ✅ Yes (README in each module)
