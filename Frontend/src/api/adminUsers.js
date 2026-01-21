import { sendGet, sendPatch } from "./generic"

export const getAdminUsers = async () => {
    return sendGet("/admin/users")
}

export const getAdminUser = async (userId) => {
    return sendGet(`/admin/users/${userId}`)
}

export const updateAdminUserStatus = async (userId, status) => {
    return sendPatch(`/admin/users/${userId}`, { status })
}
