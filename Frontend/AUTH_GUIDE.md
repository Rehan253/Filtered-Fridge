# Authentication Guide 🔐

Complete guide to the FreshExpress authentication system.

## Quick Start

```bash
# Start the development server
npm run dev

# Navigate to pages
http://localhost:5173/          # Home page
http://localhost:5173/login     # Login page
http://localhost:5173/signup    # Signup page
```

## User Flow

### New User Registration

```
1. User visits /signup
   ↓
2. Fills registration form:
   - Full Name
   - Email
   - Phone Number
   - Password (8+ chars, uppercase, lowercase, number)
   - Confirm Password
   - Agree to Terms ✓
   ↓
3. Clicks "Create Account"
   ↓
4. Form validates client-side
   ↓
5. If valid → API call (to be implemented)
   If invalid → Error messages shown
   ↓
6. On success → Redirect to home/dashboard
```

### Existing User Login

```
1. User visits /login
   ↓
2. Enters credentials:
   - Email
   - Password
   - (Optional) Remember Me
   ↓
3. Clicks "Sign In"
   ↓
4. Form validates client-side
   ↓
5. If valid → API call (to be implemented)
   If invalid → Error messages shown
   ↓
6. On success → Redirect to home/dashboard
```

### Navigation Between Pages

-   **From Login → Signup**: Click "Sign Up" link at bottom
-   **From Signup → Login**: Click "Sign In" link at bottom
-   **From Auth pages → Home**: Click "FreshExpress" brand name

## Form Validation Rules

### Login Page

| Field    | Validation Rules               | Error Message                    |
| -------- | ------------------------------ | -------------------------------- |
| Email    | Required, valid email format   | "Please enter a valid email"     |
| Password | Required, minimum 6 characters | "Password must be at least 6..." |

### Signup Page

| Field            | Validation Rules                       | Error Message                        |
| ---------------- | -------------------------------------- | ------------------------------------ |
| Full Name        | Required, minimum 2 characters         | "Name must be at least 2 characters" |
| Email            | Required, valid email format           | "Please enter a valid email"         |
| Phone            | Required, valid phone format           | "Please enter a valid phone number"  |
| Password         | 8+ chars, uppercase, lowercase, number | "Password must contain uppercase..." |
| Confirm Password | Required, must match password          | "Passwords do not match"             |
| Terms Checkbox   | Required                               | "You must agree to the terms..."     |

## UI Components & Styling

### Input Fields

**Normal State:**

```css
- 2px gray border
- Rounded corners (8px)
- Focus: Orange border (#FF6B35)
```

**Error State:**

```css
- 2px Ruby Red border (#D81159)
- Error message below in Ruby Red
- Real-time: error clears as user types
```

### Buttons

**Primary Button (Sign In / Create Account):**

