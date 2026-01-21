# FreshExpress Module Structure 📦

Complete overview of the modular architecture for components and pages.

## 🏗️ Architecture Overview

```
Frontend/src/
│
├── components/          # Reusable UI Components
│   ├── Navbar/
│   ├── Products/       # ⭐ Product display components
│   └── UserProfile/    # ⭐ Shared form components
│
└── pages/              # Page Modules
    ├── Products/       # ⭐ Shopping & Catalog
    ├── Auth/           # ⭐ Authentication
    └── User/           # ⭐ User Profile
```

---

## 📦 Module Breakdown

### **Component Modules** (Reusable UI)

#### 1. Navbar Module

```
components/Navbar/
├── Navbar.jsx       # Main navigation with search, cart, profile
├── index.js
└── README.md
```

**Used By:** All pages  
**Features:** Search bar, cart badge, profile link, category menu

---

#### 2. Products Module ⭐

```
components/Products/
├── ProductCard.jsx        # Individual product display
├── ProductGrid.jsx        # Responsive product grid layout
├── CategorySidebar.jsx    # Vertical category navigation
├── index.js
└── README.md
```

**Used By:** Shop page (Products/Shop.jsx)  
**Features:** Product cards with "ON SALE" badges, grid layout with filtering/sorting, category navigation

**Export:**

```javascript
export { default as ProductCard } from "./ProductCard"
export { default as ProductGrid } from "./ProductGrid"
export { default as CategorySidebar } from "./CategorySidebar"
```

**Usage:**

```javascript
import { ProductCard, ProductGrid, CategorySidebar } from "../components/Products"
```

---

#### 3. UserProfile Module ⭐

```
components/UserProfile/
├── ProfileHeader.jsx      # Page headers with back nav
├── ProfileAvatar.jsx      # User avatar with initials
├── FormInput.jsx          # Standard form inputs
├── PasswordInput.jsx      # Password with toggle
├── TabNavigation.jsx      # Horizontal tabs
├── LoadingButton.jsx      # Buttons with loading
├── index.js
└── README.md
```

**Used By:** EditProfile page  
**Features:** Reusable form components for user settings

**Export:**

```javascript
export { default as ProfileHeader } from "./ProfileHeader"
export { default as ProfileAvatar } from "./ProfileAvatar"
export { default as FormInput } from "./FormInput"
export { default as PasswordInput } from "./PasswordInput"
export { default as TabNavigation } from "./TabNavigation"
export { default as LoadingButton } from "./LoadingButton"
```

---

### **Page Modules** (Feature Pages)

#### 1. Products Module ⭐

```
pages/Products/
├── Shop.jsx         # Main shopping/browsing page
├── index.js
└── README.md
```

**Routes:**

-   `/` - Shop/landing page (main entry point)

**Features:**

-   Two-column layout (20% sidebar + 80% grid)
-   Category filtering with 8 categories
-   26 sample products across categories
-   Product grid (1-4 columns responsive)
-   "ON SALE" badges and discount display
-   Add to cart functionality
-   Product ratings and reviews
-   Sort options (Featured, Price, Name, Newest)

**Export:**

```javascript
export { default as Shop } from "./Shop"
```

**Usage:**

```javascript
// Direct import from module
import { Shop } from "./pages/Products"

// Or via main pages barrel
import { Shop } from "./pages"

// In routes
;<Route
    path="/"
    element={<Shop />}
/>
```

**Dependencies:**

-   Navbar
-   CategorySidebar
-   Products/ProductGrid
-   ProductCard

**Data:**

-   `sampleProducts` from `/data/products.js`

**Future Expandability:**
This module can be extended with:

-   `ProductDetail.jsx` - Individual product pages (`/product/:id`)
-   `Cart.jsx` - Shopping cart page (`/cart`)
-   `Checkout.jsx` - Checkout and payment (`/checkout`)
-   `Search.jsx` - Search results page (`/search`)

---

#### 2. Auth Module ⭐

```
pages/Auth/
├── Login.jsx        # User login page
├── Signup.jsx       # User registration page
├── index.js
└── README.md
```

**Routes:**

-   `/login` - Login page
-   `/signup` - Signup page

**Features:**

-   Email/password authentication
-   Social login UI (Google, Facebook)
-   Form validation
-   Password visibility toggles
-   Links between login and signup

**Export:**

```javascript
export { default as Login } from "./Login"
export { default as Signup } from "./Signup"
```

**Usage:**

```javascript
// Direct import from module
import { Login, Signup } from "./pages/Auth"

// Or via main pages barrel
import { Login, Signup } from "./pages"

// In routes
<Route path="/login" element={<Login />} />
<Route path="/signup" element={<Signup />} />
```

---

#### 3. User Module ⭐

```
pages/User/
├── Profile.jsx         # User profile & order history
├── EditProfile.jsx     # Edit profile & password
├── index.js
└── README.md
```

**Routes:**

-   `/profile` - Profile dashboard
-   `/edit-profile` - Edit profile page

**Features:**

-   User information sidebar
-   Order history with 6 sample orders
-   Order status tracking
-   Tab navigation (Orders, Addresses, Payments)
-   Edit profile with two sections (Info & Password)
-   Form validation

**Export:**

```javascript
export { default as Profile } from "./Profile"
export { default as EditProfile } from "./EditProfile"
```

**Usage:**

```javascript
// Direct import from module
import { Profile, EditProfile } from "./pages/User"

// Or via main pages barrel
import { Profile, EditProfile } from "./pages"

// In routes
<Route path="/profile" element={<Profile />} />
<Route path="/edit-profile" element={<EditProfile />} />
```

