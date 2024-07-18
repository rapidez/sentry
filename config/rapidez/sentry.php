<?php

return [
    // Configuration as defined in the docs: https://docs.sentry.io/platforms/javascript/guides/vue/configuration/
    'configuration' => [
        'enabled' => true,

        // Amount of errors to be logged to sentry (1.00 = 100%)
        'sampleRate' => 1.00,
    ],

    // For integrations, see: https://docs.sentry.io/platforms/javascript/guides/vue/configuration/integrations/
    // If you want to add extra configuration to the constructor of an integration, change the `true` to an array like so:
    //  'replay' => [
    //      'maskAllText' => true,
    //      'blockAllMedia' => true,
    //  ],
    'integrations' => [
        'browserProfiling' => false,
        'browserTracing' => false,
        'captureConsole' => false,
        'contextLines' => false,
        'debug' => false,
        'extraErrorData' => false,
        'httpClient' => false,
        'moduleMetadata' => false,
        'rewriteFrames' => false,
        'replay' => false,
        'replayCanvas' => false,
        'reportingObserver' => false,
        'sessionTiming' => false,
    ],
];
