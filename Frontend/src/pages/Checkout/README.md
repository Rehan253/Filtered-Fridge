# Checkout Module 💳

Complete checkout flow with delivery address, payment, and order confirmation pages.

## Pages

### 1. DeliveryAddress (`/checkout/delivery`)

### 2. Payment (`/checkout/payment`)

### 3. OrderConfirmation (`/checkout/confirmation`)

---

## 1. Delivery Address Page

First step in the checkout process where users enter their delivery information.

### Features

-   **Progress Indicator** - Shows current step (1 of 3)
-   **Contact Information** - Name, email, phone
-   **Shipping Address** - Street, apartment, city, state, ZIP
-   **Delivery Notes** - Optional special instructions
-   **Form Validation** - Real-time validation with error messages
-   **Order Summary** - Sticky sidebar with cart items and totals
-   **Empty Cart Protection** - Redirects to shop if cart is empty

### Form Fields

**Contact Information:**

-   Full Name (required)
-   Email (required, validated)
-   Phone Number (required, 10 digits)

**Shipping Address:**

-   Street Address (required)
-   Apartment/Suite (optional)
-   City (required)
-   State (required)
-   ZIP Code (required, 5 digits)
-   Delivery Notes (optional, textarea)

### Validation Rules

```javascript
{
    fullName: "Required",
    email: "Required, valid email format",
    phone: "Required, 10 digits",
    address: "Required",
    city: "Required",
    state: "Required",
    zipCode: "Required, 5 digits"
}
```

### Data Storage

Delivery address is saved to `localStorage` under key:

```
freshexpress-delivery-address
```

### Navigation

-   **Back to Shop** - Returns to home page
-   **Continue to Payment** - Validates and proceeds to payment page

---

## 2. Payment Page

Second step where users select payment method and enter payment details.

### Features

-   **Progress Indicator** - Shows step 2 of 3
-   **Payment Method Selection** - Card, PayPal, Cash on Delivery
-   **Card Form** - Full credit/debit card input
-   **Form Validation** - Card number, expiry, CVV validation
-   **Order Summary** - Shows delivery address and cart items
-   **Processing State** - Loading indicator during payment
-   **Empty Cart Protection** - Redirects if cart is empty

### Payment Methods

#### 1. Credit/Debit Card 💳

**Fields:**

-   Card Number (16 digits, auto-formatted)
-   Cardholder Name
-   Expiry Date (MM/YY format)
-   CVV (3-4 digits)
-   Save Card checkbox

**Validation:**

```javascript
{
    cardNumber: "Required, 16 digits",
    cardName: "Required",
    expiryDate: "Required, MM/YY format",
    cvv: "Required, 3-4 digits"
}
```

#### 2. PayPal 🅿️

-   Shows PayPal information card
-   Simulates redirect to PayPal
-   No additional form fields required

#### 3. Cash on Delivery 💵

-   Shows COD information card
-   No payment details required
-   May not be available for all locations

### Card Number Formatting

Automatically formats card number with spaces:

```
1234 5678 9012 3456
```

### Expiry Date Formatting

Auto-formats as user types:

```
12/26
```

### Order Processing

1. User clicks "Place Order"
2. Shows loading spinner
3. Simulates 2-second processing delay
4. Saves order to `localStorage`
5. Clears cart
6. Navigates to confirmation page

### Data Storage

Order data is saved to `localStorage` under key:

```
freshexpress-last-order
```

**Order Object:**

```javascript
{
    orderNumber: "FE1737123456789",
    date: "2026-01-18T12:00:00.000Z",
    items: [...cartItems],
    deliveryAddress: {...addressData},
    paymentMethod: "card|paypal|cod",
    subtotal: 45.99,
    tax: 4.60,
    shipping: 0,
    total: 50.59
}
```

---

## 3. Order Confirmation Page

Final step showing order success and complete order details.

### Features

-   **Success Animation** - Bouncing checkmark
-   **Order Number** - Unique order identifier (FE + timestamp)
-   **Order Date** - Formatted date
-   **Order Items** - Complete list with quantities and prices
-   **Price Breakdown** - Subtotal, tax, shipping, total
-   **Delivery Address** - Full address with contact info
-   **Payment Method** - Confirmed payment type
-   **Delivery Estimate** - 2-3 business days
-   **PDF Invoice Download** - Generate and download professional PDF invoice
-   **Action Buttons** - Download PDF, view order history, or continue shopping
-   **Support Information** - Contact email and phone

