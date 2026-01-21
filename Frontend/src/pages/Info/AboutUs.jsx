import { Link } from "react-router-dom"
import Navbar from "../../components/Navbar"

const AboutUs = () => {
    return (
        <div className="min-h-screen bg-premium-background">
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-premium-secondary mb-4">
                        About The Filtered Fridge
                    </h1>
                    <p className="text-xl text-gray-600">Your Trusted Partner for Fresh Groceries</p>
                </div>

                {/* Mission Section */}
                <div className="bg-white rounded-[--radius-card] shadow-md p-8 mb-8">
                    <div className="flex items-start gap-4 mb-6">
                        <div className="text-5xl">🎯</div>
                        <div>
                            <h2 className="text-2xl font-bold text-premium-secondary mb-3">Our Mission</h2>
                            <p className="text-gray-700 leading-relaxed">
                                At The Filtered Fridge, we're committed to bringing you the freshest, highest-quality
                                groceries right to your doorstep. Our mission is to make grocery shopping convenient,
                                affordable, and enjoyable for everyone. We believe that everyone deserves access to
                                fresh, healthy food, and we're here to make that happen.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Story Section */}
                <div className="bg-white rounded-[--radius-card] shadow-md p-8 mb-8">
                    <div className="flex items-start gap-4 mb-6">
                        <div className="text-5xl">📖</div>
                        <div>
                            <h2 className="text-2xl font-bold text-premium-secondary mb-3">Our Story</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                The Filtered Fridge was founded in 2020 with a simple vision: to revolutionize the way
                                people shop for groceries. What started as a small local delivery service has grown into
                                a trusted online grocery platform serving thousands of customers.
                            </p>
                            <p className="text-gray-700 leading-relaxed">
                                We partner with local farmers, trusted suppliers, and quality brands to ensure that
                                every product in our store meets our high standards. Our team works tirelessly to source
                                the best products at competitive prices, all while maintaining our commitment to
                                freshness and quality.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Values Section */}
                <div className="bg-white rounded-[--radius-card] shadow-md p-8 mb-8">
                    <h2 className="text-2xl font-bold text-premium-secondary mb-6 text-center">Our Values</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center">
                            <div className="text-4xl mb-3">✨</div>
                            <h3 className="font-bold text-premium-text mb-2">Quality First</h3>
                            <p className="text-sm text-gray-600">
                                We never compromise on quality. Every product is carefully selected and inspected.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl mb-3">🚀</div>
                            <h3 className="font-bold text-premium-text mb-2">Fast Delivery</h3>
                            <p className="text-sm text-gray-600">
                                We understand your time is valuable. Fast, reliable delivery is our promise.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl mb-3">💚</div>
                            <h3 className="font-bold text-premium-text mb-2">Customer Care</h3>
                            <p className="text-sm text-gray-600">
                                Your satisfaction is our priority. We're here to help whenever you need us.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Why Choose Us */}
                <div className="bg-gradient-to-r from-premium-primary to-premium-accent text-white rounded-[--radius-card] shadow-lg p-8 mb-8">
                    <h2 className="text-2xl font-bold mb-6 text-center">Why Choose The Filtered Fridge?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-start gap-3">
                            <div className="text-2xl">✅</div>
                            <div>
                                <h3 className="font-bold mb-1">Fresh Products Daily</h3>
                                <p className="text-sm opacity-90">
                                    We restock our inventory daily to ensure maximum freshness.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="text-2xl">✅</div>
                            <div>
                                <h3 className="font-bold mb-1">Competitive Prices</h3>
                                <p className="text-sm opacity-90">
                                    Best prices guaranteed with regular deals and discounts.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="text-2xl">✅</div>
                            <div>
                                <h3 className="font-bold mb-1">Easy Returns</h3>
                                <p className="text-sm opacity-90">
                                    100% satisfaction guarantee with easy return policy.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="text-2xl">✅</div>
                            <div>
                                <h3 className="font-bold mb-1">Secure Payment</h3>
                                <p className="text-sm opacity-90">
                                    Multiple secure payment options for your convenience.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact CTA */}
                <div className="text-center">
                    <p className="text-gray-600 mb-4">Have questions? We'd love to hear from you!</p>
                    <Link
                        to="/contact"
                        className="inline-block bg-premium-primary hover:bg-opacity-90 text-white px-8 py-3 rounded-[--radius-button] font-semibold transition-all duration-200">
                        Contact Us
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default AboutUs
