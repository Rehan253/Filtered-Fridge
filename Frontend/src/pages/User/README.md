# User Module 👤

User profile, settings, and account management pages.

## Pages

### Profile (`/profile`)

User profile dashboard with order history and account information.

**Features:**

-   User information sidebar
    -   Avatar with initials
    -   Name and membership level
    -   Contact information
    -   Member stats (orders, points)
    -   Edit Profile and Logout buttons
-   Complete order history
    -   Expandable order cards
    -   Status tracking (Delivered, Shipped, Processing, Cancelled)
    -   Order details with items, delivery info
    -   Context-aware actions (Reorder, Track, Cancel, Review)
-   Tab navigation
    -   Orders
    -   Addresses (placeholder)
    -   Payment Methods (placeholder)
-   6 sample orders included

**File:** `User/Profile.jsx`

---

### EditProfile (`/edit-profile`)

Edit user profile information and change password.

**Features:**

-   Two-section tab interface
    -   Profile Information
    -   Change Password
-   Profile section:
    -   Avatar with photo upload option
    -   Personal info fields (name, email, phone)
    -   Address fields (street, city, state, zip)
    -   Form validation
-   Password section:
    -   Current password field
    -   New password with strength validation
    -   Confirm password matching
    -   Password visibility toggles
-   Save/Cancel actions with loading states

**File:** `User/EditProfile.jsx`

**Uses Components:** `UserProfile` module components

-   ProfileHeader
-   ProfileAvatar
-   FormInput
-   PasswordInput
-   TabNavigation
-   LoadingButton

---

## Usage

```jsx
// Import from User module
import { Profile, EditProfile } from "./pages/User"

// Or from main pages export
import { Profile, EditProfile } from "./pages"

// Use in routes
<Route path="/profile" element={<Profile />} />
<Route path="/edit-profile" element={<EditProfile />} />
```

## Navigation Flow

```
Profile Page
    ↓
[Edit Profile] button
    ↓
Edit Profile Page
    ↓
[Save Changes] / [Cancel]
    ↓
Back to Profile Page
```

## Data Structure

### User Data

```javascript
{
    fullName: "John Doe",
    email: "john@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Oak Street, Apt 4B",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    joinDate: "2025-12-15",
    totalOrders: 6,
    membershipLevel: "Gold"
}
```

### Order Data

```javascript
{
    id: "ORD-2026-001",
    date: "2026-01-15",
    status: "delivered", // or "shipped", "processing", "cancelled"
    total: 87.45,
    items: [...],
    deliveryAddress: "...",
    deliveryDate: "2026-01-16",
    paymentMethod: "Credit Card ending in 4242"
}
```

## Theme Consistency

Both pages use the **FreshExpress Premium Theme**:

-   Orange (#FF6B35) - Buttons, prices, active states
-   Navy (#004E89) - Headers, text, back links
-   Ruby Red (#D81159) - Error messages
-   Off-white (#F4F7F6) - Page background
-   12px card radius, 30px button radius

## Order Status Colors

-   ✓ **Delivered** - Green (#10B981)
-   🚚 **Shipped** - Blue (#3B82F6)
-   ⏳ **Processing** - Yellow (#F59E0B)
-   ✕ **Cancelled** - Red (#EF4444)

## Integration Points

### Fetch User Data

```jsx
useEffect(() => {
    const fetchUser = async () => {
        const response = await fetch("/api/user/profile")
        const data = await response.json()
        setUser(data)
    }
    fetchUser()
}, [])
```

### Fetch Orders

```jsx
useEffect(() => {
    const fetchOrders = async () => {
        const response = await fetch("/api/user/orders")
        const data = await response.json()
        setOrders(data.orders)
    }
    fetchOrders()
}, [])
```

### Update Profile

```jsx
const handleProfileUpdate = async (formData) => {
    await fetch("/api/user/profile", {
        method: "PUT",
        body: JSON.stringify(formData)
    })
    navigate("/profile")
}
```

## Related Components

Uses the **UserProfile** component module:

-   `/components/UserProfile/` - Reusable form and UI components

## Related Documentation

-   **Profile Details:** `/Frontend/src/pages/PROFILE_README.md`
-   **UserProfile Components:** `/Frontend/src/components/UserProfile/README.md`

---

**Module:** User  
**Pages:** 2 (Profile, EditProfile)  
**Sample Data:** 6 orders, 1 user  
**Status:** ✅ Complete
