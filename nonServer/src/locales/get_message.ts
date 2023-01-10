let { messages } = require('./messages.json')
let { error_messages } = require('./error_messages.json')

export const message = (message: string, lang: string) => {
    return messages.hasOwnProperty(message) ? messages[message][lang] : message
}

export const error_message = (message: string, lang: string) => {
    return error_messages[message][lang] || message
}
