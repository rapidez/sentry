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
    // Collect all configured integrations
    let integrations = []

    // These ifs make tree shaking possible, they will get compiled away.
    import.meta.env.VITE_SENTRY_VUE_INTEGRATION_BROWSER_PROFILING === 'true' ? integrations.push(browserProfilingIntegration()) : null
    import.meta.env.VITE_SENTRY_VUE_INTEGRATION_BROWSER_TRACING === 'true' ? integrations.push(browserTracingIntegration(integrationsConfig.browserTracing === true ? null : integrationsConfig.browserTracing)) : null
    import.meta.env.VITE_SENTRY_VUE_INTEGRATION_CAPTURE_CONSOLE === 'true' ? integrations.push(captureConsoleIntegration(integrationsConfig.captureConsole === true ? null : integrationsConfig.captureConsole)) : null
    import.meta.env.VITE_SENTRY_VUE_INTEGRATION_CONTEXT_LINES === 'true' ? integrations.push(contextLinesIntegration(integrationsConfig.contextLines === true ? null : integrationsConfig.contextLines)) : null
    import.meta.env.VITE_SENTRY_VUE_INTEGRATION_EXTRA_ERROR_DATA === 'true' ? integrations.push(extraErrorDataIntegration(integrationsConfig.extraErrorData === true ? null : integrationsConfig.extraErrorData)) : null
    import.meta.env.VITE_SENTRY_VUE_INTEGRATION_GRAPHQL_CLIENT === 'true' ? integrations.push(graphqlClientIntegration(integrationsConfig.graphqlClient === true ? null : integrationsConfig.graphqlClient)) : null
    import.meta.env.VITE_SENTRY_VUE_INTEGRATION_HTTP_CLIENT === 'true' ? integrations.push(httpClientIntegration(integrationsConfig.httpClient === true ? null : integrationsConfig.httpClient)) : null
    import.meta.env.VITE_SENTRY_VUE_INTEGRATION_MODULE_METADATA === 'true' ? integrations.push(moduleMetadataIntegration()) : null
    import.meta.env.VITE_SENTRY_VUE_INTEGRATION_REPLAY_CANVAS === 'true' ? integrations.push(replayCanvasIntegration()) : null
    import.meta.env.VITE_SENTRY_VUE_INTEGRATION_REPLAY === 'true' ? integrations.push(replayIntegration()) : null
    import.meta.env.VITE_SENTRY_VUE_INTEGRATION_REPORTING_OBSERVER === 'true' ? integrations.push(reportingObserverIntegration(integrationsConfig.reportingObserver === true ? null : integrationsConfig.reportingObserver)) : null
    import.meta.env.VITE_SENTRY_VUE_INTEGRATION_REWRITE_FRAMES === 'true' ? integrations.push(rewriteFramesIntegration(integrationsConfig.rewriteFrames === true ? null : integrationsConfig.rewriteFrames)) : null

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
    setUser(window.app.config.globalProperties.user.value)
})

if(import.meta.env.VITE_SENTRY_VUE_ALLOW_TEST_ERRORS !== 'false') {
    // Allow test errors to be sent from the browser console with `document.dispatchEvent(new Event('sentry-test-error'))`
    document.addEventListener('sentry-test-error', () => {
        throw new Error('Sentry test error')
    })
}
