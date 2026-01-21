import { useState } from "react"
import { Link } from "react-router-dom"
import Navbar from "../../components/Navbar"

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(null)

    const faqs = [
        {
            question: "How do I place an order?",
            answer: "Simply browse our products, add items to your cart, and proceed to checkout. You'll need to provide your delivery address and payment information. Once your order is confirmed, we'll start preparing it for delivery."
        },
        {
            question: "What are your delivery charges?",
            answer: "We offer free shipping on orders over $50. For orders below $50, there is a flat delivery charge of $5.99. Delivery charges are calculated at checkout before you complete your order."
        },
        {
            question: "How long does delivery take?",
            answer: "Standard delivery takes 2-3 business days. We also offer express delivery (1-2 business days) for an additional fee. Delivery times may vary based on your location and product availability."
        },
        {
            question: "What payment methods do you accept?",
            answer: "We accept all major credit and debit cards, PayPal, and Cash on Delivery (COD) for select locations. All online payments are processed securely through our encrypted payment gateway."
        },
        {
            question: "Can I modify or cancel my order?",
            answer: "You can modify or cancel your order within 30 minutes of placing it. After that, your order enters our fulfillment process and cannot be changed. Please contact our customer service team if you need assistance."
        },
        {
            question: "What is your return policy?",
            answer: "We offer a 7-day return policy for most products. Items must be unopened and in their original packaging. Fresh produce and perishable items are not eligible for return. Please contact us for return authorization."
        },
        {
            question: "Do you offer refunds?",
            answer: "Yes, we offer full refunds for returned items that meet our return policy criteria. Refunds are processed to your original payment method within 5-7 business days after we receive and inspect the returned items."
        },
        {
            question: "How do I track my order?",
            answer: "Once your order is shipped, you'll receive a tracking number via email and SMS. You can use this number to track your order status on our website or through the delivery partner's tracking system."
        },
        {
            question: "What if I receive damaged or incorrect items?",
            answer: "If you receive damaged or incorrect items, please contact us within 24 hours of delivery. We'll arrange for a replacement or refund. Please take photos of the damaged items to help us process your claim faster."
        },
        {
            question: "Do you deliver to my area?",
            answer: "We currently deliver to most major cities and surrounding areas. Enter your postal code at checkout to see if we deliver to your location. We're constantly expanding our delivery network!"
        },
        {
            question: "Are your products fresh?",
            answer: "Absolutely! We source our products daily from trusted suppliers and local farms. All perishable items are stored in temperature-controlled facilities and delivered in insulated packaging to maintain freshness."
        },
        {
            question: "Can I schedule a delivery time?",
            answer: "Currently, we offer standard delivery windows. However, you can add delivery notes during checkout, and our delivery team will do their best to accommodate your preferences. Scheduled delivery options are coming soon!"
        }
    ]

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index)
    }

    return (
        <div className="min-h-screen bg-premium-background">
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-premium-secondary mb-4">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-xl text-gray-600">Find answers to common questions about The Filtered Fridge</p>
                </div>

                {/* FAQ List */}
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-[--radius-card] shadow-md overflow-hidden transition-all duration-200">
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-premium-background transition-colors duration-200">
                                <span className="font-bold text-premium-text text-lg pr-4">{faq.question}</span>
                                <svg
                                    className={`h-5 w-5 text-premium-primary flex-shrink-0 transition-transform duration-300 ${
                                        openIndex === index ? "rotate-180" : ""
                                    }`}
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </button>
                            {openIndex === index && (
                                <div className="px-6 pb-4 text-gray-700 leading-relaxed animate-fadeIn">
                                    {faq.answer}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Still Have Questions */}
                <div className="mt-12 bg-gradient-to-r from-premium-primary to-premium-accent text-white rounded-[--radius-card] shadow-lg p-8 text-center">
                    <h2 className="text-2xl font-bold mb-3">Still Have Questions?</h2>
                    <p className="mb-6 opacity-90">Can't find the answer you're looking for? We're here to help!</p>
                    <Link
                        to="/contact"
                        className="inline-block bg-white text-premium-primary px-8 py-3 rounded-[--radius-button] font-semibold hover:bg-opacity-90 transition-all duration-200">
                        Contact Us
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default FAQ
