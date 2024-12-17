let beforeSendMethodHandlers = []

export function addBeforeSendMethodHandler(handler) {
    beforeSendMethodHandlers.push(handler)
}

export function runBeforeSendMethodHandlers(event) {
    return beforeSendMethodHandlers.reduce((event, handler) => handler(event), event)
}
