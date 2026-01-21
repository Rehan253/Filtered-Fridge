import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import authStore from "../../data/Auth"

const Signup = () => {
    const navigate = useNavigate()
    const { register, isLoading, error: storeError } = authStore()

    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone_number: "",
        address: "",
        city: "",
        country: "",
        zip_code: "",
        agreeToTerms: false
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [errors, setErrors] = useState({})
    const [apiError, setApiError] = useState("")
    const [successMessage, setSuccessMessage] = useState("")

    useEffect(() => {
        if (storeError) {
            setApiError(storeError)
        }
    }, [storeError])

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }))
        // Clear error when user types
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: ""
            }))
        }
        setApiError("")
    }

    const validateForm = () => {
        const newErrors = {}

        if (!formData.first_name.trim()) {
            newErrors.first_name = "First name is required"
        } else if (formData.first_name.trim().length < 2) {
            newErrors.first_name = "Name must be at least 2 characters"
        }

        if (!formData.last_name.trim()) {
            newErrors.last_name = "Last name is required"
        } else if (formData.last_name.trim().length < 2) {
            newErrors.last_name = "Last name must be at least 2 characters"
        }

        if (!formData.email) {
            newErrors.email = "Email is required"
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Please enter a valid email"
        }

        if (!formData.phone_number) {
            newErrors.phone_number = "Phone number is required"
        } else if (!/^\+?[\d\s-()]+$/.test(formData.phone_number)) {
            newErrors.phone_number = "Please enter a valid phone number"
        }

        if (!formData.address.trim()) {
            newErrors.address = "Address is required"
        }

        if (!formData.city.trim()) {
            newErrors.city = "City is required"
        }

        if (!formData.zip_code.trim()) {
            newErrors.zip_code = "Zip code is required"
        }

        if (!formData.country.trim()) {
            newErrors.country = "Country is required"
        }

        if (!formData.password) {
            newErrors.password = "Password is required"
        } else if (formData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters"
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
            newErrors.password = "Password must contain uppercase, lowercase, and number"
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password"
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match"
        }

        if (!formData.agreeToTerms) {
            newErrors.agreeToTerms = "You must agree to the terms and conditions"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (validateForm()) {
            const registrationData = {
                first_name: formData.first_name,
                last_name: formData.last_name,
                email: formData.email,
                password: formData.password,
                phone_number: formData.phone_number,
                address: formData.address,
                city: formData.city,
                country: formData.country,
                zip_code: formData.zip_code
            }

            const result = await register(registrationData)
            if (result.success) {
                setSuccessMessage("Registration successful! Redirecting to login...")
                setTimeout(() => {
                    navigate("/login")
                }, 2000)
            }
        }
    }

    return (
        <div className="min-h-screen bg-premium-background flex items-center justify-center px-4 py-12">
            <div className="max-w-md w-full">
                {/* Logo/Brand Section */}
                <div className="text-center mb-8">
                    <h1
                        className="text-premium-secondary font-bold text-4xl mb-2"
                        style={{ fontFamily: "'Poppins', sans-serif" }}>
                        The Filtered Fridge
                    </h1>
                    <p className="text-gray-600">Create your account and start shopping!</p>
                </div>

                {/* Signup Card */}
                <div className="bg-white rounded-[--radius-card] shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-premium-text mb-6">Create Account</h2>

                    {/* Success Alert */}
                    {successMessage && (
                        <div className="mb-4 p-3 bg-green-100 border border-green-400 rounded-lg">
                            <p className="text-green-800 text-sm font-semibold">{successMessage}</p>
                        </div>
                    )}

                    {/* API Error Alert */}
                    {apiError && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg">
                            <p className="text-red-700 text-sm font-semibold">{apiError}</p>
                        </div>
                    )}

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-4">
                        {/* First Name Field */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label
                                    htmlFor="first_name"
                                    className="block text-sm font-semibold text-premium-text mb-2">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    id="first_name"
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                                        errors.first_name
                                            ? "border-premium-accent focus:border-premium-accent"
                                            : "border-gray-300 focus:border-premium-primary"
                                    }`}
                                    placeholder="John"
                                />
                                {errors.first_name && (
                                    <p className="text-premium-accent text-xs mt-1">{errors.first_name}</p>
                                )}
                            </div>

                            {/* Last Name Field */}
                            <div>
                                <label
                                    htmlFor="last_name"
                                    className="block text-sm font-semibold text-premium-text mb-2">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    id="last_name"
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                                        errors.last_name
                                            ? "border-premium-accent focus:border-premium-accent"
                                            : "border-gray-300 focus:border-premium-primary"
                                    }`}
                                    placeholder="Doe"
                                />
                                {errors.last_name && (
                                    <p className="text-premium-accent text-xs mt-1">{errors.last_name}</p>
                                )}
                            </div>
                        </div>

                        {/* Email Field */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-semibold text-premium-text mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                                    errors.email
                                        ? "border-premium-accent focus:border-premium-accent"
                                        : "border-gray-300 focus:border-premium-primary"
                                }`}
                                placeholder="you@example.com"
                            />
                            {errors.email && <p className="text-premium-accent text-xs mt-1">{errors.email}</p>}
                        </div>

                        {/* Phone Field */}
                        <div>
                            <label
                                htmlFor="phone_number"
                                className="block text-sm font-semibold text-premium-text mb-2">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                id="phone_number"
                                name="phone_number"
                                value={formData.phone_number}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                                    errors.phone_number
                                        ? "border-premium-accent focus:border-premium-accent"
                                        : "border-gray-300 focus:border-premium-primary"
                                }`}
                                placeholder="+1 (555) 123-4567"
                            />
                            {errors.phone_number && (
                                <p className="text-premium-accent text-xs mt-1">{errors.phone_number}</p>
                            )}
                        </div>

                        {/* Address Field */}
                        <div>
                            <label
                                htmlFor="address"
                                className="block text-sm font-semibold text-premium-text mb-2">
                                Street Address
                            </label>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                                    errors.address
                                        ? "border-premium-accent focus:border-premium-accent"
                                        : "border-gray-300 focus:border-premium-primary"
                                }`}
                                placeholder="123 Main Street"
                            />
                            {errors.address && <p className="text-premium-accent text-xs mt-1">{errors.address}</p>}
                        </div>

                        {/* City and Zip Code Row */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label
                                    htmlFor="city"
                                    className="block text-sm font-semibold text-premium-text mb-2">
                                    City
                                </label>
                                <input
                                    type="text"
                                    id="city"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                                        errors.city
                                            ? "border-premium-accent focus:border-premium-accent"
                                            : "border-gray-300 focus:border-premium-primary"
                                    }`}
                                    placeholder="Paris"
                                />
                                {errors.city && <p className="text-premium-accent text-xs mt-1">{errors.city}</p>}
                            </div>

                            <div>
                                <label
                                    htmlFor="zip_code"
                                    className="block text-sm font-semibold text-premium-text mb-2">
                                    Zip Code
                                </label>
                                <input
                                    type="text"
                                    id="zip_code"
                                    name="zip_code"
                                    value={formData.zip_code}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                                        errors.zip_code
                                            ? "border-premium-accent focus:border-premium-accent"
                                            : "border-gray-300 focus:border-premium-primary"
                                    }`}
                                    placeholder="75001"
                                />
                                {errors.zip_code && (
                                    <p className="text-premium-accent text-xs mt-1">{errors.zip_code}</p>
                                )}
                            </div>
                        </div>

                        {/* Country Field */}
                        <div>
                            <label
                                htmlFor="country"
                                className="block text-sm font-semibold text-premium-text mb-2">
                                Country
                            </label>
                            <input
                                type="text"
                                id="country"
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                                    errors.country
                                        ? "border-premium-accent focus:border-premium-accent"
                                        : "border-gray-300 focus:border-premium-primary"
                                }`}
                                placeholder="France"
                            />
                            {errors.country && <p className="text-premium-accent text-xs mt-1">{errors.country}</p>}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-semibold text-premium-text mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors pr-12 ${
                                        errors.password
                                            ? "border-premium-accent focus:border-premium-accent"
                                            : "border-gray-300 focus:border-premium-primary"
                                    }`}
                                    placeholder="Create a strong password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-premium-secondary">
                                    {showPassword ? (
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
                                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                                            />
                                        </svg>
                                    ) : (
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
                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                            />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            {errors.password && <p className="text-premium-accent text-xs mt-1">{errors.password}</p>}
                        </div>

                        {/* Confirm Password Field */}
                        <div>
                            <label
                                htmlFor="confirmPassword"
                                className="block text-sm font-semibold text-premium-text mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors pr-12 ${
                                        errors.confirmPassword
                                            ? "border-premium-accent focus:border-premium-accent"
                                            : "border-gray-300 focus:border-premium-primary"
                                    }`}
                                    placeholder="Confirm your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-premium-secondary">
                                    {showConfirmPassword ? (
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
                                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                                            />
                                        </svg>
                                    ) : (
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
                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                            />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="text-premium-accent text-xs mt-1">{errors.confirmPassword}</p>
                            )}
                        </div>

                        {/* Terms and Conditions */}
                        <div>
                            <label className="flex items-start cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="agreeToTerms"
                                    checked={formData.agreeToTerms}
                                    onChange={handleChange}
                                    className={`w-4 h-4 mt-1 text-premium-primary border-gray-300 rounded focus:ring-premium-primary ${
                                        errors.agreeToTerms ? "border-premium-accent" : ""
                                    }`}
                                />
                                <span className="ml-2 text-sm text-gray-600">
                                    I agree to the{" "}
                                    <a
                                        href="#"
                                        className="text-premium-secondary hover:underline font-semibold">
                                        Terms of Service
                                    </a>{" "}
                                    and{" "}
                                    <a
                                        href="#"
                                        className="text-premium-secondary hover:underline font-semibold">
                                        Privacy Policy
                                    </a>
                                </span>
                            </label>
                            {errors.agreeToTerms && (
                                <p className="text-premium-accent text-xs mt-1">{errors.agreeToTerms}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-premium-primary hover:bg-opacity-90 text-white font-bold py-3 rounded-[--radius-button] shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                            {isLoading ? (
                                <span className="flex items-center justify-center">
                                    <svg
                                        className="animate-spin h-5 w-5 mr-2"
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
                                    Creating account...
                                </span>
                            ) : (
                                "Create Account"
                            )}
                        </button>

                        {/* Divider */}
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-gray-500">Or sign up with</span>
                            </div>
                        </div>

                        {/* Social Signup Buttons */}
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                className="flex items-center justify-center px-4 py-2 border-2 border-gray-300 rounded-lg hover:border-premium-secondary transition-colors">
                                <svg
                                    className="w-5 h-5 mr-2"
                                    viewBox="0 0 24 24">
                                    <path
                                        fill="#4285F4"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="#34A853"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="#FBBC05"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    />
                                    <path
                                        fill="#EA4335"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    />
                                </svg>
                                <span className="text-sm font-semibold">Google</span>
                            </button>
                            <button
                                type="button"
                                className="flex items-center justify-center px-4 py-2 border-2 border-gray-300 rounded-lg hover:border-premium-secondary transition-colors">
                                <svg
                                    className="w-5 h-5 mr-2"
                                    fill="#1877F2"
                                    viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                                <span className="text-sm font-semibold">Facebook</span>
                            </button>
                        </div>
                    </form>

                    {/* Login Link */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="text-premium-primary hover:text-premium-secondary font-bold">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Benefits Section */}
                <div className="mt-6 bg-white rounded-[--radius-card] shadow-md p-6">
                    <h3 className="font-bold text-premium-text mb-4 text-center">Why Join The Filtered Fridge?</h3>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="bg-premium-primary text-white rounded-full p-2 flex-shrink-0">
                                <svg
                                    className="w-4 h-4"
                                    fill="currentColor"
                                    viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <span className="text-sm text-gray-600">Free delivery on orders over $50</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="bg-premium-primary text-white rounded-full p-2 flex-shrink-0">
                                <svg
                                    className="w-4 h-4"
                                    fill="currentColor"
                                    viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <span className="text-sm text-gray-600">Exclusive deals and discounts for members</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="bg-premium-primary text-white rounded-full p-2 flex-shrink-0">
                                <svg
                                    className="w-4 h-4"
                                    fill="currentColor"
                                    viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <span className="text-sm text-gray-600">Track your orders in real-time</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="bg-premium-primary text-white rounded-full p-2 flex-shrink-0">
                                <svg
                                    className="w-4 h-4"
                                    fill="currentColor"
                                    viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <span className="text-sm text-gray-600">Premium customer support 24/7</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signup
