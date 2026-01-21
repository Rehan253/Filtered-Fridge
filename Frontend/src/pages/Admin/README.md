# Admin Module 👨‍💼

Admin panel pages for managing the FreshExpress grocery store platform.

## Pages

### UserManagement (`/admin/users`)

### ProductManagement (`/admin/products`)

Comprehensive user management interface with filtering, sorting, and user details.

**Features:**

-   **User Statistics Dashboard** - Overview cards showing total, active, inactive, suspended users, customers, and admins
-   **Advanced User Table** - Sortable, filterable table with all user information
-   **Search Functionality** - Search by name, email, or phone number
-   **Role Filtering** - Filter by Admin or Customer
-   **Status Filtering** - Filter by Active, Inactive, or Suspended
-   **Sortable Columns** - Click headers to sort by name, email, role, status, orders, or total spent
-   **Quick Status Change** - Change user status directly from table
-   **User Detail Modal** - Click any user to view detailed information
-   **User Actions** - Edit user, view orders, suspend account

**File:** `Admin/UserManagement.jsx`

**Route:** `/admin/users`

**Components Used:**

-   `Navbar` - Main navigation
-   `UserTable` - User listing table
-   `UserDetail` - User detail modal

**Data:**

-   `sampleUsers` - 8 sample users from `/data/users.js`

---

### ProductManagement (`/admin/products`)

Comprehensive product management interface with create, edit, delete, and inventory tracking.

**Features:**

-   **Product Statistics Dashboard** - Overview cards showing total products, low stock items, on-sale items, inventory value, and category counts
-   **Advanced Product Table** - Sortable, filterable table with all product information
-   **Search Functionality** - Search by name, description, or ingredients
-   **Category Filtering** - Filter by product category
-   **Sortable Columns** - Click headers to sort by name, category, price, or stock
-   **Ingredients Display** - Shows first 3 ingredients with "+X more" indicator
-   **Stock Indicators** - Color-coded stock levels (red < 10, yellow < 50, green >= 50)
-   **Create Product** - Full-featured product creation form
-   **Edit Product** - Modify existing products
-   **Delete Product** - Remove products with confirmation

**File:** `Admin/ProductManagement.jsx`

**Route:** `/admin/products`

**Components Used:**

-   `Navbar` - Main navigation
-   `ProductTable` - Product listing table
-   `ProductForm` - Product create/edit modal form

**Data:**

-   `sampleProducts` - 26 sample products from `/data/products.js`

---

## Product Form Features

### Create/Edit Product

**Basic Information:**

-   Product Name\* (required)
-   Category\* (required, dropdown: Fruits, Vegetables, Dairy, Bakery, Meat, Seafood, Beverages, Snacks)
-   Description (optional, textarea)
-   Ingredients\* (required, comma-separated, converted to array)

**Pricing:**

-   Price\* (required, number > 0)
-   Original Price (optional, for discount display)
-   Discount % (optional, 0-100)
-   Unit\* (required, e.g., "lb", "pack", "gallon")

**Inventory & Display:**

-   Stock Quantity\* (required, number >= 0)
-   Rating (0-5, optional)
-   Review Count (optional)
-   Icon (emoji, optional)
-   Image URL (optional)

### Form Validation

-   Real-time validation with error messages
-   Required field indicators (\*)
-   Price validation (must be > 0)
-   Original price validation (must be > current price if provided)
-   Discount validation (0-100 range)
-   Stock validation (must be >= 0)

---

## Product Table Features

### Sorting

Click any column header to sort:

-   Name (alphabetical)
-   Email (alphabetical)
-   Role (Admin/Customer)
-   Status (Active/Inactive/Suspended)
-   Orders (numeric)
-   Total Spent (numeric)

### Filtering

**Search Bar:**

-   Search by user name
-   Search by email address
-   Search by phone number

**Role Filter:**

-   All Roles
-   Admin only
-   Customer only

**Status Filter:**

-   All Status
-   Active only
-   Inactive only
-   Suspended only

### Quick Actions

-   **View Details** - Click user row or eye icon
-   **Change Status** - Dropdown in Actions column
-   **Status Updates** - Real-time status changes

---

## User Detail Modal

**Information Displayed:**

-   User profile with avatar (initials)
-   Role and status badges
-   Contact information (email, phone)
-   Account information (ID, join date, last order)
-   Order statistics (total orders, total spent, average order)
-   Delivery address
-   Status management dropdown
-   Action buttons (Edit, View Orders, Suspend)

**Actions:**

-   **Edit User** - Modify user information
-   **View Orders** - See user's order history
-   **Suspend** - Suspend user account (if not already suspended)
-   **Change Status** - Update user status (Active/Inactive/Suspended)

---

## Statistics Dashboard

### UserManagement Statistics

Six overview cards showing:

1. **Total Users** - All registered users
2. **Active** - Currently active users (green)
3. **Inactive** - Inactive user accounts (gray)
4. **Suspended** - Suspended accounts (red)
5. **Customers** - Total customer accounts (navy)
6. **Admins** - Total admin accounts (ruby red)

### ProductManagement Statistics

Six overview cards showing:

1. **Total Products** - All products in inventory
2. **Low Stock** - Products with stock < 10 (red)
3. **On Sale** - Products with discount (accent color)
4. **Inventory Value** - Total value of inventory in thousands
5. **Fruits** - Count of fruit products
6. **Vegetables** - Count of vegetable products

