import { Navigate, useLocation } from "react-router-dom"
import authStore from "../data/Auth"

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, token } = authStore()
    const location = useLocation()

    if (!isAuthenticated || !token) {
        return (
            <Navigate
                to="/login"
                state={{ from: location }}
                replace
            />
        )
    }

    return children
}

export default ProtectedRoute