### Order Number Format

```
FE1737123456789
```

-   Prefix: `FE` (FreshExpress)
-   Timestamp: Unix timestamp

### What's Next Section

Gradient card showing:

-   📦 Order preparation status
-   Email confirmation notice
-   Estimated delivery time

### Navigation Options

-   **Download PDF Invoice** - Generates and downloads PDF with order details
-   **View Order History** - Goes to `/profile`
-   **Continue Shopping** - Returns to `/`

### Data Loading

-   Loads order from `localStorage` key: `freshexpress-last-order`
-   If no order found, redirects to home page
-   Shows loading spinner while fetching data

### PDF Invoice Generation

**Button:** Download PDF Invoice (Ruby Red button with download icon)

**PDF Contents:**

-   **Header**: FreshExpress branding with orange background
-   **Order Details**: Order number and date
-   **Delivery Address**: Complete shipping information
-   **Items Table**: All products with quantities, prices, and totals
-   **Price Summary**: Subtotal, tax, shipping, and grand total
-   **Payment Method**: Confirmed payment type
-   **Footer**: Support contact information

**Features:**

-   Professional invoice layout
-   Branded colors (Orange, Navy)
-   Automatic page breaks for long orders
-   Downloads as: `FreshExpress-Invoice-{orderNumber}.pdf`
-   Loading state during generation
-   Uses jsPDF library

**Generated PDF Format:**

```
┌─────────────────────────────────────┐
│  FreshExpress (Orange Header)       │
│  Premium Online Grocery Store       │
├─────────────────────────────────────┤
│  Order Invoice                      │
│  Order Number: FE1737123456789      │
│  Order Date: January 18, 2026       │
│                                     │
│  Delivery Address:                  │
│  John Doe                           │
│  123 Main Street                    │
│  New York, NY 10001                 │
│  Phone: (555) 123-4567              │
│  Email: john@example.com            │
│                                     │
│  ┌────────────────────────────────┐ │
│  │ Item    │ Qty │ Price │ Total  │ │
│  ├────────────────────────────────┤ │
│  │ Product │  2  │ $5.00 │ $10.00 │ │
│  └────────────────────────────────┘ │
│                                     │
│  Subtotal:           $45.99         │
│  Tax (10%):           $4.60         │
│  Shipping:            FREE          │
│  Total:              $50.59         │
│                                     │
│  Payment: Credit/Debit Card         │
│                                     │
│  Thank you for shopping!            │
│  support@freshexpress.com           │
└─────────────────────────────────────┘
```

---

## Checkout Flow Diagram

```
Cart Sidebar
     ↓
[Proceed to Checkout]
     ↓
Step 1: Delivery Address (/checkout/delivery)
     ↓ [Continue to Payment]
Step 2: Payment (/checkout/payment)
     ↓ [Place Order]
Step 3: Order Confirmation (/checkout/confirmation)
     ↓
[View Order History] or [Continue Shopping]
```

---

## Progress Indicator

Visual stepper showing current position:

```
Step 1 (Active):   ● ─── ○ ─── ○
Step 2 (Active):   ✓ ─── ● ─── ○
Step 3 (Active):   ✓ ─── ✓ ─── ●
```

**States:**

-   **Completed**: Green checkmark (✓)
-   **Active**: Orange filled circle (●)
-   **Pending**: Gray empty circle (○)

---

## Order Summary Sidebar

Sticky sidebar on all checkout pages showing:

### Delivery Page

-   Cart items with quantities
-   Subtotal, tax, shipping
-   Total amount

### Payment Page

-   Delivery address
-   Cart items (scrollable)
-   Price breakdown
-   Total amount

### Confirmation Page

-   Full order details
-   All items
-   Complete price breakdown
-   Delivery and payment info

---

## Data Flow

### 1. Cart → Delivery

```javascript
const { cartItems, subtotal, tax, shipping, total } = useCart()
```

### 2. Delivery → Payment

```javascript
const deliveryAddress = JSON.parse(localStorage.getItem("freshexpress-delivery-address"))
```

### 3. Payment → Confirmation

