import {
    init as initSentry,
    setUser as sentrySetUser,
    setTag,
    browserProfilingIntegration,
    browserTracingIntegration,
    captureConsoleIntegration,
    contextLinesIntegration,
    extraErrorDataIntegration,
    httpClientIntegration,
    graphqlClientIntegration,
    moduleMetadataIntegration,
    rewriteFramesIntegration,
    replayIntegration,
    replayCanvasIntegration,
    reportingObserverIntegration
} from '@sentry/vue'

import { runBeforeSendMethodHandlers } from './stores/useBeforeSendHandlers'
import './filters.js'
import { sanitizeNetworkEvent } from './sanitization.js'

let initialized = false
let init = (app) => {
    initialized = true;
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
            integrations: collectIntegrations(window.config.sentry.integrations),
            beforeSend: runBeforeSendMethodHandlers,
        },
        window.config.sentry.configuration
    )

    // Initialize Sentry
    initSentry(configuration)
}

let collectIntegrations = (integrationsConfig) => {
    integrationsConfig.replay = {
        beforeAddRecordingEvent: (event) => {
            if (
                event?.data?.payload?.data?.request?.body &&
                event?.data?.payload?.data?.response?.body
            ) {
                return sanitizeNetworkEvent(event);
            }

            return event;
        },
        ...(integrationsConfig.replay || {}),
    }
    // Collect all configured integrations
    let integrations = Object.entries({
        browserProfiling: import.meta.env.VITE_SENTRY_VUE_INTEGRATION_BROWSER_PROFILING === 'true' ? browserProfilingIntegration : null,
        browserTracing: import.meta.env.VITE_SENTRY_VUE_INTEGRATION_BROWSER_TRACING === 'true' ? browserTracingIntegration : null,
        captureConsole: import.meta.env.VITE_SENTRY_VUE_INTEGRATION_CAPTURE_CONSOLE === 'true' ? captureConsoleIntegration : null,
        contextLines: import.meta.env.VITE_SENTRY_VUE_INTEGRATION_CONTEXT_LINES === 'true' ? contextLinesIntegration : null,
        extraErrorData: import.meta.env.VITE_SENTRY_VUE_INTEGRATION_EXTRA_ERROR_DATA === 'true' ? extraErrorDataIntegration : null,
        graphqlClient: import.meta.env.VITE_SENTRY_VUE_INTEGRATION_GRAPHQL_CLIENT === 'true' ? graphqlClientIntegration : null,
        httpClient: import.meta.env.VITE_SENTRY_VUE_INTEGRATION_HTTP_CLIENT === 'true' ? httpClientIntegration : null,
        moduleMetadata: import.meta.env.VITE_SENTRY_VUE_INTEGRATION_MODULE_METADATA === 'true' ? moduleMetadataIntegration : null,
        replayCanvas: import.meta.env.VITE_SENTRY_VUE_INTEGRATION_REPLAY_CANVAS === 'true' ? replayCanvasIntegration : null,
        replay: import.meta.env.VITE_SENTRY_VUE_INTEGRATION_REPLAY === 'true' ? replayIntegration : null,
        reportingObserver: import.meta.env.VITE_SENTRY_VUE_INTEGRATION_REPORTING_OBSERVER === 'true' ? reportingObserverIntegration : null,
        rewriteFrames: import.meta.env.VITE_SENTRY_VUE_INTEGRATION_REWRITE_FRAMES === 'true' ? rewriteFramesIntegration : null,
    })
        .filter(([configName, integration]) => integration && integrationsConfig[configName] !== false)
        .map(([configName, integration]) => integration(integrationsConfig[configName] === true ? undefined : integrationsConfig[configName]))

    return integrations;
}

// Functionality to link a user to the Sentry messages
let setUser = (user) => {
    if(user.is_logged_in) {
        sentrySetUser({
            id: user.id,
            username: [user.firstname, user.lastname].filter(Boolean).join(' '),
            email: user.email,
        })
    } else {
        sentrySetUser(null)
    }

    // Add an extra 'logged_in' tag to errors
    setTag('logged_in', user.is_logged_in)
}

if (window.app) {
    init(window.app);
}

document.addEventListener('vue:loaded', async (event) => {
    if (!initialized) {
        init(event.details.vue);
    }
    window.$on('logged-in', () => setUser(window.app.config.globalProperties.user.value))
    window.$on('logged-out', () => setUser(window.app.config.globalProperties.user.value))
    window.$on('checkout-success', (order) => setTag('order_increment_id', order?.number))
    setUser(window.app.config.globalProperties.user.value)
})

if(import.meta.env.VITE_SENTRY_VUE_ALLOW_TEST_ERRORS !== 'false') {
    // Allow test errors to be sent from the browser console with `document.dispatchEvent(new Event('sentry-test-error'))`
    document.addEventListener('sentry-test-error', () => {
        throw new Error('Sentry test error')
    })
}
