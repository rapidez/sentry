import * as Sentry from '@sentry/vue'
import { runBeforeSendMethodHandlers } from './stores/useBeforeSendHandlers'
import './filters.js'

let initialized = false
let init = (app) => {
    initialized = true;
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

    window.config.sentry.configuration.allowUrls.push(window.config.base_url)
    window.config.sentry.configuration.tracePropagationTargets.push(window.config.base_url)
    window.config.sentry.configuration.tracePropagationTargets.push(window.config.magento_url)

    window.config.sentry.configuration.allowUrls = window.config.sentry.configuration.allowUrls.filter((a) => a)
    window.config.sentry.configuration.tracePropagationTargets = window.config.sentry.configuration.tracePropagationTargets.filter((a) => a)

    // Set up the Sentry configuration
    let configuration = Object.assign(
        {
            app,
            dsn: import.meta.env.VITE_SENTRY_DSN,
            environment: import.meta.env.MODE,
            integrations: integrations,
            beforeSend: runBeforeSendMethodHandlers,
        },
        window.config.sentry.configuration
    )

    // Initialize Sentry
    Sentry.init(configuration)
}

// Functionality to link a user to the Sentry messages
let setUser = (user) => {
    if(user.is_logged_in) {
        Sentry.setUser({
            id: user.id,
            username: [user.firstname, user.lastname].filter(Boolean).join(' '),
            email: user.email,
        })
    } else {
        Sentry.setUser(null)
    }

    // Add an extra 'logged_in' tag to errors
    Sentry.setTag('logged_in', user.is_logged_in)
}

if (window.app) {
    init(window.app);
}

document.addEventListener('vue:loaded', async (event) => {
    if (!initialized) {
        init(event.details.vue);
    }
    window.$on(['logged-in', 'logged-out'], () => setUser(window.app.config.globalProperties.user.value))
    setUser(window.app.config.globalProperties.user.value)
})

// Allow test errors to be sent from the browser console with `document.dispatchEvent(new Event('sentry-test-error'))`
if(window.config.sentry.configuration.allow_test_errors) {
    document.addEventListener('sentry-test-error', () => {
        throw new Error('Sentry test error')
    })
}
