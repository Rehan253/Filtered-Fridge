const TabNavigation = ({ tabs, activeTab, onChange }) => {
    return (
        <div className="flex border-b border-gray-200">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onChange(tab.id)}
                    className={`flex-1 py-4 px-6 font-semibold transition-colors ${
                        activeTab === tab.id
                            ? "text-premium-primary border-b-2 border-premium-primary"
                            : "text-gray-500 hover:text-premium-secondary"
                    }`}>
                    {tab.label}
                </button>
            ))}
        </div>
    )
}

export default TabNavigation
