import { sendGet, sendPost } from "./generic"

export const getMyInvoices = async () => {
    return sendGet("invoices/me")
}

export const getInvoiceById = async (invoiceId) => {
    return sendGet(`invoices/${invoiceId}`)
}

export const createInvoice = async (payload) => {
    return sendPost("invoices/", payload)
}

export const addInvoiceItem = async (invoiceId, payload) => {
    return sendPost(`invoices/${invoiceId}/items`, payload)
}
