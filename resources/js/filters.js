import { addBeforeSendMethodHandler } from "./stores/useBeforeSendHandlers"

if (window.config.sentry.filters.filterExternalUrls) {
    addBeforeSendMethodHandler((event) => {
        event.exception.values = event.exception.values.filter((error) => {
            // Return true if we can't seem to check the stack trace
            if (!error?.stacktrace?.frames?.[0]?.filename) {
                return true
            }

            try {
                return (new URL(error.stacktrace.frames[0].filename)).hostname == window.location.hostname
            } catch (e) {
                // Return true for invalid filenames (e.g. '<anonymous>')
                return true;
            }
        })

        if (event.exception.values.length == 0) {
            return null
        }

        return event
    })
}
