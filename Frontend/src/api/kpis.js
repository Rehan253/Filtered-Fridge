import { sendGet } from "./generic"

export const getRevenueMetrics = async (period) => {
    const query = period ? `?period=${encodeURIComponent(period)}` : ""
    return sendGet(`/kpis/revenue-metrics${query}`)
}

export const getOrderCustomerMetrics = async (period) => {
    const query = period ? `?period=${encodeURIComponent(period)}` : ""
    return sendGet(`/kpis/order-customer-metrics${query}`)
}

export const getProductPromotionMetrics = async () => {
    return sendGet("/kpis/product-promotion-metrics")
}

export const getDashboardCharts = async () => {
    return sendGet("/kpis/dashboard-charts")
}

export const getBestSellingProducts = async (limit = 5) => {
    return sendGet(`/kpis/best-selling-products?limit=${encodeURIComponent(limit)}`)
}
