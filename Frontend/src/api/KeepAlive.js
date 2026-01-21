import { sendGet } from "./generic"

export const keepAlive = () => {
    return sendGet(`KeepAlive`)
}
