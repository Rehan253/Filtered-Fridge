import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"
import * as api from "../api"

export const loginAction = async (data) => {
    const response = await api.login(data)
    return response
}

export const getMeAction = async () => {
    const response = await api.getMe()
    return response
}

export const registerAction = async (data) => {
    const response = await api.register(data)
    return response
}

export const logoutAction = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
}

const authStore = create(
    devtools(
        persist(
            (set, get) => ({
                user: null,
                token: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,

                // Login action
                login: async (credentials) => {
                    set({ isLoading: true, error: null }, false, "login/start")
                    try {
                        const response = await loginAction(credentials)
                        if (response && response.access_token) {
                            localStorage.setItem("token", response.access_token)
                            localStorage.setItem("user", JSON.stringify(response.user))
                            set(
                                {
                                    token: response.access_token,
                                    user: response.user,
                                    isAuthenticated: true,
                                    isLoading: false,
                                    error: null
                                },
                                false,
                                "login/success"
                            )
                            return { success: true, data: response }
                        }
                        const errorText = response?.errorMessage || response?.message || "Login failed"
                        const errorMessage = errorText.toLowerCase().includes("inactive")
                            ? "Your account is inactive. Please contact support."
                            : errorText
                        set({ isLoading: false, error: errorMessage, isAuthenticated: false }, false, "login/error")
                        return { success: false, error: errorMessage }
                    } catch (err) {
                        const errorMessage = err.response?.data?.message || err.message || "Login failed"
                        set({ isLoading: false, error: errorMessage, isAuthenticated: false }, false, "login/error")
                        return { success: false, error: errorMessage }
                    }
                },

                // Register action
                register: async (userData) => {
                    set({ isLoading: true, error: null }, false, "register/start")
                    try {
                        const response = await registerAction(userData)
                        if (response && response.message) {
                            set({ isLoading: false, error: null }, false, "register/success")
                            return { success: true, data: response }
                        }
                        const errorMessage =
                            response?.errorMessage || response?.message || "Registration failed"
                        set({ isLoading: false, error: errorMessage }, false, "register/error")
                        return { success: false, error: errorMessage }
                    } catch (err) {
                        const errorMessage = err.response?.data?.message || err.message || "Registration failed"
                        set({ isLoading: false, error: errorMessage }, false, "register/error")
                        return { success: false, error: errorMessage }
                    }
                },

                // Get current user
                getMe: async () => {
                    set({ isLoading: true, error: null }, false, "getMe/start")
                    try {
                        const response = await getMeAction()
                        if (response) {
                            localStorage.setItem("user", JSON.stringify(response))
                            set({ user: response, isLoading: false, error: null }, false, "getMe/success")
                            return { success: true, data: response }
                        }
                    } catch (err) {
                        const errorMessage = err.response?.data?.message || err.message || "Failed to fetch user"
                        set({ isLoading: false, error: errorMessage }, false, "getMe/error")
                        return { success: false, error: errorMessage }
                    }
                },

                // Logout action
                logout: () => {
                    logoutAction()
                    set({ user: null, token: null, isAuthenticated: false, error: null }, false, "logout/success")
                },

                // Clear errors
                clearError: () => set({ error: null }, false, "clearError")
            }),
            {
                name: "authStore",
                partialize: (state) => ({
                    user: state.user,
                    token: state.token,
                    isAuthenticated: state.isAuthenticated
                })
            }
        ),
        { name: "authStore" }
    )
)

export default authStore