```javascript
const orderData = {
    orderNumber: `FE${Date.now()}`,
    date: new Date().toISOString(),
    items: cartItems,
    deliveryAddress,
    paymentMethod,
    subtotal,
    tax,
    shipping,
    total
}
localStorage.setItem("freshexpress-last-order", JSON.stringify(orderData))
clearCart()
```

### 4. Confirmation Display

```javascript
const order = JSON.parse(localStorage.getItem("freshexpress-last-order"))
```

---

## Validation & Error Handling

### Empty Cart Protection

All checkout pages check for empty cart:

```javascript
if (cartItems.length === 0) {
    return <EmptyCartMessage />
}
```

### Form Validation

-   Real-time validation on input change
-   Error messages below fields
-   Red border on invalid fields
-   Submit blocked until valid

### Missing Data Handling

-   Confirmation page redirects if no order found
-   Payment page can navigate back to delivery
-   All pages show loading states

---

## Responsive Design

### Desktop (lg+)

-   Two-column layout (66% form + 33% summary)
-   Sticky order summary sidebar
-   Full progress indicator

### Tablet (md)

-   Adjusted column widths
-   Scrollable summary
-   Compact progress indicator

### Mobile (< md)

-   Stacked single column
-   Summary below form
-   Simplified progress indicator
-   Full-width buttons

---

## Styling & Theme

### Colors

-   **Primary**: Orange (#FF6B35) - Buttons, prices, active states
-   **Secondary**: Navy (#004E89) - Headers, back buttons
-   **Accent**: Ruby Red (#D81159) - Error states
-   **Success**: Green - Checkmarks, free shipping
-   **Background**: Off-white (#F4F7F6)

### Components

-   **Cards**: 12px border radius
-   **Buttons**: 30px border radius (pill shape)
-   **Inputs**: 2px border, rounded corners
-   **Shadows**: Soft elevation on cards

---

## Security Considerations

⚠️ **Important**: This is a demo implementation

**In Production:**

1. **Never store real card data** in localStorage
2. **Use payment gateway** (Stripe, PayPal API)
3. **Backend validation** for all forms
4. **HTTPS required** for payment pages
5. **PCI compliance** for card handling
6. **Secure order IDs** (not just timestamps)
7. **Authentication** required for checkout

---

## Integration Example

```jsx
// App.jsx
import { CartProvider } from "./context/CartContext"
import { DeliveryAddress, Payment, OrderConfirmation } from "./pages/Checkout"

function App() {
    return (
        <CartProvider>
            <Router>
                <Routes>
                    <Route
                        path="/checkout/delivery"
                        element={<DeliveryAddress />}
                    />
                    <Route
                        path="/checkout/payment"
                        element={<Payment />}
                    />
                    <Route
                        path="/checkout/confirmation"
                        element={<OrderConfirmation />}
                    />
                </Routes>
            </Router>
        </CartProvider>
    )
}
```

---

## Testing Checklist

-   ✅ Empty cart redirects to shop
-   ✅ Form validation works correctly
-   ✅ Data persists between pages
-   ✅ Card number formatting
-   ✅ Expiry date formatting
-   ✅ Payment method switching
-   ✅ Order processing animation
-   ✅ Cart clears after order
-   ✅ Confirmation displays correctly
-   ✅ Navigation buttons work
-   ✅ Responsive on all devices
-   ✅ LocalStorage persistence

---

## Implemented Features

-   ✅ **PDF Invoice Generation** - Professional invoice with order details

## Future Enhancements

1. **Address Autocomplete** - Google Places API
2. **Saved Addresses** - Multiple delivery addresses
3. **Guest Checkout** - No account required
4. **Order Tracking** - Real-time delivery status
5. **Email Notifications** - Order confirmation emails
6. **Multiple Payment Methods** - Apple Pay, Google Pay
7. **Promo Codes** - Discount code application
8. **Gift Options** - Gift wrapping, messages
9. **Delivery Scheduling** - Choose delivery time slot

---

## Related Documentation

-   **Cart Context:** `/context/CartContext.jsx`
-   **Cart Sidebar:** `/components/Cart/README.md`
-   **Product Data:** `/data/products.js`
-   **Main README:** `/README.md`

---

**Module:** Checkout  
**Pages:** 3 (DeliveryAddress, Payment, OrderConfirmation)  
**Routes:** `/checkout/delivery`, `/checkout/payment`, `/checkout/confirmation`  
**Status:** ✅ Complete and Production Ready  
**Last Updated:** 2026-01-18
