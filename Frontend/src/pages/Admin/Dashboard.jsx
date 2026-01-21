import { useState, useMemo, useEffect } from "react"
import {
    LineChart,
    Line,
    AreaChart,
    Area,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts"
import Navbar from "../../components/Navbar"
import { sampleOrders } from "../../data/orders"
import { sampleUsers } from "../../data/users"
import { sampleProducts } from "../../data/products"
import { samplePromotions, getPromotionStatus } from "../../data/promotions"
import {
    getBestSellingProducts,
    getDashboardCharts,
    getOrderCustomerMetrics,
    getProductPromotionMetrics,
    getRevenueMetrics
} from "../../api/kpis"

const Dashboard = () => {
    const [selectedPeriod, setSelectedPeriod] = useState("month") // day, week, month, year
    const [revenueMetrics, setRevenueMetrics] = useState(null)
    const [orderCustomerMetrics, setOrderCustomerMetrics] = useState(null)
    const [productPromotionMetrics, setProductPromotionMetrics] = useState(null)
    const [dashboardCharts, setDashboardCharts] = useState(null)
    const [bestSellingProducts, setBestSellingProducts] = useState([])
    const [bestSellingError, setBestSellingError] = useState(null)

    // Calculate date ranges
    const getDateRange = (period) => {
        const now = new Date()
        const start = new Date()

        switch (period) {
            case "day":
                start.setHours(0, 0, 0, 0)
                break
            case "week":
                start.setDate(now.getDate() - 7)
                break
            case "month":
                start.setMonth(now.getMonth() - 1)
                break
            case "year":
                start.setFullYear(now.getFullYear() - 1)
                break
            default:
                start.setMonth(now.getMonth() - 1)
        }

        return { start, end: now }
    }

    const { start, end } = getDateRange(selectedPeriod)

    useEffect(() => {
        const loadRevenueMetrics = async () => {
            const response = await getRevenueMetrics(selectedPeriod)
            if (response && response.status === "Error") {
                setRevenueMetrics(null)
                return
            }
            const data = response?.data || response
            setRevenueMetrics({
                totalRevenue: Number(data?.totalRevenue ?? 0),
                periodRevenue: Number(data?.periodRevenue ?? 0),
                averageOrderValue: Number(data?.averageOrderValue ?? 0),
                periodAverageOrderValue: Number(data?.periodAverageOrderValue ?? 0),
                revenueGrowth: Number(data?.revenueGrowth ?? 0)
            })
        }

        loadRevenueMetrics()
    }, [selectedPeriod])

    useEffect(() => {
        const loadOrderCustomerMetrics = async () => {
            const response = await getOrderCustomerMetrics(selectedPeriod)
            if (response && response.status === "Error") {
                setOrderCustomerMetrics(null)
                return
            }
            const data = response?.data || response
            setOrderCustomerMetrics({
                totalOrders: Number(data?.totalOrders ?? 0),
                periodOrdersCount: Number(data?.periodOrdersCount ?? 0),
                pendingOrders: Number(data?.pendingOrders ?? 0),
                completedOrders: Number(data?.completedOrders ?? 0),
                orderGrowth: Number(data?.orderGrowth ?? 0),
                totalCustomers: Number(data?.totalCustomers ?? 0),
                periodCustomers: Number(data?.periodCustomers ?? 0),
                activeCustomers: Number(data?.activeCustomers ?? 0)
            })
        }

        loadOrderCustomerMetrics()
    }, [selectedPeriod])

    useEffect(() => {
        const loadProductPromotionMetrics = async () => {
            const response = await getProductPromotionMetrics()
            if (response && response.status === "Error") {
                setProductPromotionMetrics(null)
                return
            }
            const data = response?.data || response
            setProductPromotionMetrics({
                totalProducts: Number(data?.totalProducts ?? 0),
                lowStockProducts: Number(data?.lowStockProducts ?? 0),
                outOfStockProducts: Number(data?.outOfStockProducts ?? 0),
                totalInventoryValue: Number(data?.totalInventoryValue ?? 0),
                activePromotions: Number(data?.activePromotions ?? 0),
                totalPromotions: Number(data?.totalPromotions ?? 0)
            })
        }

        loadProductPromotionMetrics()
    }, [])

    useEffect(() => {
        const loadDashboardCharts = async () => {
            const response = await getDashboardCharts()
            if (response && response.status === "Error") {
                setDashboardCharts(null)
                return
            }
            const data = response?.data || response
            setDashboardCharts({
                revenueChartData: Array.isArray(data?.revenueChartData) ? data.revenueChartData : [],
                orderStatusData: Array.isArray(data?.orderStatusData) ? data.orderStatusData : [],
                categoryChartData: Array.isArray(data?.categoryChartData) ? data.categoryChartData : [],
                customerGrowthData: Array.isArray(data?.customerGrowthData) ? data.customerGrowthData : []
            })
        }

        loadDashboardCharts()
    }, [])

    useEffect(() => {
        const loadBestSelling = async () => {
            setBestSellingError(null)
            const response = await getBestSellingProducts(5)
            if (response && response.status === "Error") {
                setBestSellingProducts([])
                setBestSellingError(response.errorMessage || "Failed to load top selling products")
                return
            }
            const data = response?.data || response
            const normalized = Array.isArray(data)
                ? data.map((item) => ({
                      name: item.name || item.product_name || "Unknown",
                      quantity: Number(item.total_sold ?? item.quantity ?? 0)
                  }))
                : []
            setBestSellingProducts(normalized)
        }

        loadBestSelling()
    }, [])

    // Calculate KPIs
    const kpis = useMemo(() => {
        // Order metrics
        const allOrders = sampleOrders
        const periodOrders = allOrders.filter((order) => {
            const orderDate = new Date(order.date)
            return orderDate >= start && orderDate <= end
        })

        const totalRevenue = allOrders.reduce((sum, order) => sum + order.total, 0)
        const periodRevenue = periodOrders.reduce((sum, order) => sum + order.total, 0)
        const previousPeriodRevenue = totalRevenue - periodRevenue // Simplified

        const totalOrders = allOrders.length
        const periodOrdersCount = periodOrders.length
        const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0
        const periodAverageOrderValue = periodOrdersCount > 0 ? periodRevenue / periodOrdersCount : 0

        const pendingOrders = allOrders.filter((order) => order.status === "processing").length
        const completedOrders = allOrders.filter((order) => order.status === "delivered").length

        // Customer metrics
        const totalCustomers = sampleUsers.filter((u) => u.role === "customer").length
        const periodCustomers = sampleUsers.filter((u) => {
            const joinDate = new Date(u.joinDate)
            return joinDate >= start && joinDate <= end && u.role === "customer"
        }).length
        const activeCustomers = sampleUsers.filter((u) => u.status === "active" && u.role === "customer").length

        // Product metrics
        const totalProducts = sampleProducts.length
        const lowStockProducts = sampleProducts.filter((p) => p.stock < 10).length
        const outOfStockProducts = sampleProducts.filter((p) => p.stock === 0).length
        const totalInventoryValue = sampleProducts.reduce((sum, p) => sum + p.price * p.stock, 0)

        // Promotion metrics
        const activePromotions = samplePromotions.filter((p) => getPromotionStatus(p) === "active").length
        const totalPromotions = sampleOrders.filter((o) => o.promoCode).length

        // Best selling products (simplified - based on orders)
        const productSales = {}
        allOrders.forEach((order) => {
            order.items.forEach((item) => {
                productSales[item.name] = (productSales[item.name] || 0) + item.quantity
            })
        })
        const bestSellingProducts = Object.entries(productSales)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([name, quantity]) => ({ name, quantity }))

        // Revenue growth
        const revenueGrowth =
            previousPeriodRevenue > 0 ? ((periodRevenue - previousPeriodRevenue) / previousPeriodRevenue) * 100 : 0

        // Order growth
        const previousPeriodOrders = totalOrders - periodOrdersCount
        const orderGrowth =
            previousPeriodOrders > 0 ? ((periodOrdersCount - previousPeriodOrders) / previousPeriodOrders) * 100 : 0

        // Chart data: Revenue over time (last 7 days)
        const revenueByDate = {}
        allOrders.forEach((order) => {
            const date = new Date(order.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })
            revenueByDate[date] = (revenueByDate[date] || 0) + order.total
        })
        const revenueChartData = Object.entries(revenueByDate)
            .map(([date, revenue]) => ({ date, revenue: Math.round(revenue) }))
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(-7)

        // Chart data: Orders by status
        const orderStatusData = [
            { name: "Delivered", value: allOrders.filter((o) => o.status === "delivered").length, color: "#10b981" },
            { name: "Processing", value: allOrders.filter((o) => o.status === "processing").length, color: "#f59e0b" },
            { name: "Shipped", value: allOrders.filter((o) => o.status === "shipped").length, color: "#3b82f6" },
            { name: "Cancelled", value: allOrders.filter((o) => o.status === "cancelled").length, color: "#ef4444" }
        ].filter((item) => item.value > 0)

        // Chart data: Sales by category
        const categorySales = {}
        allOrders.forEach((order) => {
            order.items.forEach((item) => {
                const product = sampleProducts.find((p) => p.name === item.name)
                if (product) {
                    const category = product.category || "Other"
                    categorySales[category] = (categorySales[category] || 0) + item.quantity * item.price
                }
            })
        })
        const categoryChartData = Object.entries(categorySales)
            .map(([category, revenue]) => ({ category, revenue: Math.round(revenue) }))
            .sort((a, b) => b.revenue - a.revenue)

        // Chart data: Customer growth (by month)
        const customerGrowth = {}
        sampleUsers
            .filter((u) => u.role === "customer")
            .forEach((user) => {
                const month = new Date(user.joinDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })
                customerGrowth[month] = (customerGrowth[month] || 0) + 1
            })
        const customerGrowthData = Object.entries(customerGrowth)
            .map(([month, count]) => ({ month, customers: count }))
            .sort((a, b) => new Date(a.month) - new Date(b.month))
            .slice(-6)

        return {
            // Revenue KPIs
            totalRevenue,
            periodRevenue,
            revenueGrowth,
            averageOrderValue,
            periodAverageOrderValue,

            // Order KPIs
            totalOrders,
            periodOrdersCount,
            orderGrowth,
            pendingOrders,
            completedOrders,

            // Customer KPIs
            totalCustomers,
            periodCustomers,
            activeCustomers,

            // Product KPIs
            totalProducts,
            lowStockProducts,
            outOfStockProducts,
            totalInventoryValue,
            bestSellingProducts,

            // Promotion KPIs
            activePromotions,
            totalPromotions,

            // Chart data
            revenueChartData,
            orderStatusData,
            categoryChartData,
            customerGrowthData
        }
    }, [start, end])

    const revenueKpis = useMemo(() => {
        if (!revenueMetrics) {
            return kpis
        }

        return {
            ...kpis,
            totalRevenue: revenueMetrics.totalRevenue,
            periodRevenue: revenueMetrics.periodRevenue,
            averageOrderValue: revenueMetrics.averageOrderValue,
            periodAverageOrderValue: revenueMetrics.periodAverageOrderValue,
            revenueGrowth: revenueMetrics.revenueGrowth
        }
    }, [kpis, revenueMetrics])

    const orderCustomerKpis = useMemo(() => {
        if (!orderCustomerMetrics) {
            return kpis
        }

        return {
            ...kpis,
            totalOrders: orderCustomerMetrics.totalOrders,
            periodOrdersCount: orderCustomerMetrics.periodOrdersCount,
            pendingOrders: orderCustomerMetrics.pendingOrders,
            completedOrders: orderCustomerMetrics.completedOrders,
            orderGrowth: orderCustomerMetrics.orderGrowth,
            totalCustomers: orderCustomerMetrics.totalCustomers,
            periodCustomers: orderCustomerMetrics.periodCustomers,
            activeCustomers: orderCustomerMetrics.activeCustomers
        }
    }, [kpis, orderCustomerMetrics])

    const productPromotionKpis = useMemo(() => {
        if (!productPromotionMetrics) {
            return kpis
        }

        return {
            ...kpis,
            totalProducts: productPromotionMetrics.totalProducts,
            lowStockProducts: productPromotionMetrics.lowStockProducts,
            outOfStockProducts: productPromotionMetrics.outOfStockProducts,
            totalInventoryValue: productPromotionMetrics.totalInventoryValue,
            activePromotions: productPromotionMetrics.activePromotions,
            totalPromotions: productPromotionMetrics.totalPromotions
        }
    }, [kpis, productPromotionMetrics])

    const chartKpis = useMemo(() => {
        if (!dashboardCharts) {
            return kpis
        }

        return {
            ...kpis,
            revenueChartData: dashboardCharts.revenueChartData,
            orderStatusData: dashboardCharts.orderStatusData,
            categoryChartData: dashboardCharts.categoryChartData,
            customerGrowthData: dashboardCharts.customerGrowthData
        }
    }, [kpis, dashboardCharts])


    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount)
    }

    const formatNumber = (num) => {
        return new Intl.NumberFormat("en-US").format(num)
    }

    const getGrowthColor = (growth) => {
        if (growth > 0) return "text-green-600"
        if (growth < 0) return "text-red-600"
        return "text-gray-600"
    }

    const getGrowthIcon = (growth) => {
        if (growth > 0) return "↑"
        if (growth < 0) return "↓"
        return "→"
    }

    return (
        <div className="min-h-screen bg-premium-background">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Quick Actions */}
                <div className="mb-8">
                    <div className="flex flex-wrap gap-3">
                        <a
                            href="/admin/users"
                            className="inline-flex items-center gap-2 bg-premium-primary hover:bg-opacity-90 text-white px-6 py-3 rounded-[--radius-button] font-semibold shadow-md hover:shadow-lg transition-all duration-200">
                            <span className="text-xl">👥</span>
                            Manage Users
                        </a>
                        <a
                            href="/admin/products"
                            className="inline-flex items-center gap-2 bg-premium-secondary hover:bg-opacity-90 text-white px-6 py-3 rounded-[--radius-button] font-semibold shadow-md hover:shadow-lg transition-all duration-200">
                            <span className="text-xl">📦</span>
                            Manage Products
                        </a>
                        <a
                            href="/admin/promotions"
                            className="inline-flex items-center gap-2 bg-premium-accent hover:bg-opacity-90 text-white px-6 py-3 rounded-[--radius-button] font-semibold shadow-md hover:shadow-lg transition-all duration-200">
                            <span className="text-xl">🎉</span>
                            Manage Promotions
                        </a>
                        <a
                            href="/"
                            className="inline-flex items-center gap-2 bg-white border-2 border-premium-primary text-premium-primary hover:bg-premium-primary hover:text-white px-6 py-3 rounded-[--radius-button] font-semibold shadow-md hover:shadow-lg transition-all duration-200">
                            <span className="text-xl">🏪</span>
                            View Store
                        </a>
                    </div>
                </div>

                {/* Page Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-premium-text mb-2">Admin Dashboard</h1>
                        <p className="text-gray-600">Key performance indicators and business metrics</p>
                    </div>

                    {/* Period Selector */}
                    <div className="flex gap-2 bg-white rounded-lg p-1 shadow-md">
                        {["day", "week", "month", "year"].map((period) => (
                            <button
                                key={period}
                                onClick={() => setSelectedPeriod(period)}
                                className={`px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200 ${
                                    selectedPeriod === period
                                        ? "bg-premium-primary text-white"
                                        : "text-gray-600 hover:bg-gray-100"
                                }`}>
                                {period.charAt(0).toUpperCase() + period.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Revenue KPIs - Unique Split Panel Design */}
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-premium-text mb-4">Revenue Metrics</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Total Revenue - Split Panel */}
                        <div className="relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]">
                            <div className="absolute inset-0 bg-gradient-to-br from-premium-primary via-orange-500 to-orange-400"></div>
                            <div className="absolute inset-0 bg-black opacity-5"></div>
                            <div className="relative p-6 text-white">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="text-sm font-medium opacity-90">Total Revenue</div>
                                    <div className="text-3xl">💰</div>
                                </div>
                                <div className="text-4xl font-bold mb-2">{formatCurrency(revenueKpis.totalRevenue)}</div>
                                <div className="flex items-center gap-2 text-xs opacity-80">
                                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                    All time
                                </div>
                            </div>
                        </div>

                        {/* Period Revenue - Glassmorphism */}
                        <div className="relative overflow-hidden rounded-2xl backdrop-blur-md bg-white/90 border-2 border-premium-secondary/30 shadow-xl hover:border-premium-secondary/60 transition-all duration-300">
                            <div className="absolute inset-0 bg-gradient-to-br from-premium-secondary/10 to-blue-500/10"></div>
                            <div className="relative p-6">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Revenue ({selectedPeriod})
                                    </div>
                                    <div className="w-12 h-12 bg-premium-secondary/20 rounded-full flex items-center justify-center">
                                        <span className="text-2xl">📈</span>
                                    </div>
                                </div>
                                <div className="text-3xl font-bold text-premium-secondary mb-2">
                                    {formatCurrency(revenueKpis.periodRevenue)}
                                </div>
                                <div className={`text-sm font-semibold ${getGrowthColor(revenueKpis.revenueGrowth)}`}>
                                    {getGrowthIcon(revenueKpis.revenueGrowth)} {Math.abs(revenueKpis.revenueGrowth).toFixed(1)}% vs
                                    previous
                                </div>
                            </div>
                        </div>

                        {/* Average Order Value - Hexagon Badge Style */}
                        <div className="relative bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 border-2 border-premium-accent/30 hover:border-premium-accent/60">
                            <div className="absolute top-4 right-4 w-20 h-20 bg-premium-accent/10 rounded-full -mr-10 -mt-10"></div>
                            <div className="relative">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-14 h-14 bg-premium-accent rounded-2xl flex items-center justify-center transform rotate-12 hover:rotate-0 transition-transform shadow-lg">
                                        <span className="text-2xl">🛒</span>
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-xs font-semibold text-gray-500 uppercase">Avg Order</div>
                                        <div className="text-2xl font-bold text-premium-accent">
                                            {formatCurrency(revenueKpis.averageOrderValue)}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-xs text-gray-400">
                                    This {selectedPeriod}: {formatCurrency(revenueKpis.periodAverageOrderValue)}
                                </div>
                            </div>
                        </div>

                        {/* Revenue Growth - Circular Progress Badge */}
                        <div className="relative bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300">
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                        Growth Rate
                                    </div>
                                    <div className={`text-3xl font-bold ${getGrowthColor(revenueKpis.revenueGrowth)}`}>
                                        {revenueKpis.revenueGrowth > 0 ? "+" : ""}
                                        {revenueKpis.revenueGrowth.toFixed(1)}%
                                    </div>
                                    <div className="text-xs text-gray-400 mt-2">vs previous {selectedPeriod}</div>
                                </div>
                                <div className="relative w-20 h-20">
                                    <svg className="transform -rotate-90 w-20 h-20">
                                        <circle
                                            cx="40"
                                            cy="40"
                                            r="36"
                                            stroke="#e5e7eb"
                                            strokeWidth="6"
                                            fill="none"
                                        />
                                        <circle
                                            cx="40"
                                            cy="40"
                                            r="36"
                                            stroke={
                                                revenueKpis.revenueGrowth > 0
                                                    ? "#10b981"
                                                    : revenueKpis.revenueGrowth < 0
                                                    ? "#ef4444"
                                                    : "#9ca3af"
                                            }
                                            strokeWidth="6"
                                            fill="none"
                                            strokeDasharray={`${Math.abs(revenueKpis.revenueGrowth) * 2.26} 226`}
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-2xl">📊</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Order & Customer KPIs - Banner & Badge Style */}
                <div className="mb-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Order Metrics */}
                    <div>
                        <h2 className="text-xl font-bold text-premium-text mb-4">Order Metrics</h2>
                        <div className="space-y-3">
                            {/* Total Orders - Full Width Banner */}
                            <div className="relative overflow-hidden bg-gradient-to-r from-premium-primary to-orange-500 rounded-2xl p-5 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.01]">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
                                <div className="relative flex items-center justify-between">
                                    <div>
                                        <div className="text-sm opacity-90 mb-1">Total Orders</div>
                                        <div className="text-3xl font-bold">{formatNumber(orderCustomerKpis.totalOrders)}</div>
                                        <div className="text-xs opacity-75 mt-1">
                                            {selectedPeriod}: {formatNumber(orderCustomerKpis.periodOrdersCount)}
                                        </div>
                                    </div>
                                    <div className="text-4xl opacity-80">📦</div>
                                </div>
                            </div>

                            {/* Pending & Completed - Side by Side Badges */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-xl p-4 hover:bg-yellow-100 transition-all duration-300">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-xl">⏳</span>
                                        <div className="text-xs font-bold text-yellow-700 uppercase">Pending</div>
                                    </div>
                                    <div className="text-2xl font-bold text-yellow-700">
                                        {formatNumber(orderCustomerKpis.pendingOrders)}
                                    </div>
                                    <div className="text-xs text-yellow-600 mt-1">Processing</div>
                                </div>
                                <div className="bg-green-50 border-l-4 border-green-500 rounded-xl p-4 hover:bg-green-100 transition-all duration-300">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-xl">✅</span>
                                        <div className="text-xs font-bold text-green-700 uppercase">Completed</div>
                                    </div>
                                    <div className="text-2xl font-bold text-green-700">
                                        {formatNumber(orderCustomerKpis.completedOrders)}
                                    </div>
                                    <div className="text-xs text-green-600 mt-1">Delivered</div>
                                </div>
                            </div>

                            {/* Order Growth - Pill Badge */}
                            <div className="bg-white rounded-2xl p-5 shadow-md border-l-4 border-premium-secondary hover:shadow-lg transition-all duration-300">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-xs font-semibold text-gray-500 uppercase mb-1">
                                            Order Growth
                                        </div>
                                        <div className={`text-2xl font-bold ${getGrowthColor(orderCustomerKpis.orderGrowth)}`}>
                                            {orderCustomerKpis.orderGrowth > 0 ? "+" : ""}
                                            {orderCustomerKpis.orderGrowth.toFixed(1)}%
                                        </div>
                                    </div>
                                    <div className="px-4 py-2 bg-premium-secondary/10 rounded-full">
                                        <span className="text-lg">📊</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Customer Metrics */}
                    <div>
                        <h2 className="text-xl font-bold text-premium-text mb-4">Customer Metrics</h2>
                        <div className="space-y-3">
                            {/* Total Customers - Navy Banner */}
                            <div className="relative overflow-hidden bg-premium-secondary rounded-2xl p-5 text-white shadow-lg">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16"></div>
                                <div className="relative flex items-center justify-between">
                                    <div>
                                        <div className="text-sm opacity-90 mb-1">Total Customers</div>
                                        <div className="text-3xl font-bold">{formatNumber(orderCustomerKpis.totalCustomers)}</div>
                                    </div>
                                    <div className="text-4xl opacity-80">👥</div>
                                </div>
                            </div>

                            {/* New & Active - Colored Badges */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-premium-accent/10 border-2 border-dashed border-premium-accent/40 rounded-xl p-4 hover:border-solid hover:bg-premium-accent/20 transition-all duration-300">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-xl">🆕</span>
                                        <div className="text-xs font-bold text-premium-accent uppercase">New</div>
                                    </div>
                                    <div className="text-2xl font-bold text-premium-accent">
                                        {formatNumber(orderCustomerKpis.periodCustomers)}
                                    </div>
                                    <div className="text-xs text-gray-600 mt-1">This {selectedPeriod}</div>
                                </div>
                                <div className="bg-green-50 border-l-4 border-green-500 rounded-xl p-4 hover:bg-green-100 transition-all duration-300">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-xl">✓</span>
                                        <div className="text-xs font-bold text-green-700 uppercase">Active</div>
                                    </div>
                                    <div className="text-2xl font-bold text-green-700">
                                        {formatNumber(orderCustomerKpis.activeCustomers)}
                                    </div>
                                    <div className="text-xs text-green-600 mt-1">Currently active</div>
                                </div>
                            </div>

                            {/* Retention - Circular Badge */}
                            <div className="bg-white rounded-2xl p-5 shadow-md hover:shadow-lg transition-all duration-300">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-xs font-semibold text-gray-500 uppercase mb-1">
                                            Retention Rate
                                        </div>
                                        <div className="text-2xl font-bold text-premium-secondary">
                                            {orderCustomerKpis.totalCustomers > 0
                                                ? ((orderCustomerKpis.activeCustomers / orderCustomerKpis.totalCustomers) * 100).toFixed(1)
                                                : 0}
                                            %
                                        </div>
                                    </div>
                                    <div className="w-16 h-16 bg-premium-secondary/10 rounded-full flex items-center justify-center">
                                        <span className="text-2xl">💎</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product & Inventory KPIs - Alert & Stat Block Style */}
                <div className="mb-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Product Metrics */}
                    <div>
                        <h2 className="text-xl font-bold text-premium-text mb-4">Product Metrics</h2>
                        <div className="space-y-3">
                            {/* Total Products - Gradient Banner */}
                            <div className="bg-gradient-to-r from-premium-primary/20 via-premium-primary/10 to-transparent rounded-2xl p-5 border-2 border-premium-primary/30 hover:border-premium-primary/50 transition-all duration-300">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-xs font-semibold text-premium-primary uppercase mb-1">
                                            Total Products
                                        </div>
                                        <div className="text-3xl font-bold text-premium-text">
                                            {formatNumber(productPromotionKpis.totalProducts)}
                                        </div>
                                    </div>
                                    <div className="text-4xl">📦</div>
                                </div>
                            </div>

                            {/* Stock Alerts - Alert Boxes */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-xl p-4 hover:bg-yellow-100 transition-all duration-300">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-2xl">⚠️</span>
                                        <div className="text-xs font-bold text-yellow-700 uppercase">Low Stock</div>
                                    </div>
                                    <div className="text-2xl font-bold text-yellow-700">
                                        {formatNumber(productPromotionKpis.lowStockProducts)}
                                    </div>
                                    <div className="text-xs text-yellow-600 mt-1">&lt; 10 units</div>
                                </div>
                                <div className="bg-red-50 border-l-4 border-red-500 rounded-xl p-4 hover:bg-red-100 transition-all duration-300">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-2xl">🚫</span>
                                        <div className="text-xs font-bold text-red-700 uppercase">Out of Stock</div>
                                    </div>
                                    <div className="text-2xl font-bold text-red-700">
                                        {formatNumber(productPromotionKpis.outOfStockProducts)}
                                    </div>
                                    <div className="text-xs text-red-600 mt-1">0 units</div>
                                </div>
                            </div>

                            {/* Inventory Value - Stat Block */}
                            <div className="bg-premium-secondary text-white rounded-2xl p-5 shadow-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-sm opacity-90 mb-1">Inventory Value</div>
                                        <div className="text-3xl font-bold">
                                            {formatCurrency(productPromotionKpis.totalInventoryValue / 1000)}k
                                        </div>
                                    </div>
                                    <div className="text-4xl opacity-80">💵</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Promotion Metrics */}
                    <div>
                        <h2 className="text-xl font-bold text-premium-text mb-4">Promotion Metrics</h2>
                        <div className="space-y-3">
                            {/* Active Promotions - Dashed Border Highlight */}
                            <div className="bg-premium-accent/10 border-2 border-dashed border-premium-accent/40 rounded-2xl p-5 hover:border-solid hover:bg-premium-accent/20 transition-all duration-300">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-xs font-semibold text-premium-accent uppercase mb-1">
                                            Active Promotions
                                        </div>
                                        <div className="text-3xl font-bold text-premium-accent">
                                            {formatNumber(productPromotionKpis.activePromotions)}
                                        </div>
                                    </div>
                                    <div className="text-4xl">🎉</div>
                                </div>
                            </div>

                            {/* Promo Usage - Side Panel */}
                            <div className="bg-white rounded-2xl p-5 shadow-md border-r-4 border-premium-primary hover:shadow-lg transition-all duration-300">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-xs font-semibold text-gray-500 uppercase mb-1">
                                            Promo Usage
                                        </div>
                                        <div className="text-2xl font-bold text-premium-primary">
                                            {formatNumber(productPromotionKpis.totalPromotions)}
                                        </div>
                                        <div className="text-xs text-gray-400 mt-1">Orders with codes</div>
                                    </div>
                                    <div className="w-14 h-14 bg-premium-primary/10 rounded-full flex items-center justify-center">
                                        <span className="text-2xl">🎫</span>
                                    </div>
                                </div>
                            </div>

                            {/* Effectiveness - Gradient Banner */}
                            <div className="bg-gradient-to-br from-premium-secondary to-blue-600 rounded-2xl p-5 text-white shadow-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-sm opacity-90 mb-1">Promotion Effectiveness</div>
                                        <div className="text-3xl font-bold">
                                            {orderCustomerKpis.totalOrders > 0
                                                ? ((productPromotionKpis.totalPromotions / orderCustomerKpis.totalOrders) * 100).toFixed(1)
                                                : 0}
                                            %
                                        </div>
                                    </div>
                                    <div className="text-4xl opacity-80">📊</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="mb-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Revenue Trend Chart */}
                    <div className="bg-white rounded-[--radius-card] shadow-md p-6">
                        <h3 className="text-lg font-bold text-premium-text mb-4">Revenue Trend (Last 7 Days)</h3>
                        <ResponsiveContainer
                            width="100%"
                            height={300}>
                            <AreaChart data={chartKpis.revenueChartData}>
                                <defs>
                                    <linearGradient
                                        id="colorRevenue"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1">
                                        <stop
                                            offset="5%"
                                            stopColor="#ff6b35"
                                            stopOpacity={0.8}
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor="#ff6b35"
                                            stopOpacity={0.1}
                                        />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#e5e7eb"
                                />
                                <XAxis
                                    dataKey="date"
                                    stroke="#6b7280"
                                    fontSize={12}
                                />
                                <YAxis
                                    stroke="#6b7280"
                                    fontSize={12}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "white",
                                        border: "1px solid #e5e7eb",
                                        borderRadius: "8px"
                                    }}
                                    formatter={(value) => formatCurrency(value)}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#ff6b35"
                                    strokeWidth={2}
                                    fill="url(#colorRevenue)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Order Status Chart */}
                    <div className="bg-white rounded-[--radius-card] shadow-md p-6">
                        <h3 className="text-lg font-bold text-premium-text mb-4">Orders by Status</h3>
                        <ResponsiveContainer
                            width="100%"
                            height={300}>
                            <PieChart>
                                <Pie
                                    data={chartKpis.orderStatusData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value">
                                    {chartKpis.orderStatusData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.color}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Sales by Category Chart */}
                    <div className="bg-white rounded-[--radius-card] shadow-md p-6">
                        <h3 className="text-lg font-bold text-premium-text mb-4">Sales by Category</h3>
                        <ResponsiveContainer
                            width="100%"
                            height={300}>
                                <BarChart data={chartKpis.categoryChartData}>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#e5e7eb"
                                />
                                <XAxis
                                    dataKey="category"
                                    stroke="#6b7280"
                                    fontSize={12}
                                    angle={-45}
                                    textAnchor="end"
                                    height={80}
                                />
                                <YAxis
                                    stroke="#6b7280"
                                    fontSize={12}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "white",
                                        border: "1px solid #e5e7eb",
                                        borderRadius: "8px"
                                    }}
                                    formatter={(value) => formatCurrency(value)}
                                />
                                <Bar
                                    dataKey="revenue"
                                    fill="#004e89"
                                    radius={[8, 8, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Customer Growth Chart */}
                    <div className="bg-white rounded-[--radius-card] shadow-md p-6">
                        <h3 className="text-lg font-bold text-premium-text mb-4">Customer Growth</h3>
                        <ResponsiveContainer
                            width="100%"
                            height={300}>
                                <LineChart data={chartKpis.customerGrowthData}>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#e5e7eb"
                                />
                                <XAxis
                                    dataKey="month"
                                    stroke="#6b7280"
                                    fontSize={12}
                                    angle={-45}
                                    textAnchor="end"
                                    height={80}
                                />
                                <YAxis
                                    stroke="#6b7280"
                                    fontSize={12}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "white",
                                        border: "1px solid #e5e7eb",
                                        borderRadius: "8px"
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="customers"
                                    stroke="#d81159"
                                    strokeWidth={3}
                                    dot={{ fill: "#d81159", r: 5 }}
                                    activeDot={{ r: 7 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Best Selling Products */}
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-premium-text mb-4">Top Selling Products</h2>
                    <div className="bg-white rounded-[--radius-card] shadow-md p-6">
                        {bestSellingError ? (
                            <div className="text-center py-8 text-red-600">{bestSellingError}</div>
                        ) : bestSellingProducts.length > 0 ? (
                            <div className="space-y-4">
                                {bestSellingProducts.map((product, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-4 bg-premium-background rounded-lg">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-premium-primary text-white rounded-full flex items-center justify-center font-bold">
                                                {index + 1}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-premium-text">{product.name}</div>
                                                <div className="text-sm text-gray-500">Units sold</div>
                                            </div>
                                        </div>
                                        <div className="text-2xl font-bold text-premium-primary">
                                            {formatNumber(product.quantity)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">No sales data available</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
