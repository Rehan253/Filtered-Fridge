# Auth Module 🔐

Authentication pages for user login and registration.

## Pages

### Login (`/login`)

User authentication page with email/password login.

**Features:**

-   Email and password fields with validation
-   Password visibility toggle
-   "Remember me" checkbox
-   Forgot password link
-   Social login options (Google, Facebook)
-   Client-side validation
-   Loading states
-   Link to signup page

**File:** `Auth/Login.jsx`

---

### Signup (`/signup`)

User registration page with comprehensive form.

**Features:**

-   Full registration form (name, email, phone, password)
-   Password strength validation
-   Confirm password matching
-   Phone number validation
-   Terms & conditions checkbox
-   Social signup options
-   Membership benefits display
-   Link to login page

**File:** `Auth/Signup.jsx`

---

## Usage

```jsx
// Import from Auth module
import { Login, Signup } from "./pages/Auth"

// Or from main pages export
import { Login, Signup } from "./pages"

// Use in routes
<Route path="/login" element={<Login />} />
<Route path="/signup" element={<Signup />} />
```

## Navigation Flow

```
Login → Signup
  ↓        ↓
  Need account? / Already have account?
  ↓        ↓
Signup ← Login
```

## Theme

Both pages follow the **FreshExpress Premium Theme**:

-   Navy (#004E89) branding
-   Orange (#FF6B35) buttons and CTAs
-   Ruby Red (#D81159) error messages
-   Off-white (#F4F7F6) background
-   Smooth animations and transitions

## Form Validation

**Login:**

-   Email: Valid format required
-   Password: Min 6 characters

**Signup:**

-   Name: Min 2 characters
-   Email: Valid format
-   Phone: Valid phone format
-   Password: 8+ chars, uppercase, lowercase, number
-   Confirm Password: Must match
-   Terms: Must be accepted

## Integration Ready

Both pages have placeholder submit handlers ready for API integration:

```jsx
const handleSubmit = async (e) => {
    e.preventDefault()
    if (validateForm()) {
        setIsLoading(true)
        // Add your API endpoint here
        const response = await fetch('/api/auth/login', {...})
        setIsLoading(false)
    }
}
```

## Related Documentation

-   **Main Auth Guide:** `/Frontend/AUTH_GUIDE.md`
-   **Pages README:** `/Frontend/src/pages/README.md`

---

**Module:** Auth  
**Pages:** 2 (Login, Signup)  
**Status:** ✅ Complete
