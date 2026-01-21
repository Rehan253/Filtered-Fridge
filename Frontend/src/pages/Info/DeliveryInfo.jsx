import { Link } from "react-router-dom"
import Navbar from "../../components/Navbar"

const DeliveryInfo = () => {
    return (
        <div className="min-h-screen bg-premium-background">
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-premium-secondary mb-4">Delivery Information</h1>
                    <p className="text-xl text-gray-600">Everything you need to know about our delivery service</p>
                </div>

                {/* Delivery Zones */}
                <div className="bg-white rounded-[--radius-card] shadow-md p-8 mb-8">
                    <div className="flex items-start gap-4 mb-6">
                        <div className="text-5xl">📍</div>
                        <div>
                            <h2 className="text-2xl font-bold text-premium-secondary mb-4">Delivery Areas</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                We currently deliver to most major cities and metropolitan areas. Our delivery network
                                is constantly expanding, and we're working hard to reach more locations.
                            </p>
                            <div className="bg-premium-background p-4 rounded-lg">
                                <h3 className="font-bold text-premium-text mb-2">Currently Serving:</h3>
                                <ul className="list-disc list-inside text-gray-700 space-y-1">
                                    <li>New York City and surrounding areas</li>
                                    <li>Los Angeles metropolitan area</li>
                                    <li>Chicago and suburbs</li>
                                    <li>Houston and surrounding regions</li>
                                    <li>Phoenix metropolitan area</li>
                                    <li>And many more cities!</li>
                                </ul>
                            </div>
                            <p className="text-sm text-gray-600 mt-4">
                                Enter your postal code at checkout to see if we deliver to your area.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Delivery Options */}
                <div className="bg-white rounded-[--radius-card] shadow-md p-8 mb-8">
                    <h2 className="text-2xl font-bold text-premium-secondary mb-6">Delivery Options</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="border-2 border-gray-200 rounded-lg p-6 hover:border-premium-primary transition-colors duration-200">
                            <div className="text-4xl mb-3">🚚</div>
                            <h3 className="font-bold text-premium-text mb-2">Standard Delivery</h3>
                            <p className="text-gray-600 text-sm mb-3">2-3 business days</p>
                            <p className="text-gray-700 text-sm">
                                Free on orders over $50, otherwise $5.99. Perfect for regular grocery shopping.
                            </p>
                        </div>
                        <div className="border-2 border-gray-200 rounded-lg p-6 hover:border-premium-primary transition-colors duration-200">
                            <div className="text-4xl mb-3">⚡</div>
                            <h3 className="font-bold text-premium-text mb-2">Express Delivery</h3>
                            <p className="text-gray-600 text-sm mb-3">1-2 business days</p>
                            <p className="text-gray-700 text-sm">
                                $9.99 additional fee. Get your groceries faster when you need them urgently.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Delivery Process */}
                <div className="bg-white rounded-[--radius-card] shadow-md p-8 mb-8">
                    <h2 className="text-2xl font-bold text-premium-secondary mb-6">How It Works</h2>
                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-10 h-10 bg-premium-primary text-white rounded-full flex items-center justify-center font-bold">
                                1
                            </div>
                            <div>
                                <h3 className="font-bold text-premium-text mb-1">Place Your Order</h3>
                                <p className="text-gray-700 text-sm">
                                    Browse our products, add items to cart, and complete checkout with your delivery
                                    address.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-10 h-10 bg-premium-primary text-white rounded-full flex items-center justify-center font-bold">
                                2
                            </div>
                            <div>
                                <h3 className="font-bold text-premium-text mb-1">We Prepare Your Order</h3>
                                <p className="text-gray-700 text-sm">
                                    Our team carefully picks and packs your items, ensuring freshness and quality.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-10 h-10 bg-premium-primary text-white rounded-full flex items-center justify-center font-bold">
                                3
                            </div>
                            <div>
                                <h3 className="font-bold text-premium-text mb-1">Out for Delivery</h3>
                                <p className="text-gray-700 text-sm">
                                    You'll receive tracking information and updates as your order is on its way.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-10 h-10 bg-premium-primary text-white rounded-full flex items-center justify-center font-bold">
                                4
                            </div>
                            <div>
                                <h3 className="font-bold text-premium-text mb-1">Receive Your Order</h3>
                                <p className="text-gray-700 text-sm">
                                    Your groceries arrive fresh and ready. Enjoy your shopping experience!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Delivery Times */}
                <div className="bg-white rounded-[--radius-card] shadow-md p-8 mb-8">
                    <h2 className="text-2xl font-bold text-premium-secondary mb-6">Delivery Hours</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="font-bold text-premium-text mb-3">Weekdays (Mon-Fri)</h3>
                            <p className="text-gray-700">9:00 AM - 8:00 PM</p>
                        </div>
                        <div>
                            <h3 className="font-bold text-premium-text mb-3">Weekends (Sat-Sun)</h3>
                            <p className="text-gray-700">10:00 AM - 6:00 PM</p>
                        </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-4">
                        Orders placed after 6:00 PM will be delivered the next business day.
                    </p>
                </div>

                {/* Important Notes */}
                <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-[--radius-card] shadow-lg p-8 mb-8">
                    <h2 className="text-2xl font-bold mb-4">Important Delivery Notes</h2>
                    <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                            <span>✓</span>
                            <span>
                                Please ensure someone is available to receive the order at the delivery address.
                            </span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span>✓</span>
                            <span>Perishable items are packed in insulated bags to maintain freshness.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span>✓</span>
                            <span>You can add special delivery instructions during checkout.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span>✓</span>
                            <span>Contactless delivery options are available upon request.</span>
                        </li>
                    </ul>
                </div>

                {/* Contact CTA */}
                <div className="text-center">
                    <p className="text-gray-600 mb-4">Have questions about delivery?</p>
                    <Link
                        to="/contact"
                        className="inline-block bg-premium-primary hover:bg-opacity-90 text-white px-8 py-3 rounded-[--radius-button] font-semibold transition-all duration-200">
                        Contact Our Delivery Team
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default DeliveryInfo
