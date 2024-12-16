let beforeSendMethodHandlers = []

export async function addBeforeSendMethodHandler(promise) {
    beforeSendMethodHandlers.push(promise)
}

export async function runBeforeSendMethodHandlers(event) {
    return beforeSendMethodHandlers.reduce((event, handler) => handler(event) || event, event)
}
