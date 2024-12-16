import * as Sentry from '@sentry/vue'
import { runBeforeSendMethodHandlers } from './stores/useBeforeSendHandlers'

// Collect all configured integrations
let integrations = Object.entries(window.config.sentry.integrations).map(([integration, value]) => {
    if (!value) {
        return
    }

    let integrationFunction = Sentry[integration + 'Integration']
    if(!integrationFunction) {
        return
    }

    return value === true ? integrationFunction() : integrationFunction(value)
}).filter((value) => value !== undefined)

// Set up the Sentry configuration
let configuration = Object.assign(
    {
        Vue,
        dsn: import.meta.env.VITE_SENTRY_DSN,
        environment: import.meta.env.MODE,
        integrations: integrations,
        beforeSend(event) {
            return runBeforeSendMethodHandlers(event)
        }
    },
    window.config.sentry.configuration
)

// Initialize Sentry
Sentry.init(configuration)

// Functionality to link a user to the Sentry messages
let setUser = (user) => {
    if(window.app.loggedIn) {
        Sentry.setUser({
            id: user.id,
            username: [user.firstname, user.lastname].filter(Boolean).join(' '),
            email: user.email,
        })
    } else {
        Sentry.setUser(null)
    }

    // Add an extra 'logged_in' tag to errors
    Sentry.setTag('logged_in', window.app.loggedIn)
}

document.addEventListener('vue:loaded', async () => {
    window.app.$on(['logged-in', 'logout'], () => setUser(window.app.user))
    setUser(window.app.user)
})

// Allow test errors to be sent from the browser console with `document.dispatchEvent(new Event('sentry-test-error'))`
if(window.config.sentry.configuration.allow_test_errors) {
    document.addEventListener('sentry-test-error', () => {
        throw new Error('Sentry test error')
    })
}
