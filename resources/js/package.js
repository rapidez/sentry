if (import.meta.env.VITE_SENTRY_DSN !== undefined && window.config.sentry.enabled) {
    let deprecations = window.config.sentry.configuration.deprecations || []
    let deprecated = false
    deprecations.forEach((deprecation) => {
        let test = deprecation.split('.').reduce((value, next) => value?.[next] ?? null, window)
        if (test === null) {
            deprecated = true
        }
    })

    if (deprecated) {
        console.error('This browser is not supported. Please upgrade to a newer version.')
    } else {
        (() => import('./sentry.js'))()
    }
}
