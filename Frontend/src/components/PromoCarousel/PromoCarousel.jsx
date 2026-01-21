import { useState, useEffect } from "react"

const PromoCarousel = () => {
    const [currentSlide, setCurrentSlide] = useState(0)

    const offers = [
        {
            id: 1,
            title: "Free Shipping on Orders Over $50!",
            subtitle: "Shop now and get free delivery",
            bgColor: "from-premium-primary to-premium-accent",
            icon: "🚚",
            cta: "Shop Now"
        },
        {
            id: 2,
            title: "20% Off Fresh Fruits & Vegetables",
            subtitle: "Limited time offer - Stock up today!",
            bgColor: "from-green-500 to-green-600",
            icon: "🍎",
            cta: "Browse Fruits"
        },
        {
            id: 3,
            title: "Buy 2 Get 1 Free on Dairy Products",
            subtitle: "Milk, cheese, yogurt and more!",
            bgColor: "from-blue-400 to-blue-600",
            icon: "🥛",
            cta: "Shop Dairy"
        },
        {
            id: 4,
            title: "Weekend Special: 15% Off Everything",
            subtitle: "Use code WEEKEND15 at checkout",
            bgColor: "from-premium-accent to-premium-primary",
            icon: "🎉",
            cta: "Apply Code"
        }
    ]

    // Auto-rotate slides every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % offers.length)
        }, 5000)

        return () => clearInterval(interval)
    }, [offers.length])

    const goToSlide = (index) => {
        setCurrentSlide(index)
    }

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % offers.length)
    }

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + offers.length) % offers.length)
    }

    return (
        <div className="relative bg-premium-background border-t border-gray-200 overflow-hidden">
            <div className="max-w-7xl mx-auto">
                {/* Carousel Container */}
                <div className="relative h-32 md:h-40 overflow-hidden">
                    {/* Slides */}
                    <div
                        className="flex transition-transform duration-500 ease-in-out h-full"
                        style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                        {offers.map((offer) => (
                            <div
                                key={offer.id}
                                className={`min-w-full h-full bg-gradient-to-r ${offer.bgColor} flex items-center justify-between px-6 md:px-12 relative`}>
                                {/* Left Content */}
                                <div className="flex items-center gap-4 md:gap-6 flex-1 pr-2 md:pr-4">
                                    <div className="text-5xl md:text-6xl animate-bounce">{offer.icon}</div>
                                    <div className="text-white">
                                        <h3 className="text-lg md:text-2xl font-bold mb-1">{offer.title}</h3>
                                        <p className="text-sm md:text-base opacity-90">{offer.subtitle}</p>
                                    </div>
                                </div>

                                {/* Right CTA Button */}
                                <div className="hidden md:block flex-shrink-0 mr-12">
                                    <button className="bg-white text-premium-primary px-6 py-3 rounded-[--radius-button] font-bold hover:bg-opacity-90 transition-all duration-200 transform hover:scale-105 shadow-lg">
                                        {offer.cta}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Navigation Arrows */}
                    <button
                        onClick={prevSlide}
                        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 text-premium-primary p-2 rounded-full shadow-lg transition-all duration-200 z-20">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 text-premium-primary p-2 rounded-full shadow-lg transition-all duration-200 z-20">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    </button>

                    {/* Dots Indicator */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                        {offers.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className={`h-2 rounded-full transition-all duration-300 ${
                                    index === currentSlide
                                        ? "w-8 bg-white"
                                        : "w-2 bg-white bg-opacity-50 hover:bg-opacity-75"
                                }`}
                                aria-label={`Go to slide ${index + 1}`}></button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PromoCarousel
