import { useState } from "react"
import Navbar from "../../components/Navbar"

const Contact = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
    })
    const [errors, setErrors] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: ""
            }))
        }
    }

    const validateForm = () => {
        const newErrors = {}

        if (!formData.name.trim()) newErrors.name = "Name is required"
        if (!formData.email.trim()) {
            newErrors.email = "Email is required"
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid"
        }
        if (!formData.subject.trim()) newErrors.subject = "Subject is required"
        if (!formData.message.trim()) newErrors.message = "Message is required"

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (validateForm()) {
            setIsSubmitting(true)
            // Simulate form submission
            setTimeout(() => {
                setIsSubmitting(false)
                setIsSubmitted(true)
                setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    subject: "",
                    message: ""
                })
            }, 1500)
        }
    }

    return (
        <div className="min-h-screen bg-premium-background">
            <Navbar />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-premium-secondary mb-4">Contact Us</h1>
                    <p className="text-xl text-gray-600">We're here to help! Get in touch with us.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Contact Information */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-[--radius-card] shadow-md p-6">
                            <h2 className="text-2xl font-bold text-premium-secondary mb-6">Get in Touch</h2>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="text-3xl">📞</div>
                                    <div>
                                        <h3 className="font-bold text-premium-text mb-1">Phone</h3>
                                        <p className="text-gray-600">+1 (555) 123-4567</p>
                                        <p className="text-sm text-gray-500">Mon-Sat: 7AM - 10PM</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="text-3xl">📧</div>
                                    <div>
                                        <h3 className="font-bold text-premium-text mb-1">Email</h3>
                                        <p className="text-gray-600">info@freshexpress.com</p>
                                        <p className="text-sm text-gray-500">We'll respond within 24 hours</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="text-3xl">📍</div>
                                    <div>
                                        <h3 className="font-bold text-premium-text mb-1">Address</h3>
                                        <p className="text-gray-600">
                                            123 Market Street
                                            <br />
                                            New York, NY 10001
                                            <br />
                                            United States
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="text-3xl">🕒</div>
                                    <div>
                                        <h3 className="font-bold text-premium-text mb-1">Business Hours</h3>
                                        <p className="text-gray-600">
                                            Monday - Saturday: 7:00 AM - 10:00 PM
                                            <br />
                                            Sunday: 9:00 AM - 8:00 PM
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Social Media */}
                        <div className="bg-white rounded-[--radius-card] shadow-md p-6">
                            <h3 className="font-bold text-premium-text mb-4">Follow Us</h3>
                            <div className="flex gap-4">
                                <a
                                    href="#"
                                    className="w-12 h-12 bg-premium-primary text-white rounded-full flex items-center justify-center hover:bg-opacity-90 transition-all duration-200">
                                    <span className="text-xl">📘</span>
                                </a>
                                <a
                                    href="#"
                                    className="w-12 h-12 bg-premium-primary text-white rounded-full flex items-center justify-center hover:bg-opacity-90 transition-all duration-200">
                                    <span className="text-xl">📷</span>
                                </a>
                                <a
                                    href="#"
                                    className="w-12 h-12 bg-premium-primary text-white rounded-full flex items-center justify-center hover:bg-opacity-90 transition-all duration-200">
                                    <span className="text-xl">🐦</span>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white rounded-[--radius-card] shadow-md p-6">
                        <h2 className="text-2xl font-bold text-premium-secondary mb-6">Send us a Message</h2>

                        {isSubmitted ? (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">✅</div>
                                <h3 className="text-2xl font-bold text-green-600 mb-2">Message Sent!</h3>
                                <p className="text-gray-600 mb-6">We'll get back to you as soon as possible.</p>
                                <button
                                    onClick={() => setIsSubmitted(false)}
                                    className="bg-premium-primary hover:bg-opacity-90 text-white px-6 py-2 rounded-[--radius-button] font-semibold">
                                    Send Another Message
                                </button>
                            </div>
                        ) : (
                            <form
                                onSubmit={handleSubmit}
                                className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none transition-colors ${
                                            errors.name
                                                ? "border-red-500 focus:border-red-500"
                                                : "border-gray-300 focus:border-premium-primary"
                                        }`}
                                        placeholder="Your name"
                                    />
                                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none transition-colors ${
                                            errors.email
                                                ? "border-red-500 focus:border-red-500"
                                                : "border-gray-300 focus:border-premium-primary"
                                        }`}
                                        placeholder="your.email@example.com"
                                    />
                                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Phone (Optional)
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-premium-primary transition-colors"
                                        placeholder="(555) 123-4567"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Subject <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none transition-colors ${
                                            errors.subject
                                                ? "border-red-500 focus:border-red-500"
                                                : "border-gray-300 focus:border-premium-primary"
                                        }`}
                                        placeholder="What is this regarding?"
                                    />
                                    {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Message <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows={6}
                                        className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none transition-colors ${
                                            errors.message
                                                ? "border-red-500 focus:border-red-500"
                                                : "border-gray-300 focus:border-premium-primary"
                                        }`}
                                        placeholder="Tell us how we can help..."></textarea>
                                    {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-premium-primary hover:bg-opacity-90 text-white py-3 rounded-[--radius-button] font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                                    {isSubmitting ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg
                                                className="animate-spin h-5 w-5"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24">
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Sending...
                                        </span>
                                    ) : (
                                        "Send Message"
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Contact
