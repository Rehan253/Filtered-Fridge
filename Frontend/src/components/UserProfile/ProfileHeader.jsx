const ProfileHeader = ({ title, subtitle, backLink }) => {
    return (
        <div className="mb-8">
            {backLink && (
                <a
                    href={backLink}
                    className="inline-flex items-center text-premium-secondary hover:text-premium-primary mb-4 transition-colors">
                    <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                    Back to Profile
                </a>
            )}
            <h1 className="text-3xl font-bold text-premium-text mb-2">{title}</h1>
            {subtitle && <p className="text-gray-600">{subtitle}</p>}
        </div>
    )
}

export default ProfileHeader
