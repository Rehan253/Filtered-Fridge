const ProfileAvatar = ({ name, size = "large", editable = false, onChangePhoto }) => {
    const sizeClasses = {
        small: "w-12 h-12 text-lg",
        medium: "w-16 h-16 text-xl",
        large: "w-24 h-24 text-3xl"
    }

    const initials = name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()

    return (
        <div className={`flex items-center ${editable ? "mb-8" : ""}`}>
            <div
                className={`${
                    sizeClasses[size]
                } bg-gradient-to-br from-premium-primary to-premium-accent rounded-full flex items-center justify-center text-white font-bold ${
                    editable ? "mr-6" : ""
                }`}>
                {initials}
            </div>
            {editable && (
                <div>
                    <h3 className="text-lg font-semibold text-premium-text mb-1">Profile Picture</h3>
                    <p className="text-sm text-gray-600 mb-3">Update your profile photo</p>
                    <button
                        type="button"
                        onClick={onChangePhoto}
                        className="bg-premium-background hover:bg-gray-300 text-premium-text px-4 py-2 rounded-[--radius-button] text-sm font-semibold transition-all duration-200">
                        Change Photo
                    </button>
                </div>
            )}
        </div>
    )
}

export default ProfileAvatar
