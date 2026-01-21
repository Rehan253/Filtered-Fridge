import { sendGet, sendPost, sendPut } from "./generic"
import { getSimpleObject } from "./Object"

export const getTicketsObject = (object) => {
    return getSimpleObject(object)
}

export const login = (data) => {
    return sendPost(`auth/login`, data)
}

export const getMe = () => {
    return sendGet(`auth/me`)
}

export const register = (data) => {
    return sendPost(`auth/register`, data)
}

export const getUserPreferences = () => {
    return sendGet("auth/preferences")
}

export const updateUserPreferences = (data) => {
    return sendPut("auth/preferences", data)
}

export const updateProfile = (data) => {
    return sendPut("auth/me", data)
}

export const updatePassword = (data) => {
    return sendPut("auth/password", data)
}
