export function sanitizeNetworkEvent(event) {
    for (const headerToSanitize of [
        'Authorization',
        'X-CSRF-Token',
        'Cookie',
        'Set-Cookie',
        ...(import.meta.env.VITE_SENTRY_SANITIZE_HEADERS || '').split(/ |,/),
    ]) {
        if (!headerToSanitize) {
            continue;
        }
        if (event.data.payload.data.request.headers[headerToSanitize]) {
            event.data.payload.data.request.headers[headerToSanitize] = '[Filtered]'
        }
        if (event.data.payload.data.response.headers[headerToSanitize]) {
            event.data.payload.data.response.headers[headerToSanitize] = '[Filtered]'
        }
    }

    let performSanitization = (body) => {
        const originalType = typeof body;
        if (originalType === 'object') {
            try {
                body = JSON.stringify(body)
            } catch (e) {
                // Rather safe than sorry, if it fails we empty the response body
                body = '{}'
            }
        }

        for (const jsonValueToSanitize of [
            'password',
            'token',
            'mask',
            'cart_id',
            'postcode',
            'city',
            'customer_telephone',
            'telephone',
            'fax',
            'vat_id',
            'po_number',
            'pay_return_url',
            'pay_redirect_url',
            'iban',
            ...(import.meta.env.VITE_SENTRY_SANITIZE_JSON_VALUES || '').split(/ |,/),
        ]) {
            if (!jsonValueToSanitize) {
                continue;
            }
            const re = new RegExp(`("?${jsonValueToSanitize}"?: ?")([^"]+)(")`, 'g')
            requestAndResponse.request.body = requestAndResponse.request.body?.replaceAll(re, '$1[Filtered]$3')
            body = body?.replaceAll(re, '$1[Filtered]$3')
        }

        if (originalType === 'object') {
            return JSON.parse(body)
        }

        return body
    }

    event.data.payload.data.request.body = performSanitization(event.data.payload.data.request.body)
    event.data.payload.data.response.body = performSanitization(event.data.payload.data.response.body)

    return event;
}
