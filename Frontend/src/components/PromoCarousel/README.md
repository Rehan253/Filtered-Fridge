# PromoCarousel Component 🎠

Animated promotional carousel that displays rotating offers and deals below the navbar.

## Features

-   **Auto-Rotating Slides** - Changes every 5 seconds automatically
-   **4 Promotional Offers** - Different deals with unique colors
-   **Manual Navigation** - Previous/Next arrow buttons
-   **Dot Indicators** - Click to jump to specific slide
-   **Smooth Animations** - 500ms slide transitions
-   **Gradient Backgrounds** - Eye-catching color schemes
-   **Responsive Design** - Adapts to mobile and desktop
-   **Animated Icons** - Bouncing emoji icons

## Usage

```jsx
import { PromoCarousel } from "../../components/PromoCarousel"

function Shop() {
    return (
        <div>
            <Navbar />
            <PromoCarousel />
            {/* Rest of page content */}
        </div>
    )
}
```

## Offers Displayed

1. **Free Shipping** 🚚
   - "Free Shipping on Orders Over $50!"
   - Orange to Ruby Red gradient

2. **Fruits & Vegetables** 🍎
   - "20% Off Fresh Fruits & Vegetables"
   - Green gradient

3. **Dairy Products** 🥛
   - "Buy 2 Get 1 Free on Dairy Products"
   - Blue gradient

4. **Weekend Special** 🎉
   - "Weekend Special: 15% Off Everything"
   - Ruby Red to Orange gradient

## Controls

### Auto-Play
- Slides automatically advance every **5 seconds**
- Loops continuously through all offers

### Manual Navigation
- **Left Arrow** - Previous slide
- **Right Arrow** - Next slide
- **Dot Indicators** - Click any dot to jump to that slide

## Styling

### Heights
- **Mobile**: 128px (h-32)
- **Desktop**: 160px (h-40)

### Colors
Each offer has a unique gradient:
- Free Shipping: `from-premium-primary to-premium-accent`
- Fruits: `from-green-500 to-green-600`
- Dairy: `from-blue-400 to-blue-600`
- Weekend: `from-premium-accent to-premium-primary`

### Animations
- **Slide Transition**: 500ms ease-in-out
- **Icon Bounce**: Continuous bounce animation
- **Button Hover**: Scale transform

## Customization

### Adding New Offers

Edit the `offers` array in `PromoCarousel.jsx`:

```javascript
const offers = [
    {
        id: 5,
        title: "Your New Offer",
        subtitle: "Offer description",
        bgColor: "from-purple-500 to-purple-600",
        icon: "🎁",
        cta: "Shop Now"
    },
    // ... existing offers
]
```

### Changing Auto-Play Speed

Modify the interval in `useEffect`:

```javascript
useEffect(() => {
    const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % offers.length)
    }, 3000) // Change 5000 to 3000 for 3 seconds
    // ...
}, [offers.length])
```

### Custom Colors

Use Tailwind gradient classes:
- `from-{color}-{shade} to-{color}-{shade}`
- Example: `from-yellow-400 to-yellow-600`

## Responsive Behavior

**Mobile (< 640px):**
- Smaller text sizes
- No CTA button (icon and text only)
- Compact navigation arrows

**Desktop (≥ 640px):**
- Larger text and icons
- CTA button visible
- Full-width layout

## Accessibility

- ✅ Keyboard navigation support
- ✅ ARIA labels on navigation buttons
- ✅ Semantic HTML structure
- ✅ Focus states on interactive elements

## Performance

- **Auto-cleanup**: Interval cleared on unmount
- **Efficient Rendering**: Only active slide rendered
- **Smooth Transforms**: Hardware-accelerated CSS transforms

## Related Components

- **Navbar** - Positioned directly below
- **Shop Page** - Main page where carousel is displayed

---

**Component:** PromoCarousel  
**Location:** Below Navbar  
**Auto-Play:** 5 seconds  
**Slides:** 4 offers  
**Status:** ✅ Complete and Production Ready  
**Last Updated:** 2026-01-18
