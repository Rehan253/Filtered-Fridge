# Admin Component Module 👨‍💼

Reusable components for the admin panel interface.

## Components

### 1. UserTable
### 2. UserDetail
### 3. ProductTable
### 4. ProductForm

---

## 1. UserTable Component

Advanced, sortable, and filterable table for displaying user data.

### Features

-   **Sortable Columns** - Click headers to sort by any field
-   **Multi-Filter System** - Search, role filter, status filter
-   **Real-time Filtering** - Instant results as you type/filter
-   **User Avatars** - Initials in colored circles
-   **Status Badges** - Color-coded status indicators
-   **Role Badges** - Admin/Customer badges
-   **Quick Status Change** - Dropdown in table row
-   **Click to View** - Click row to open user details
-   **Responsive Design** - Horizontal scroll on mobile

### Usage

```jsx
import { UserTable } from "../../components/Admin"

function UserManagement() {
    const [users, setUsers] = useState(sampleUsers)

    const handleUserClick = (user) => {
        // Open user detail modal
    }

    const handleStatusChange = (userId, newStatus) => {
        // Update user status
    }

    return (
        <UserTable
            users={users}
            onUserClick={handleUserClick}
            onStatusChange={handleStatusChange}
        />
    )
}
```

### Props

| Prop            | Type     | Required | Description                          |
| --------------- | -------- | -------- | ------------------------------------ |
| `users`         | Array    | Yes      | Array of user objects                |
| `onUserClick`   | Function | No       | Callback when user row is clicked    |
| `onStatusChange`| Function | No       | Callback when status is changed      |

### Sortable Fields

- `name` - User name (alphabetical)
- `email` - Email address (alphabetical)
- `role` - User role (Admin/Customer)
- `status` - Account status
- `totalOrders` - Number of orders (numeric)
- `totalSpent` - Total amount spent (numeric)

### Filters

**Search:**
- Searches in: name, email, phone
- Case-insensitive
- Real-time filtering

**Role Filter:**
- All Roles
- Admin
- Customer

**Status Filter:**
- All Status
- Active
- Inactive
- Suspended

---

## 2. UserDetail Component

Modal dialog showing detailed user information and management options.

### Features

-   **Full User Profile** - Avatar, name, contact info
-   **Account Information** - ID, join date, last order
-   **Order Statistics** - Total orders, total spent, average order
-   **Delivery Address** - Complete address display
-   **Status Management** - Change user status with dropdown
-   **Action Buttons** - Edit, View Orders, Suspend
-   **Modal Overlay** - Click outside to close
-   **Responsive Design** - Adapts to screen size

### Usage

```jsx
import { UserDetail } from "../../components/Admin"

function UserManagement() {
    const [selectedUser, setSelectedUser] = useState(null)

    const handleStatusChange = (userId, newStatus) => {
        // Update user status
    }

    return (
        <>
            {/* User table */}
            {selectedUser && (
                <UserDetail
                    user={selectedUser}
                    onClose={() => setSelectedUser(null)}
                    onStatusChange={handleStatusChange}
                />
            )}
        </>
    )
}
```

### Props

| Prop            | Type     | Required | Description                          |
| --------------- | -------- | -------- | ------------------------------------ |
| `user`          | Object   | Yes      | User object to display               |
| `onClose`       | Function | Yes      | Callback to close modal              |
| `onStatusChange`| Function | No       | Callback when status is changed      |

### User Object Structure

```javascript
{
    id: number,
    name: string,
    email: string,
    phone: string,
    role: "customer" | "admin",
    status: "active" | "inactive" | "suspended",
    joinDate: string,
    totalOrders: number,
    totalSpent: number,
    lastOrderDate: string | null,
    address: string
}
```

### Actions

**Status Dropdown:**
- Active - User can place orders
- Inactive - User account is inactive
- Suspended - User account is suspended

**Action Buttons:**
- **Edit User** - Modify user information (premium primary)
- **View Orders** - See user's order history (premium secondary)
- **Suspend** - Suspend user account (red, only if not suspended)

---

## 3. ProductTable Component

Advanced, sortable, and filterable table for displaying product data.

### Features

-   **Sortable Columns** - Click headers to sort by name, category, price, stock
-   **Multi-Filter System** - Search by name/description/ingredients, category filter
-   **Real-time Filtering** - Instant results as you type/filter
-   **Product Icons** - Visual product representation
-   **Stock Indicators** - Color-coded stock levels (red/yellow/green)
-   **Discount Badges** - Shows discount percentage
-   **Ingredients Display** - Shows first 3 ingredients with "+X more" indicator
-   **Quick Actions** - Edit and delete buttons per row
-   **Responsive Design** - Horizontal scroll on mobile

### Usage

```jsx
import { ProductTable } from "../../components/Admin"

function ProductManagement() {
    const [products, setProducts] = useState(sampleProducts)

    const handleEdit = (product) => {
        // Open product edit form
    }

    const handleDelete = (productId) => {
        // Delete product
    }

    return (
        <ProductTable
            products={products}
            onEdit={handleEdit}
            onDelete={handleDelete}
        />
    )
}
```

### Props

| Prop         | Type     | Required | Description                          |
| ------------ | -------- | -------- | ------------------------------------ |
| `products`   | Array    | Yes      | Array of product objects              |
| `onEdit`     | Function | No       | Callback when edit button is clicked |
| `onDelete`   | Function | No       | Callback when delete button is clicked|

