# Authentication Pages

Premium-themed authentication pages for FreshExpress grocery store.

## Pages

### 🔐 Login Page (`/login`)

**Features:**

-   Email and password login
-   Password visibility toggle
-   "Remember me" checkbox
-   Forgot password link
-   Social login options (Google, Facebook)
-   Client-side form validation
-   Loading states
-   Link to signup page

**Theme Consistency:**

-   FreshExpress branding with Poppins font
-   Premium color palette (Navy, Orange, Ruby Red)
-   12px rounded cards
-   30px rounded buttons
-   Off-white background
-   Smooth transitions and hover effects

**Validation:**

-   Email format validation
-   Password minimum length (6 characters)
-   Real-time error display in Ruby Red

**Navigation:**

-   "Don't have an account? Sign Up" link routes to `/signup`

---

### 📝 Signup Page (`/signup`)

**Features:**

-   Full registration form:
    -   Full Name
    -   Email Address
    -   Phone Number
    -   Password (with strength requirements)
    -   Confirm Password
-   Password visibility toggles for both password fields
-   Terms and conditions checkbox (required)
-   Social signup options (Google, Facebook)
-   Comprehensive form validation
-   Loading states
-   Link to login page
-   Benefits section highlighting membership perks

**Theme Consistency:**

-   Same premium design as login page
-   Consistent spacing and typography
-   Matching color scheme
-   Smooth animations

**Validation:**

-   Full name: minimum 2 characters
-   Email: valid email format
-   Phone: valid phone number format
-   Password requirements:
    -   Minimum 8 characters
    -   Must contain uppercase letter
    -   Must contain lowercase letter
    -   Must contain number
-   Confirm password: must match password
-   Terms agreement: required

**Benefits Displayed:**

-   Free delivery on orders over $50
-   Exclusive deals and discounts
-   Real-time order tracking
-   24/7 customer support

**Navigation:**

-   "Already have an account? Sign In" link routes to `/login`

---

### 🏠 Home Page (`/`)

Main landing page with product catalog, category sidebar, and full e-commerce features.

## Routing Structure

```jsx
<Router>
    <Routes>
        <Route
            path="/"
            element={<Home />}
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
            path="*"
            element={
                <Navigate
                    to="/"
                    replace
                />
            }
        />
    </Routes>
</Router>
```

## Design System

### Colors

-   **Primary Orange**: `#FF6B35` - Buttons, CTAs
-   **Secondary Navy**: `#004E89` - Brand name, headings
-   **Ruby Red**: `#D81159` - Error messages, validation
-   **Off-white**: `#F4F7F6` - Background
-   **Dark Text**: `#1A1A1A` - Body text

### Typography

-   **Brand**: Poppins Bold
-   **Body**: Inter/Poppins Regular

### Components

-   **Input Fields**:

    -   2px border
    -   Rounded corners (8px)
    -   Focus state with orange border
    -   Error state with ruby red border
    -   Smooth transitions

-   **Buttons**:

    -   30px border radius (pill shape)
    -   Orange background
    -   Scale up on hover (1.05x)
    -   Shadow depth increase
    -   Disabled states

-   **Cards**:
    -   12px border radius
    -   White background
    -   Shadow-lg
    -   Centered layout

## Form State Management

Each form uses React's `useState` for:

-   Form data
-   Password visibility toggles
-   Error messages
-   Loading states

## Validation Strategy

1. **Real-time Validation**: Errors clear as user types
2. **Submit Validation**: Full validation on form submit
3. **Visual Feedback**:
    - Red borders for errors
    - Error messages below fields
    - Loading spinners during submission

## Usage Example

### Basic Usage

```jsx
import { Login, Signup, Home } from "./pages"

// Component automatically includes all styling and validation
<Login />
<Signup />
```

### With Navigation

```jsx
import { Link } from "react-router-dom"

// Navigate to login
<Link to="/login">Sign In</Link>

// Navigate to signup
<Link to="/signup">Create Account</Link>
```

## Integration Points

### API Integration Ready

Both forms have placeholder submit handlers:

```jsx
const handleSubmit = async (e) => {
    e.preventDefault()
    if (validateForm()) {
        setIsLoading(true)
        // Add your API call here
        // Example:
        // const response = await fetch('/api/login', {
        //     method: 'POST',
        //     body: JSON.stringify(formData)
        // })
        setIsLoading(false)
    }
}
```

### State Management

For production, consider adding:

-   Global auth state (Context API or Zustand)
-   Token management
-   Protected routes
-   Redirect after login

## Responsive Design

Both pages are fully responsive:

-   **Mobile**: Single column, stacked layout
-   **Tablet**: Optimized spacing
-   **Desktop**: Centered card with max-width

## Accessibility

-   Proper label associations
-   ARIA attributes on buttons
-   Keyboard navigation support
-   Focus states
-   Screen reader friendly

## Future Enhancements

-   [ ] Email verification flow
-   [ ] Password reset functionality
-   [ ] Two-factor authentication
-   [ ] OAuth integration (actual implementation)
-   [ ] Remember me functionality
-   [ ] Session management
-   [ ] Error handling for API failures
-   [ ] Success notifications/toasts

## Testing Checklist

-   [x] Form validation works correctly
-   [x] Password toggle functions properly
-   [x] Navigation links work
-   [x] Loading states display
-   [x] Responsive on all screen sizes
-   [x] No linting errors
-   [x] Premium theme consistency
-   [x] Social buttons render correctly
-   [x] Terms checkbox validation

---

**Status**: ✅ Complete - Ready for Backend Integration
