# UserProfile Components Module

Reusable UI components for user profile and settings pages, following the FreshExpress premium theme.

## Components Overview

### 1. ProfileHeader

Page header with optional back navigation link.

**Props:**
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `title` | string | Yes | Page title |
| `subtitle` | string | No | Subtitle text |
| `backLink` | string | No | URL for back navigation (shows arrow if provided) |

**Usage:**

```jsx
import { ProfileHeader } from "../components/UserProfile"

;<ProfileHeader
    title="Edit Profile"
    subtitle="Update your personal information"
    backLink="/profile"
/>
```

---

### 2. ProfileAvatar

User avatar with initials, optionally editable with photo upload button.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | string | Required | User's full name (used for initials) |
| `size` | string | "large" | Size: "small", "medium", "large" |
| `editable` | boolean | false | Show photo change button |
| `onChangePhoto` | function | - | Callback when change photo is clicked |

**Usage:**

```jsx
import { ProfileAvatar } from "../components/UserProfile"

;<ProfileAvatar
    name="John Doe"
    size="large"
    editable
    onChangePhoto={() => console.log("Change photo")}
/>
```

**Sizes:**

-   `small`: 48px (w-12 h-12)
-   `medium`: 64px (w-16 h-16)
-   `large`: 96px (w-24 h-24)

---

### 3. FormInput

Standard text input field with label, validation, and error display.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | string | Required | Input label text |
| `id` | string | Required | Input ID (for label association) |
| `name` | string | Required | Input name attribute |
| `type` | string | "text" | HTML input type |
| `value` | string | Required | Input value |
| `onChange` | function | Required | Change handler |
| `error` | string | - | Error message to display |
| `placeholder` | string | - | Placeholder text |
| `required` | boolean | false | Show required asterisk |

**Usage:**

```jsx
import { FormInput } from "../components/UserProfile"

;<FormInput
    label="Full Name"
    id="fullName"
    name="fullName"
    value={formData.fullName}
    onChange={handleChange}
    error={errors.fullName}
    placeholder="John Doe"
    required
/>
```

**Features:**

-   Orange border on focus
-   Red border on error
-   Error message in Ruby Red
-   Required asterisk indicator

---

### 4. PasswordInput

Password input with visibility toggle and optional strength hints.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | string | Required | Input label text |
| `id` | string | Required | Input ID |
| `name` | string | Required | Input name |
| `value` | string | Required | Input value |
| `onChange` | function | Required | Change handler |
| `error` | string | - | Error message |
| `placeholder` | string | - | Placeholder text |
| `showStrength` | boolean | false | Show password strength hint |

**Usage:**

```jsx
import { PasswordInput } from "../components/UserProfile"

;<PasswordInput
    label="New Password"
    id="newPassword"
    name="newPassword"
    value={passwordData.newPassword}
    onChange={handlePasswordChange}
    error={errors.newPassword}
    placeholder="Enter new password"
    showStrength
/>
```

**Features:**

-   Eye icon toggle for show/hide
-   Password strength hint (if enabled)
-   Validation error display
-   Smooth transitions

---

### 5. TabNavigation

Horizontal tab navigation with active state indicator.

**Props:**
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `tabs` | array | Yes | Array of tab objects `{id, label}` |
| `activeTab` | string | Yes | Currently active tab ID |
| `onChange` | function | Yes | Callback with selected tab ID |

**Usage:**

```jsx
import { TabNavigation } from "../components/UserProfile"

const tabs = [
    { id: 'profile', label: 'Profile Information' },
    { id: 'password', label: 'Change Password' }
]

<TabNavigation
    tabs={tabs}
    activeTab={activeSection}
    onChange={setActiveSection}
/>
```

**Features:**

-   Active tab: Orange text + bottom border
-   Hover effect on inactive tabs
-   Responsive layout

---

### 6. LoadingButton

Button with loading state and multiple style variants.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `loading` | boolean | Required | Show loading spinner |
| `children` | node | Required | Button text/content |
| `onClick` | function | - | Click handler |
| `type` | string | "submit" | Button type |
| `variant` | string | "primary" | Style: "primary", "secondary", "danger" |
| `disabled` | boolean | false | Disable button |
| `className` | string | "" | Additional CSS classes |

**Usage:**

```jsx
import { LoadingButton } from "../components/UserProfile"

<LoadingButton loading={isLoading} variant="primary">
    Save Changes
</LoadingButton>

<LoadingButton loading={isLoading} variant="secondary" type="button">
    Cancel
</LoadingButton>
```

**Variants:**

-   `primary`: Orange background, white text, hover scale
-   `secondary`: White background, gray border
-   `danger`: Ruby Red background, white text

**Loading State:**

-   Shows spinner animation
-   Displays "Loading..." text
-   Button is disabled

---

## Complete Example

```jsx
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
    ProfileHeader,
    ProfileAvatar,
    FormInput,
    PasswordInput,
    TabNavigation,
    LoadingButton
} from "../components/UserProfile"

const EditProfile = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        fullName: "John Doe",
        email: "john@example.com"
    })
    const [errors, setErrors] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [activeTab, setActiveTab] = useState("profile")

    const tabs = [
        { id: "profile", label: "Profile" },
        { id: "settings", label: "Settings" }
    ]

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        // API call...
        setIsLoading(false)
    }

    return (
        <div>
            <ProfileHeader
                title="Edit Profile"
                subtitle="Update your info"
                backLink="/profile"
            />

            <div className="bg-white rounded-[--radius-card] shadow-lg">
                <TabNavigation
                    tabs={tabs}
                    activeTab={activeTab}
                    onChange={setActiveTab}
                />

                <form
                    onSubmit={handleSubmit}
                    className="p-8">
                    <ProfileAvatar
                        name={formData.fullName}
                        editable
                    />

                    <FormInput
                        label="Full Name"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        error={errors.fullName}
                        required
                    />

                    <LoadingButton loading={isLoading}>Save Changes</LoadingButton>
                </form>
            </div>
        </div>
    )
}
```

## Theme Consistency

All components use the premium FreshExpress color palette:

-   **Primary Orange** (#FF6B35) - Buttons, focus states, active tabs
-   **Secondary Navy** (#004E89) - Text, headers
-   **Ruby Red** (#D81159) - Errors, danger actions
-   **Off-white** (#F4F7F6) - Backgrounds
-   **Dark** (#1A1A1A) - Body text

## Styling

-   Border radius: Cards (12px), Buttons (30px)
-   Transitions: 200ms duration
-   Hover effects: Scale transforms on buttons
-   Focus states: Orange borders
-   Error states: Red borders and text

## Component Structure

```
UserProfile/
├── ProfileHeader.jsx
├── ProfileAvatar.jsx
├── FormInput.jsx
├── PasswordInput.jsx
├── TabNavigation.jsx
├── LoadingButton.jsx
├── index.js
└── README.md
```

## Benefits

✅ **Reusability** - Use across multiple pages
✅ **Consistency** - Uniform styling and behavior
✅ **Maintainability** - Update once, apply everywhere
✅ **Type Safety** - Clear prop interfaces
✅ **Accessibility** - Proper labels and ARIA attributes
✅ **Responsive** - Mobile-friendly by default

---

**Used In:**

-   `/pages/EditProfile.jsx` - Edit profile page
-   Can be used in any user settings/profile pages

**Status:** ✅ Complete and Production Ready
