import { sendGet, sendPost } from "./generic"

const placeholder = ".json"

export const getSimpleObject = (object) => {
    return sendGet(object + placeholder)
}

export const postSimpleObject = (object, payload) => {
    return sendGet(object + placeholder, payload)
    //this will not work on a azure web app as the post verb is not allowed
    //return sendPost(object + placeholder, payload);
}
