export const getBaseApiUrl = () => {
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
        return "http://127.0.0.1:5000/"
    } else if (window.location.hostname.includes("windows")) {
        //Replace the URL with the URL of your deployed project
        return "https://wireframes****.z21.web.core.windows.net/api/"
    } else {
        return "/api/"
    }
}
