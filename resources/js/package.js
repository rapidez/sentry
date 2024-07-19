if (import.meta.env.VITE_SENTRY_DSN !== undefined && window.config.sentry.enabled) {
    (() => import('./sentry.js'))()
}
