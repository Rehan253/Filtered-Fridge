const LoadingButton = ({
    loading,
    children,
    onClick,
    type = "submit",
    variant = "primary",
    disabled,
    className = ""
}) => {
    const variants = {
        primary:
            "bg-premium-primary hover:bg-opacity-90 text-white shadow-lg transform hover:scale-105 disabled:transform-none",
        secondary: "bg-white border-2 border-gray-300 hover:border-premium-secondary text-premium-text",
        danger: "bg-premium-accent hover:bg-opacity-90 text-white"
    }

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`flex-1 font-bold py-3 rounded-[--radius-button] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}>
            {loading ? (
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
                    Loading...
                </span>
            ) : (
                children
            )}
        </button>
    )
}

export default LoadingButton