**Dependencies:**

-   Uses `UserProfile` component module for forms

---

## 🔄 Module Dependencies

### Component Module Dependencies

```
Navbar           → None (standalone)
Products         → None (self-contained module with 3 components)
UserProfile      → None (standalone, reusable)
```

### Page Module Dependencies

```
Products/
  Shop           → Navbar, CategorySidebar, Products

Auth/
  Login          → None
  Signup         → None

User/
  Profile        → Navbar, orders data
  EditProfile    → Navbar, UserProfile components
```

---

## 📥 Import Patterns

### **Option 1: Direct Module Import**

```javascript
// Import from specific module
import { Shop } from "../pages/Products"
import { Login, Signup } from "../pages/Auth"
import { Profile, EditProfile } from "../pages/User"
import { ProductCard, ProductGrid, CategorySidebar } from "../components/Products"
import { FormInput, PasswordInput } from "../components/UserProfile"
```

### **Option 2: Main Barrel Import**

```javascript
// Import from main pages barrel
import { Shop, Login, Signup, Profile, EditProfile } from "../pages"
```

### **Option 3: Default Import**

```javascript
// Import single default export
import Navbar from "../components/Navbar"
```

---

## 🎨 Theme Consistency

All modules follow the **FreshExpress Premium Theme**:

**Colors:**

-   Primary: `#FF6B35` (Orange)
-   Secondary: `#004E89` (Navy)
-   Accent: `#D81159` (Ruby Red)
-   Background: `#F4F7F6` (Off-white)
-   Text: `#1A1A1A` (Dark)

**Styling:**

-   Cards: 12px border radius
-   Buttons: 30px border radius (pill shape)
-   Transitions: 200-300ms smooth
-   Hover: Scale transform (1.05x)
-   Focus: Orange border

---

## ✅ Benefits of Modular Structure

### **1. Organization**

-   Related pages grouped together
-   Easy to find and navigate
-   Clear feature boundaries

### **2. Maintainability**

-   Update module without affecting others
-   Clear ownership and responsibility
-   Easier code reviews

### **3. Scalability**

-   Add new features as modules
-   Extend existing modules
-   No file clutter

### **4. Reusability**

-   Share components across pages
-   DRY (Don't Repeat Yourself)
-   Consistent behavior

### **5. Documentation**

-   Each module has README
-   Clear API and usage examples
-   Easy onboarding for new developers

---

## 📊 Module Statistics

**Component Modules:** 3

-   Navbar
-   Products (3 components: ProductCard, ProductGrid, CategorySidebar)
-   UserProfile (6 components)

**Page Modules:** 3

-   Products (1 page, expandable)
-   Auth (2 pages)
-   User (2 pages)

**Total Components:** 10  
**Total Pages:** 5  
**Documentation Files:** 8 READMEs

---

## 🚀 Adding New Modules

### **Add a New Component Module:**

```bash
# 1. Create module folder
mkdir src/components/NewModule

# 2. Create component files
touch src/components/NewModule/Component1.jsx
touch src/components/NewModule/Component2.jsx

# 3. Create barrel export
touch src/components/NewModule/index.js

# 4. Create documentation
touch src/components/NewModule/README.md
```

**index.js:**

```javascript
export { default as Component1 } from "./Component1"
export { default as Component2 } from "./Component2"
```

---

### **Add a New Page Module:**

```bash
# 1. Create module folder
mkdir src/pages/NewModule

# 2. Create page files
touch src/pages/NewModule/Page1.jsx
touch src/pages/NewModule/Page2.jsx

# 3. Create barrel export
touch src/pages/NewModule/index.js

# 4. Create documentation
touch src/pages/NewModule/README.md

# 5. Update main pages/index.js
```

**NewModule/index.js:**

```javascript
export { default as Page1 } from "./Page1"
export { default as Page2 } from "./Page2"
```

**pages/index.js:**

```javascript
export { Page1, Page2 } from "./NewModule"
```

---

## 📝 Best Practices

1. ✅ Keep modules focused on a single feature
2. ✅ Document all modules with README
3. ✅ Use barrel exports (index.js) consistently
4. ✅ Follow naming conventions
5. ✅ Maintain theme consistency
6. ✅ Write reusable components
7. ✅ Test modules independently

---

## 🎯 Real-World Usage

**App.jsx** imports all pages via barrel export:

```javascript
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Shop, Login, Signup, Profile, EditProfile } from "./pages"

function App() {
    return (
        <Router>
            <Routes>
                <Route
                    path="/"
                    element={<Shop />}
                />
                <Route
                    path="/login"
                    element={<Login />}
                />
                <Route
                    path="/signup"
                    element={<Signup />}
                />
                <Route
                    path="/profile"
                    element={<Profile />}
                />
                <Route
                    path="/edit-profile"
                    element={<EditProfile />}
                />
            </Routes>
        </Router>
    )
}
```

**EditProfile.jsx** uses UserProfile components:

```javascript
import {
    ProfileHeader,
    ProfileAvatar,
    FormInput,
    PasswordInput,
    TabNavigation,
    LoadingButton
} from "../components/UserProfile"

const EditProfile = () => {
    return (
        <div>
            <ProfileHeader title="Edit Profile" backLink="/profile" />
            <ProfileAvatar name={user.name} editable />
            <FormInput label="Email" ... />
            <PasswordInput label="Password" ... />
            <LoadingButton>Save</LoadingButton>
        </div>
    )
}
```

---

**Current Status:** ✅ **Fully Modular & Production Ready**

**Last Updated:** 2026-01-18

All modules are documented, tested, and ready for production use! 🚀