### Sortable Fields

- `name` - Product name (alphabetical)
- `category` - Product category (alphabetical)
- `price` - Product price (numeric)
- `stock` - Stock quantity (numeric)

### Filters

**Search:**
- Searches in: name, description, ingredients
- Case-insensitive
- Real-time filtering

**Category Filter:**
- All Categories
- Fruits, Vegetables, Dairy, Bakery, Meat, Seafood, Beverages, Snacks

---

## 4. ProductForm Component

Modal form for creating and editing products with comprehensive fields including ingredients.

### Features

-   **Create/Edit Mode** - Single form for both operations
-   **Comprehensive Fields** - Name, category, pricing, inventory, display options
-   **Ingredients Field** - Comma-separated ingredients input with array conversion
-   **Form Validation** - Real-time validation with error messages
-   **Price Management** - Current price, original price, discount percentage
-   **Inventory Tracking** - Stock quantity management
-   **Display Options** - Icon (emoji), image URL, rating, reviews
-   **Modal Overlay** - Click outside or cancel to close
-   **Responsive Design** - Scrollable form on smaller screens

### Usage

```jsx
import { ProductForm } from "../../components/Admin"

function ProductManagement() {
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingProduct, setEditingProduct] = useState(null)

    const handleSave = (productData) => {
        if (editingProduct) {
            // Update existing product
        } else {
            // Create new product
        }
        setIsFormOpen(false)
    }

    return (
        <>
            {isFormOpen && (
                <ProductForm
                    product={editingProduct}
                    onSave={handleSave}
                    onCancel={() => setIsFormOpen(false)}
                />
            )}
        </>
    )
}
```

### Props

| Prop         | Type     | Required | Description                          |
| ------------ | -------- | -------- | ------------------------------------ |
| `product`    | Object   | No       | Product object to edit (null for create) |
| `onSave`      | Function | Yes      | Callback when form is submitted      |
| `onCancel`    | Function | Yes      | Callback to close form               |

### Form Fields

**Basic Information:**
- Product Name* (required)
- Category* (required, dropdown)
- Description (textarea)
- Ingredients* (required, comma-separated, converted to array)

**Pricing:**
- Price* (required, number)
- Original Price (optional, for discount display)
- Discount % (optional, 0-100)
- Unit* (required, e.g., "lb", "pack", "gallon")

**Inventory & Display:**
- Stock Quantity* (required, number)
- Rating (0-5, optional)
- Review Count (optional)
- Icon (emoji, optional)
- Image URL (optional)

### Product Data Structure

The form returns product data in this format:

```javascript
{
    name: string,
    category: string,
    price: number,
    originalPrice?: number,
    discount?: number,
    unit: string,
    description?: string,
    ingredients: string[], // Array of ingredient strings
    stock: number,
    rating?: number,
    reviews?: number,
    icon?: string,
    image?: string
}
```

### Validation Rules

- **Name**: Required, non-empty
- **Category**: Required, must select from dropdown
- **Price**: Required, must be > 0
- **Original Price**: If provided, must be > current price
- **Discount**: If provided, must be 0-100
- **Unit**: Required, non-empty
- **Stock**: Required, must be >= 0
- **Ingredients**: Required, at least one ingredient (after comma splitting)

---

## Module Structure

```
components/Admin/
├── UserTable.jsx          # User listing table
├── UserDetail.jsx         # User detail modal
├── ProductTable.jsx       # Product listing table
├── ProductForm.jsx        # Product create/edit form
├── index.js               # Barrel export
└── README.md              # This file
```

---

## Theme Consistency

All components follow the **FreshExpress Premium Theme**:

**Colors:**
- Primary: `#FF6B35` (Orange) - Primary actions
- Secondary: `#004E89` (Navy) - Headers, customer badges
- Accent: `#D81159` (Ruby Red) - Admin badges, suspend actions
- Background: `#F4F7F6` (Off-white) - Table headers, cards
- Text: `#1A1A1A` (Dark) - Main text

**Status Colors:**
- Active: Green (`bg-green-100 text-green-800`)
- Inactive: Gray (`bg-gray-100 text-gray-800`)
- Suspended: Red (`bg-red-100 text-red-800`)

**Role Colors:**
- Admin: Ruby Red (`bg-premium-accent text-white`)
- Customer: Navy (`bg-premium-secondary text-white`)

---

## Accessibility

-   ✅ Semantic HTML (`<table>`, `<thead>`, `<tbody>`)
-   ✅ Keyboard navigation support
-   ✅ ARIA labels on interactive elements
-   ✅ Focus states on all interactive elements
-   ✅ Screen reader friendly table structure

---

## Performance Considerations

-   **Filtering** - Client-side filtering (consider debouncing for large datasets)
-   **Sorting** - Client-side sorting (consider server-side for 1000+ users)
-   **Virtualization** - Consider react-window for very large user lists
-   **Memoization** - UserTable can be wrapped with React.memo

---

## Related Documentation

-   **User Management Page:** `/pages/Admin/README.md`
-   **User Data:** `/data/users.js`
-   **Main README:** `/README.md`

---

**Module:** Admin  
**Components:** 4 (UserTable, UserDetail, ProductTable, ProductForm)  
**Status:** ✅ Complete and Production Ready  
**Last Updated:** 2026-01-18
