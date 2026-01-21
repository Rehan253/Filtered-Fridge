import { useEffect, useState } from "react"
import Navbar from "../../components/Navbar"
import { PromotionTable, PromotionForm } from "../../components/Admin"
import { getPromotionStatus } from "../../data/promotions"
import { createPromotion, deletePromotion, getPromotion, getPromotions, updatePromotion } from "../../api/promotions"

const PromotionManagement = () => {
    const [promotions, setPromotions] = useState([])
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingPromotion, setEditingPromotion] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const loadPromotions = async () => {
            setIsLoading(true)
            setError(null)
            const response = await getPromotions()
            if (response && response.status === "Error") {
                setError(response.errorMessage || "Failed to load promotions")
                setIsLoading(false)
                return
            }
            const data = response?.data || response || []
            setPromotions(Array.isArray(data) ? data : [])
            setIsLoading(false)
        }

        loadPromotions()
    }, [])

    const handleCreate = () => {
        setEditingPromotion(null)
        setIsFormOpen(true)
    }

    const handleEdit = async (promotion) => {
        const response = await getPromotion(promotion.id)
        if (response && response.status === "Error") {
            setEditingPromotion(promotion)
        } else {
            setEditingPromotion(response || promotion)
        }
        setIsFormOpen(true)
    }

    const handleSave = async (promotionData) => {
        setError(null)
        if (editingPromotion) {
            const response = await updatePromotion(editingPromotion.id, promotionData)
            if (response && response.status === "Error") {
                setError(response.errorMessage || "Failed to update promotion")
                return
            }
            setPromotions((prevPromotions) =>
                prevPromotions.map((p) => (p.id === editingPromotion.id ? response : p))
            )
        } else {
            const response = await createPromotion(promotionData)
            if (response && response.status === "Error") {
                setError(response.errorMessage || "Failed to create promotion")
                return
            }
            setPromotions((prevPromotions) => [...prevPromotions, response])
        }
        setIsFormOpen(false)
        setEditingPromotion(null)
    }

    const handleDelete = async (promotionId) => {
        if (window.confirm("Are you sure you want to delete this promotion?")) {
            const response = await deletePromotion(promotionId)
            if (response && response.status === "Error") {
                setError(response.errorMessage || "Failed to delete promotion")
                return
            }
            setPromotions((prevPromotions) => prevPromotions.filter((p) => p.id !== promotionId))
        }
    }

    const handleCancel = () => {
        setIsFormOpen(false)
        setEditingPromotion(null)
    }

    // Calculate statistics
    const stats = {
        total: promotions.length,
        active: promotions.filter((p) => getPromotionStatus(p) === "active").length,
        scheduled: promotions.filter((p) => getPromotionStatus(p) === "scheduled").length,
        expired: promotions.filter((p) => getPromotionStatus(p) === "expired").length,
        inactive: promotions.filter((p) => p.status === "inactive").length,
        withCode: promotions.filter((p) => p.promoCode).length
    }

    return (
        <div className="min-h-screen bg-premium-background">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-premium-text mb-2">Promotion Management</h1>
                        <p className="text-gray-600">Manage discounts, offers, and promotional campaigns</p>
                    </div>
                    <button
                        onClick={handleCreate}
                        className="bg-premium-primary hover:bg-opacity-90 text-white px-6 py-3 rounded-[--radius-button] font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2">
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
                                d="M12 4v16m8-8H4"
                            />
                        </svg>
                        Create Promotion
                    </button>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                    <div className="bg-white rounded-[--radius-card] shadow-md p-4">
                        <div className="text-2xl font-bold text-premium-text">{stats.total}</div>
                        <div className="text-sm text-gray-600">Total Promotions</div>
                    </div>
                    <div className="bg-white rounded-[--radius-card] shadow-md p-4">
                        <div className="text-2xl font-bold text-green-600">{stats.active}</div>
                        <div className="text-sm text-gray-600">Active</div>
                    </div>
                    <div className="bg-white rounded-[--radius-card] shadow-md p-4">
                        <div className="text-2xl font-bold text-blue-600">{stats.scheduled}</div>
                        <div className="text-sm text-gray-600">Scheduled</div>
                    </div>
                    <div className="bg-white rounded-[--radius-card] shadow-md p-4">
                        <div className="text-2xl font-bold text-gray-600">{stats.expired}</div>
                        <div className="text-sm text-gray-600">Expired</div>
                    </div>
                    <div className="bg-white rounded-[--radius-card] shadow-md p-4">
                        <div className="text-2xl font-bold text-red-600">{stats.inactive}</div>
                        <div className="text-sm text-gray-600">Inactive</div>
                    </div>
                    <div className="bg-white rounded-[--radius-card] shadow-md p-4">
                        <div className="text-2xl font-bold text-premium-accent">{stats.withCode}</div>
                        <div className="text-sm text-gray-600">With Promo Code</div>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 p-4 rounded-[--radius-card] bg-red-100 text-red-700 border border-red-300">
                        {error}
                    </div>
                )}

                {/* Promotion Table */}
                {isLoading ? (
                    <div className="bg-white rounded-[--radius-card] shadow-md p-8 text-center text-gray-600">
                        Loading promotions...
                    </div>
                ) : (
                    <PromotionTable
                        promotions={promotions}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                )}

                {/* Promotion Form Modal */}
                {isFormOpen && (
                    <PromotionForm
                        promotion={editingPromotion}
                        onSave={handleSave}
                        onCancel={handleCancel}
                    />
                )}
            </div>
        </div>
    )
}

export default PromotionManagement
