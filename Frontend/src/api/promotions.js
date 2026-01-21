import { sendDelete, sendGet, sendPost, sendPut } from "./generic"

export const getPromotions = async () => {
    return sendGet("/admin/promotions")
}

export const getPromotion = async (promotionId) => {
    return sendGet(`/admin/promotions/${promotionId}`)
}

export const createPromotion = async (payload) => {
    return sendPost("/admin/promotions", payload)
}

export const updatePromotion = async (promotionId, payload) => {
    return sendPut(`/admin/promotions/${promotionId}`, payload)
}

export const deletePromotion = async (promotionId) => {
    return sendDelete(`/admin/promotions/${promotionId}`)
}
