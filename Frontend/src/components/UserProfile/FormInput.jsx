const FormInput = ({ label, id, name, type = "text", value, onChange, error, placeholder, required = false }) => {
    return (
        <div>
            <label
                htmlFor={id}
                className="block text-sm font-semibold text-premium-text mb-2">
                {label}
                {required && <span className="text-premium-accent ml-1">*</span>}
            </label>
            <input
                type={type}
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                    error
                        ? "border-premium-accent focus:border-premium-accent"
                        : "border-gray-300 focus:border-premium-primary"
                }`}
                placeholder={placeholder}
            />
            {error && <p className="text-premium-accent text-xs mt-1">{error}</p>}
        </div>
    )
}

export default FormInput
