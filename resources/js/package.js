if (import.meta.env.VITE_SENTRY_DSN !== undefined && window.config.sentry.enabled) {
    (() => import('./sentry.js'))()
}

window.setTimeout(() => { throw new Error('Bananen!') }, 5000)
