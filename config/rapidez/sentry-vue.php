<?php

return [
    // Configuration as defined in the docs: https://docs.sentry.io/platforms/javascript/guides/vue/configuration/
    'configuration' => [
        'enabled' => env('SENTRY_VUE_ENABLED', true),

        // Amount of errors to be logged to sentry (1.00 = 100%)
        'sampleRate' => env('SENTRY_VUE_SAMPLE_RATE', 100) / 100,
        // Amount of transactions to be logged to sentry (1.00 = 100%)
        'tracesSampleRate' => env('SENTRY_VUE_TRACES_SAMPLE_RATE', 10) / 100,
        // Which backends should sentry link transactions to, by default it'll be the Rapidez and Magento backend
        'tracePropagationTargets' => explode(' ', env('SENTRY_VUE_TRACES_PROPAGATION_TARGETS', '') ),
        // Amount of replays to be logged to sentry when no error occurs (1.00 = 100%)
        // https://docs.sentry.io/platforms/javascript/guides/vue/session-replay/#recommended-production-sample-rates
        'replaysSessionSampleRate' => env('SENTRY_VUE_REPLAY_SAMPLE_RATE', 10) / 100,
        // Amount of replays to be logged to sentry when errors have occured (1.00 = 100%)
        'replaysOnErrorSampleRate' =>  env('SENTRY_VUE_ERROR_REPLAY_SAMPLE_RATE', 100) / 100,

        // Only report errors for matching urls, by default the shop url will be used
        'allowUrls' => explode(' ', env('SENTRY_VUE_ALLOW_URLS', '') ),

        // See the Sentry documentation: https://docs.sentry.io/platforms/javascript/guides/vue/configuration/filtering/#using-ignore-errors
        'ignoreErrors' => [
            'Composite reader could not read a token',
        ],

        // If any of the following variables/functions are nullish (null or undefined), do not enable Sentry.
        // This helps avoid errors that are only caused by extremely old browsers.
        'deprecations' => [
            // replaceAll has been implemented on all browsers since late 2020. Uncomment to use.
            // 'String.prototype.replaceAll',
        ],
    ],

    'filters' => [
        // This filters out any errors that come from scripts not hosted from the current host.
        // For example, you don't want to see any errors coming from user extensions.
        'filterExternalUrls' => true
    ],

    // For integrations, see: https://docs.sentry.io/platforms/javascript/guides/vue/configuration/integrations/
    // If you want to add extra configuration to the constructor of an integration, change the `true` to an array like so:
    //  'replay' => [
    //      'maskAllText' => true,
    //      'blockAllMedia' => true,
    //  ],
    'integrations' => [
        'browserProfiling' => env('VITE_SENTRY_VUE_INTEGRATION_BROWSER_PROFILING', false),
        'browserTracing' => env('VITE_SENTRY_VUE_INTEGRATION_BROWSER_TRACING', false),
        'captureConsole' => env('VITE_SENTRY_VUE_INTEGRATION_CAPTURE_CONSOLE', false),
        'contextLines' => env('VITE_SENTRY_VUE_INTEGRATION_CONTEXT_LINES', false),
        'extraErrorData' => env('VITE_SENTRY_VUE_INTEGRATION_EXTRA_ERROR_DATA', false),
        'graphqlClient' => env('VITE_SENTRY_VUE_INTEGRATION_GRAPHQL_CLIENT', false),
        'httpClient' => env('VITE_SENTRY_VUE_INTEGRATION_HTTP_CLIENT', false),
        'moduleMetadata' => env('VITE_SENTRY_VUE_INTEGRATION_MODULE_METADATA', false),
        'replayCanvas' => env('VITE_SENTRY_VUE_INTEGRATION_REPLAY_CANVAS', false),
        'replay' => env('VITE_SENTRY_VUE_INTEGRATION_REPLAY', false),
        'reportingObserver' => env('VITE_SENTRY_VUE_INTEGRATION_REPORTING_OBSERVER', false),
        'rewriteFrames' => env('VITE_SENTRY_VUE_INTEGRATION_REWRITE_FRAMES', false),
    ],
];
