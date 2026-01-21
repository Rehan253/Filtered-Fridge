import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import {
    Shop,
    Login,
    Signup,
    Profile,
    EditProfile,
    DeliveryAddress,
    Payment,
    OrderConfirmation,
    AboutUs,
    Contact,
    FAQ,
    DeliveryInfo,
    Dashboard,
    UserManagement,
    ProductManagement,
    PromotionManagement
} from "./pages"
import { CartProvider } from "./context/CartContext"
import ProtectedRoute from "./routes/ProtectedRoute"

function App() {
    return (
        <CartProvider>
            <Router>
                <Routes>
                    {/* Shop */}
                    <Route
                        path="/"
                        element={<Shop />}
                    />
                    <Route
                        path="/products"
                        element={<Shop />}
                    />

                    {/* Auth */}
                    <Route
                        path="/login"
                        element={<Login />}
                    />
                    <Route
                        path="/signup"
                        element={<Signup />}
                    />

                    {/* User Profile (Protected) */}
                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/edit-profile"
                        element={
                            <ProtectedRoute>
                                <EditProfile />
                            </ProtectedRoute>
                        }
                    />

                    {/* Checkout Flow (Protected) */}
                    <Route
                        path="/checkout/delivery"
                        element={
                            <ProtectedRoute>
                                <DeliveryAddress />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/checkout/payment"
                        element={
                            <ProtectedRoute>
                                <Payment />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/checkout/confirmation"
                        element={
                            <ProtectedRoute>
                                <OrderConfirmation />
                            </ProtectedRoute>
                        }
                    />

                    {/* Info Pages */}
                    <Route
                        path="/about"
                        element={<AboutUs />}
                    />
                    <Route
                        path="/contact"
                        element={<Contact />}
                    />
                    <Route
                        path="/faq"
                        element={<FAQ />}
                    />
                    <Route
                        path="/delivery-info"
                        element={<DeliveryInfo />}
                    />

                    {/* Admin Pages (Protected) */}
                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/users"
                        element={
                            <ProtectedRoute>
                                <UserManagement />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/products"
                        element={
                            <ProtectedRoute>
                                <ProductManagement />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/promotions"
                        element={
                            <ProtectedRoute>
                                <PromotionManagement />
                            </ProtectedRoute>
                        }
                    />

                    {/* Fallback */}
                    <Route
                        path="*"
                        element={
                            <Navigate
                                to="/"
                                replace
                            />
                        }
                    />
                </Routes>
            </Router>
        </CartProvider>
    )
}

export default App
