<?php

return [
    // Configuration as defined in the docs: https://docs.sentry.io/platforms/javascript/guides/vue/configuration/
    'configuration' => [
        'enabled' => env('SENTRY_VUE_ENABLED', true),
        'allow_test_errors' => env('SENTRY_ALLOW_TEST_ERRORS', true),

        // Amount of errors to be logged to sentry (1.00 = 100%)
        'sampleRate' => env('SENTRY_VUE_SAMPLE_RATE', 100) / 100,
    ],


    // For integrations, see: https://docs.sentry.io/platforms/javascript/guides/vue/configuration/integrations/
    // If you want to add extra configuration to the constructor of an integration, change the `true` to an array like so:
    //  'replay' => [
    //      'maskAllText' => true,
    //      'blockAllMedia' => true,
    //  ],
    'integrations' => [
        'browserProfiling' => env('SENTRY_VUE_INTEGRATION_BROWSER_PROFILING', false),
        'browserTracing' => env('SENTRY_VUE_INTEGRATION_BROWSER_TRACING', false),
        'captureConsole' => env('SENTRY_VUE_INTEGRATION_CAPTURE_CONSOLE', false),
        'contextLines' => env('SENTRY_VUE_INTEGRATION_CONTEXT_LINES', false),
        'debug' => env('SENTRY_VUE_INTEGRATION_DEBUG', false),
        'extraErrorData' => env('SENTRY_VUE_INTEGRATION_EXTRA_ERROR_DATA', false),
        'httpClient' => env('SENTRY_VUE_INTEGRATION_HTTP_CLIENT', false),
        'moduleMetadata' => env('SENTRY_VUE_INTEGRATION_MODULE_METADATA', false),
        'rewriteFrames' => env('SENTRY_VUE_INTEGRATION_REWRITE_FRAMES', false),
        'replay' => env('SENTRY_VUE_INTEGRATION_REPLAY', false),
        'replayCanvas' => env('SENTRY_VUE_INTEGRATION_REPLAY_CANVAS', false),
        'reportingObserver' => env('SENTRY_VUE_INTEGRATION_REPORTING_OBSERVER', false),
        'sessionTiming' => env('SENTRY_VUE_INTEGRATION_SESSION_TIMING', false),
    ],
];
