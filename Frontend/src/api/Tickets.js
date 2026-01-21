import { sendGet, sendPost } from "./generic"
import { getSimpleObject } from "./Object"

export const getTicketsObject = (object) => {
    return getSimpleObject(object)
}

export const getTicketsApi = (index, size, status) => {
    let url = `tickets?pageIndex=${index}&pageSize=${size}`
    if (status) {
        url += `&status=${status}`
    }
    return sendGet(url)
}

export const transferTicketApi = (data) => {
    return sendPost(`transfers`, data)
}

export const getLocationsApi = () => {
    return sendGet(`desk/locations`)
}

export const createTicketApi = (data) => {
    return sendPost(`desk/tickets`, data)
}
