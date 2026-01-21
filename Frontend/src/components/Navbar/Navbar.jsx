import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useCart } from "../../context/CartContext"
import authStore from "../../data/Auth"

const Navbar = () => {
    const navigate = useNavigate()
    const { cartCount, toggleCart } = useCart()
    const { isAuthenticated, user, logout } = authStore()
    const [showProfileMenu, setShowProfileMenu] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")

    const handleSearch = (e) => {
        e.preventDefault()
        console.log("Searching for:", searchQuery)
        // Add your search logic here
    }

    const handleLogout = () => {
        logout()
        setShowProfileMenu(false)
        navigate("/login")
    }

    return (
        <nav className="bg-premium-secondary shadow-lg sticky top-0 z-50">
            {/* Main Navbar */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Left - Brand Name */}
                    <div className="flex-shrink-0">
                        <Link
                            className="text-white font-bold text-2xl sm:text-3xl"
                            style={{ fontFamily: "'Poppins', sans-serif" }}
                            to="/">
                            The Filtered Fridge
                        </Link>
                    </div>

                    {/* Center - Search Bar (Hidden on mobile) */}
                    <div className="hidden md:flex flex-1 max-w-2xl mx-8">
                        <form
                            onSubmit={handleSearch}
                            className="w-full">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search for products..."
                                    className="w-full px-6 py-3 pr-12 rounded-[30px] border-2 border-white/30 bg-white/90 focus:border-white focus:bg-white focus:outline-none transition-colors duration-200 text-premium-text placeholder-gray-500"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-premium-primary hover:bg-opacity-90 text-white p-2 rounded-full transition-all duration-200">
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
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Right - Profile & Cart Icons */}
                    <div className="flex items-center gap-4">
                        {/* Auth Links */}
                        {!isAuthenticated ? (
                            <>
                                <Link
                                    to="/login"
                                    className="px-4 py-2 text-white hover:bg-white/20 rounded-lg transition-colors duration-200 text-sm font-semibold">
                                    Sign In
                                </Link>
                                <Link
                                    to="/signup"
                                    className="px-4 py-2 bg-premium-primary hover:bg-opacity-90 text-white rounded-lg transition-colors duration-200 text-sm font-semibold">
                                    Sign Up
                                </Link>
                            </>
                        ) : (
                            <>
                                {/* Profile Menu */}
                                <div className="relative">
                                    <button
                                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                                        className="p-2 hover:bg-white/20 rounded-full transition-colors duration-200">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-7 w-7 text-white"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                            />
                                        </svg>
                                    </button>

                                    {/* Dropdown Menu */}
                                    {showProfileMenu && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50">
                                            <div className="px-4 py-2 border-b">
                                                <p className="text-sm font-semibold text-premium-text">
                                                    {user?.first_name} {user?.last_name}
                                                </p>
                                                <p className="text-xs text-gray-600">{user?.email}</p>
                                            </div>
                                            <Link
                                                to="/profile"
                                                onClick={() => setShowProfileMenu(false)}
                                                className="block px-4 py-2 text-sm text-premium-text hover:bg-gray-100 transition-colors">
                                                My Profile
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full text-left px-4 py-2 text-sm text-premium-accent hover:bg-gray-100 transition-colors font-semibold">
                                                Sign Out
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        {/* Cart Icon */}
                        <button
                            onClick={toggleCart}
                            className="relative p-2 hover:bg-white/20 rounded-full transition-colors duration-200">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-7 w-7 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                            </svg>
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-premium-primary text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center animate-pulse">
                                    {cartCount > 99 ? "99+" : cartCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Search Bar */}
                <div className="md:hidden pb-4">
                    <form
                        onSubmit={handleSearch}
                        className="w-full">
                        <div className="relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search for products..."
                                className="w-full px-6 py-3 pr-12 rounded-[30px] border-2 border-white/30 bg-white/90 focus:border-white focus:bg-white focus:outline-none transition-colors duration-200 text-premium-text placeholder-gray-500"
                            />
                            <button
                                type="submit"
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-premium-primary hover:bg-opacity-90 text-white p-2 rounded-full transition-all duration-200">
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
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