-   Background: Orange (#FF6B35)
-   Border radius: 30px (pill shape)
-   Hover: Scale up 5%, darker
-   Loading: Spinner animation, disabled state

**Social Buttons:**

-   White background, gray border
-   Icons: Google (colorful), Facebook (blue)
-   Hover: Navy border

### Password Toggle

Click eye icon to show/hide password:

-   👁️ Eye with slash = Password hidden
-   👁️ Open eye = Password visible

## Theme Consistency

All authentication pages match the FreshExpress premium theme:

### Colors Used

-   **Brand Navy** (#004E89): FreshExpress heading, labels
-   **Primary Orange** (#FF6B35): Buttons, links, focus states
-   **Ruby Red** (#D81159): Error messages, validation
-   **Off-white** (#F4F7F6): Page background
-   **Dark Text** (#1A1A1A): Body text, input text

### Typography

-   **Brand**: Poppins Bold (FreshExpress heading)
-   **Labels**: Semi-bold
-   **Body**: Regular Inter/Poppins

### Spacing

-   Form fields: 20px gap
-   Card padding: 32px
-   Mobile padding: 16px

## Features by Page

### Login Page Features

✅ **Implemented:**

-   Email/password login
-   Password visibility toggle
-   Remember me checkbox
-   Forgot password link
-   Social login UI (Google, Facebook)
-   Form validation
-   Loading states
-   Error handling
-   Link to signup

🔲 **To Implement:**

-   Backend API integration
-   JWT token handling
-   Remember me functionality
-   Forgot password flow
-   OAuth implementation

### Signup Page Features

✅ **Implemented:**

-   Full registration form
-   Password strength validation
-   Confirm password matching
-   Phone number field
-   Terms & conditions checkbox
-   Social signup UI
-   Form validation
-   Loading states
-   Benefits display
-   Link to login

🔲 **To Implement:**

-   Backend API integration
-   Email verification
-   Phone verification
-   Terms & conditions modal
-   Privacy policy modal
-   OAuth implementation

## Integration Examples

### Backend API Integration

Replace the placeholder submit handlers:

```jsx
// Login.jsx
const handleSubmit = async (e) => {
    e.preventDefault()
    if (validateForm()) {
        setIsLoading(true)
        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            })
            const data = await response.json()

            if (response.ok) {
                // Store token
                localStorage.setItem("token", data.token)
                // Redirect to home
                navigate("/")
            } else {
                setErrors({ submit: data.message })
            }
        } catch (error) {
            setErrors({ submit: "Login failed. Please try again." })
        }
        setIsLoading(false)
    }
}
```

```jsx
// Signup.jsx
const handleSubmit = async (e) => {
    e.preventDefault()
    if (validateForm()) {
        setIsLoading(true)
        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            })
            const data = await response.json()

            if (response.ok) {
                // Redirect to login or verify email
                navigate("/login", { state: { message: "Account created!" } })
            } else {
                setErrors({ submit: data.message })
            }
        } catch (error) {
            setErrors({ submit: "Signup failed. Please try again." })
        }
        setIsLoading(false)
    }
}
```

### Adding Global Auth State

Using Context API:

```jsx
// src/context/AuthContext.jsx
import { createContext, useContext, useState } from "react"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    const login = (userData) => {
        setUser(userData)
        setIsAuthenticated(true)
    }

    const logout = () => {
        setUser(null)
        setIsAuthenticated(false)
        localStorage.removeItem("token")
    }

    return <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
```

### Protected Routes

```jsx
// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth()

    if (!isAuthenticated) {
        return (
            <Navigate
                to="/login"
                replace
            />
        )
    }

    return children
}

export default ProtectedRoute
```

## Accessibility

Both pages include:

-   ✅ Proper `label` associations with inputs
-   ✅ ARIA labels on icon buttons
-   ✅ Keyboard navigation support
-   ✅ Focus states visible
-   ✅ Error messages announced
-   ✅ Form validation feedback

## Testing

### Manual Testing Checklist

**Login Page:**

-   [ ] Empty email shows error
-   [ ] Invalid email format shows error
-   [ ] Empty password shows error
-   [ ] Short password shows error
-   [ ] Password toggle works
-   [ ] Remember me checkbox works
-   [ ] Social buttons are clickable
-   [ ] Link to signup navigates correctly
-   [ ] Loading state displays during submission
-   [ ] Responsive on mobile

**Signup Page:**

-   [ ] All required fields validated
-   [ ] Name minimum length enforced
-   [ ] Email format validated
-   [ ] Phone format validated
-   [ ] Password strength enforced
-   [ ] Password mismatch detected
-   [ ] Terms checkbox required
-   [ ] Password toggles work
-   [ ] Social buttons are clickable
-   [ ] Link to login navigates correctly
-   [ ] Benefits section displays
-   [ ] Loading state displays
-   [ ] Responsive on mobile

## Troubleshooting

### Common Issues

**"Cannot read property 'useState' of null"**

-   Make sure React is properly imported
-   Check that component is within Router

**Routes not working**

-   Verify BrowserRouter wraps the app
-   Check route paths match navigation links

**Styles not applying**

-   Ensure Tailwind is properly configured
-   Check that index.css is imported in main.jsx
-   Verify custom CSS variables are defined

**Form not submitting**

-   Check browser console for errors
-   Verify validation logic
-   Ensure preventDefault() is called

## Next Steps

1. **Backend Integration**: Connect to your authentication API
2. **State Management**: Add global auth state (Context/Zustand)
3. **Protected Routes**: Add route guards for authenticated pages
4. **Email Verification**: Implement verification flow
5. **Password Reset**: Build forgot password feature
6. **OAuth**: Complete social login implementation
7. **Tokens**: Add JWT token management
8. **Persistence**: Handle remember me and auto-login

---

**Ready to use!** 🚀 Just add your backend API endpoints.