---

## Usage

```jsx
// Import from Admin module
import { UserManagement, ProductManagement } from "./pages/Admin"

// Or from main pages export
import { UserManagement, ProductManagement } from "./pages"

// Use in routes
<Route path="/admin/users" element={<UserManagement />} />
<Route path="/admin/products" element={<ProductManagement />} />
```

---

## Data Structure

### Product Object

```javascript
{
    id: number,                    // Unique product ID
    name: string,                  // Product name
    category: string,              // Product category
    price: number,                 // Current price
    originalPrice?: number,        // Original price (for discounts)
    discount?: number,             // Discount percentage
    unit: string,                  // Unit of measurement (lb, pack, etc.)
    description?: string,          // Product description
    ingredients: string[],         // Array of ingredient strings
    stock: number,                 // Stock quantity
    rating?: number,               // Rating (0-5)
    reviews?: number,             // Review count
    icon?: string,                // Emoji icon
    image?: string                // Image URL
}
```

### User Object

```javascript
{
    id: number,              // Unique user ID
    name: string,            // Full name
    email: string,           // Email address
    phone: string,           // Phone number
    role: "customer" | "admin", // User role
    status: "active" | "inactive" | "suspended", // Account status
    joinDate: string,        // ISO date string
    totalOrders: number,     // Total number of orders
    totalSpent: number,      // Total amount spent
    lastOrderDate: string,   // ISO date string or null
    address: string          // Delivery address
}
```

---

## State Management

**UserManagement State:**

```javascript
const [users, setUsers] = useState(sampleUsers)
const [selectedUser, setSelectedUser] = useState(null)
```

**UserTable State:**

```javascript
const [sortField, setSortField] = useState("name")
const [sortDirection, setSortDirection] = useState("asc")
const [filterRole, setFilterRole] = useState("all")
const [filterStatus, setFilterStatus] = useState("all")
const [searchQuery, setSearchQuery] = useState("")
```

**ProductManagement State:**

```javascript
const [products, setProducts] = useState(sampleProducts)
const [isFormOpen, setIsFormOpen] = useState(false)
const [editingProduct, setEditingProduct] = useState(null)
```

**ProductTable State:**

```javascript
const [sortField, setSortField] = useState("name")
const [sortDirection, setSortDirection] = useState("asc")
const [filterCategory, setFilterCategory] = useState("all")
const [searchQuery, setSearchQuery] = useState("")
```

---

## Integration Points

### Status Change Handler

```javascript
const handleStatusChange = (userId, newStatus) => {
    setUsers((prevUsers) => prevUsers.map((user) => (user.id === userId ? { ...user, status: newStatus } : user)))
    // Update selected user if modal is open
    if (selectedUser && selectedUser.id === userId) {
        setSelectedUser({ ...selectedUser, status: newStatus })
    }
}
```

### User Click Handler

```javascript
const handleUserClick = (user) => {
    setSelectedUser(user) // Opens detail modal
}
```

---

## Theme

Uses the **FreshExpress Premium Theme**:

-   Orange (#FF6B35) - Primary actions, statistics
-   Navy (#004E89) - Headers, customer badges
-   Ruby Red (#D81159) - Admin badges, suspend actions
-   Off-white (#F4F7F6) - Background, table headers
-   Green - Active status
-   Gray - Inactive status
-   Red - Suspended status

---

## Responsive Behavior

**Desktop (lg+):**

-   Full table with all columns visible
-   Statistics in 6-column grid
-   Side-by-side filters

**Tablet (md):**

-   Statistics in 3-column grid
-   Stacked filters
-   Scrollable table

**Mobile (< md):**

-   Statistics in 2-column grid
-   Single column filters
-   Horizontal scroll for table

---

## Related Components

**Component Module:**

-   `/components/Admin/UserTable.jsx` - User listing table
-   `/components/Admin/UserDetail.jsx` - User detail modal
-   `/components/Admin/ProductTable.jsx` - Product listing table
-   `/components/Admin/ProductForm.jsx` - Product create/edit form

**Data:**

-   `/data/users.js` - User data and utility functions
-   `/data/products.js` - Product data with ingredients

---

## Future Enhancements

### UserManagement

1. **Bulk Actions** - Select multiple users for batch operations
2. **Export Users** - Export user list to CSV/Excel
3. **User Creation** - Add new users from admin panel
4. **Advanced Filters** - Filter by date range, order count, etc.
5. **User Activity Log** - View user activity history
6. **Email Notifications** - Send emails to users
7. **User Permissions** - Manage user permissions and roles
8. **Password Reset** - Reset user passwords from admin

### ProductManagement

1. **Bulk Actions** - Select multiple products for batch operations
2. **Export Products** - Export product list to CSV/Excel
3. **Bulk Stock Update** - Update stock for multiple products
4. **Product Images** - Image upload and management
5. **Product Variants** - Manage product variants (size, color, etc.)
6. **Inventory Alerts** - Low stock notifications
7. **Product Analytics** - Sales, views, popularity metrics
8. **Category Management** - Create and manage product categories

---

**Module:** Admin  
**Pages:** 2 (UserManagement, ProductManagement) - Expandable  
**Sample Data:** 8 users, 26 products  
**Status:** ✅ Complete and Production Ready
