const ProductFilters = ({ filters, onFilterChange, onSortChange, preferencesEnabled, onPreferencesToggle }) => {
    const maxPrice = 50 // You can calculate this from products if needed

    return (
        <div className="bg-white rounded-[--radius-card] shadow-md p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-6">
                {/* Price Range Filter */}
                <div className="flex-1 min-w-0">
                    <label className="block text-sm font-semibold text-premium-text mb-2">Price Range</label>
                    <div className="flex items-center gap-3">
                        <input
                            type="number"
                            min="0"
                            max={maxPrice}
                            step="0.01"
                            placeholder="Min"
                            value={filters.minPrice || ""}
                            onChange={(e) =>
                                onFilterChange({
                                    ...filters,
                                    minPrice: e.target.value ? parseFloat(e.target.value) : undefined
                                })
                            }
                            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-premium-primary focus:outline-none text-sm"
                        />
                        <span className="text-gray-500 flex-shrink-0">-</span>
                        <input
                            type="number"
                            min="0"
                            max={maxPrice}
                            step="0.01"
                            placeholder="Max"
                            value={filters.maxPrice || ""}
                            onChange={(e) =>
                                onFilterChange({
                                    ...filters,
                                    maxPrice: e.target.value ? parseFloat(e.target.value) : undefined
                                })
                            }
                            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-premium-primary focus:outline-none text-sm"
                        />
                    </div>
                </div>

                {/* Preferences Toggle - Centered */}
                <div className="flex-1 min-w-0 flex flex-col items-center md:items-start">
                    <label className="block text-sm font-semibold text-premium-text mb-2 w-full text-center md:text-left">
                        Filter by Preferences
                    </label>
                    <div className="flex flex-col items-center md:items-start w-full">
                        <label className="relative inline-flex items-center cursor-pointer justify-center md:justify-start">
                            <input
                                type="checkbox"
                                checked={preferencesEnabled}
                                onChange={onPreferencesToggle}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-premium-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-premium-primary"></div>
                            <span className="ml-3 text-sm font-medium text-premium-text">
                                {preferencesEnabled ? "Enabled" : "Disabled"}
                            </span>
                        </label>
                        {/* Helper text with fixed height to prevent layout shift */}
                        <div className="h-5 mt-1 w-full">
                            {preferencesEnabled && (
                                <p className="text-xs text-gray-500 text-center md:text-left">
                                    Products filtered by your dietary preferences and allergies
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sort By */}
                <div className="flex-1 min-w-0">
                    <label className="block text-sm font-semibold text-premium-text mb-2">Sort By</label>
                    <select
                        value={filters.sortBy || "featured"}
                        onChange={(e) => onSortChange(e.target.value === "featured" ? undefined : e.target.value)}
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-premium-primary focus:outline-none text-sm">
                        <option value="featured">Featured</option>
                        <option value="priceLow">Price: Low to High</option>
                        <option value="priceHigh">Price: High to Low</option>
                        <option value="nameAZ">Name: A-Z</option>
                        <option value="nameZA">Name: Z-A</option>
                        <option value="rating">Highest Rated</option>
                    </select>
                </div>

                {/* Clear Filters Button - Fixed height container */}
                <div className="flex-shrink-0 w-full md:w-auto flex flex-col">
                    <label className="block text-sm font-semibold text-premium-text mb-2 invisible">Clear</label>
                    <div className="h-10 flex items-center">
                        {filters.minPrice || filters.maxPrice || filters.sortBy ? (
                            <button
                                onClick={() => {
                                    const newFilters = { ...filters }
                                    delete newFilters.minPrice
                                    delete newFilters.maxPrice
                                    delete newFilters.sortBy
                                    onFilterChange(newFilters)
                                    onSortChange(undefined)
                                }}
                                className="w-full md:w-auto px-4 py-2 bg-gray-200 hover:bg-gray-300 text-premium-text rounded-lg font-semibold text-sm transition-colors whitespace-nowrap">
                                Clear Filters
                            </button>
                        ) : (
                            <div className="w-full md:w-auto px-4 py-2 opacity-0 pointer-events-none whitespace-nowrap">
                                Clear Filters
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductFilters
