import axios from "axios"
import { getBaseApiUrl } from "../constants/Urls"
import { formatErrorMessage } from "../constants/Utils"

export const sendPost = async (url, body, baseUrl) => {
    var fullUrl
    if (url.includes("placeholder")) {
        fullUrl = "/placeholder-data/" + url.split("/")[1]
    } else {
        fullUrl = (baseUrl === undefined ? getBaseApiUrl() : baseUrl) + url
    }
    try {
        setHeader()
        var response = await axios.post(fullUrl, body)
        return handleResponse(response)
    } catch (error) {
        return handleResponse(error.response)
    }
}

export const sendGet = async (url, baseUrl) => {
    var fullUrl
    if (url.includes("placeholder")) {
        fullUrl = "/placeholder-data/" + url.split("/")[1]
    } else {
        fullUrl = (baseUrl === undefined ? getBaseApiUrl() : baseUrl) + url
    }
    try {
        setHeader()
        var response = await axios.get(fullUrl)
        return handleResponse(response)
    } catch (error) {
        return handleResponse(error.response)
    }
}

export const sendGetFile = async (url, baseUrl) => {
    var fullUrl = (baseUrl === undefined ? getBaseApiUrl() : baseUrl) + url
    try {
        setHeader()
        var response = await axios.get(fullUrl, { responseType: "blob" })
        return response
    } catch (error) {
        return handleResponse(error.response)
    }
}

export const uploadFile = async (url, file, baseUrl) => {
    var fullUrl = (baseUrl === undefined ? getBaseApiUrl() : baseUrl) + url
    try {
        var formData = new FormData()
        formData.append("file", file)
        var response = await axios.post(fullUrl, formData)
        return handleResponse(response)
    } catch (error) {
        return handleResponse(error.response)
    }
}

export const uploadFiles = async (url, files, baseUrl) => {
    var fullUrl = (baseUrl === undefined ? getBaseApiUrl() : baseUrl) + url
    try {
        var formData = new FormData()
        files.forEach((file, index) => {
            formData.append("files", file, file.name)
        })
        var response = await axios.post(fullUrl, formData)
        return handleResponse(response)
    } catch (error) {
        return handleResponse(error.response)
    }
}

export const sendPut = async (url, body, baseUrl) => {
    var fullUrl = (baseUrl === undefined ? getBaseApiUrl() : baseUrl) + url
    try {
        setHeader()
        var response = await axios.put(fullUrl, body)
        return handleResponse(response)
    } catch (error) {
        return handleResponse(error.response)
    }
}

export const sendPatch = async (url, body, baseUrl) => {
    var fullUrl = (baseUrl === undefined ? getBaseApiUrl() : baseUrl) + url
    try {
        setHeader()
        var response = await axios.patch(fullUrl, body)
        return handleResponse(response)
    } catch (error) {
        return handleResponse(error.response)
    }
}

export const sendDelete = async (url, body, baseUrl) => {
    var fullUrl = (baseUrl === undefined ? getBaseApiUrl() : baseUrl) + url
    try {
        setHeader()
        var response = await axios.delete(fullUrl, { data: body })
        return handleResponse(response)
    } catch (error) {
        return handleResponse(error.response)
    }
}

const setHeader = () => {
    const accessToken = localStorage.getItem("token") || sessionStorage.getItem("ACCESS_TOKEN")

    axios.defaults.withCredentials = true
    axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*"
    if (accessToken) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`
    }
}

const handleResponse = (response) => {
    // Handle cases where response is undefined (network error, no response from server)
    if (!response) {
        return {
            status: "Error",
            errorMessage: "Network error or no response from server"
        }
    }

    if (response.status === 200 || response.status === 204 || response.status === 201) {
        if (response.data === undefined) {
            return response
        }

        return response.data
    } else {
        const errorMessage = formatErrorMessage(
            response.data?.errors || response.data?.message || "An unknown error occurred"
        )
        // alert(errorMessage)
        return {
            status: "Error",
            errorMessage: errorMessage
        }
    }
}
