# Rapidez Sentry
This package integrates Sentry Laravel and Sentry Vue into a Rapidez project.

## Installation

```
yarn add @sentry/vue --dev
composer require rapidez/sentry
```

You will need to add the following lines to your .env:

```
SENTRY_LARAVEL_DSN=___PUBLIC_DSN___
VITE_SENTRY_DSN="${SENTRY_LARAVEL_DSN}"
```

You don't need the `VITE_SENTRY_DSN` line if you don't want to use the Sentry Vue package. Note that setting your Sentry DSN to be public like this is [safe](https://docs.sentry.io/concepts/key-terms/dsn-explainer/).

You can disable the Vue package in your .env by adding:

```
SENTRY_VUE_ENABLED=false
```

## Configuration

You can publish the (vue-specific) config with:
```
php artisan vendor:publish --tag=rapidez-sentry-config
```

Some basic configuration settings for Vue can also be set in your env, for example:
```
SENTRY_VUE_SAMPLE_RATE=50
SENTRY_VUE_INTEGRATION_REPLAY=true
```

Check out the [sentry/sentry-laravel readme](https://github.com/getsentry/sentry-laravel) for configuration of the laravel package.

### Hooking into the beforeSend method

This package provides a way to hook into [the beforeSend method](https://docs.sentry.io/platforms/javascript/guides/vue/configuration/filtering/#using-before-send) by using the `useBeforeSendHandlers` store. This can be used in the following way:

```js
import { addBeforeSendMethodHandler } from 'Vendor/rapidez/sentry/resources/js/stores/useBeforeSendHandlers'

[...]

addBeforeSendMethodHandler((event) => {
    if (event.user) {
        delete event.user.email
    }
    return event
})
```

Note that event handlers will be run in the order that they have been added, as changes made within these handlers need to be carried over.

To drop the event completely, you can return `null`. Note that this means you need to always return the event if you don't want it to be dropped.

## Testing

Errors thrown directly from the browser console don't get caught by Sentry, so you can test whether or not the frontend error reporting works by sending a test error in the browser console with:

```js
document.dispatchEvent(new Event('sentry-test-error'))
```

This functionality can be disabled in your `.env`:

```
SENTRY_VUE_ALLOW_TEST_ERRORS=false
```

## Deprecating older browsers

You may end up having a lot of errors caused by people using really old browsers that don't support some more modern widely supported functions. To combat this, you can use the `deprecations` section in the configuration file:

```php
'deprecations' => [
    'String.prototype.replaceAll',
    'Array.prototype.at',
]
```

Before initializing Sentry, this package will first check whether any of the given variables/functions are nullish (null or undefined). These are checked with `window` as the base variable.  
If *any* of them end up being nullish, Sentry will not be loaded and frontend errors will not be logged.

## Filtering errors

You can use the standard Sentry configuration for `ignoreErrors` as described in the [sentry documentation](https://docs.sentry.io/platforms/javascript/guides/vue/configuration/filtering/#using-ignore-errors).

This can be done in the configuration file like so:

```php
'ignoreErrors' => [
    'AbortError',
    '_isDestroyed',
],
```

## Linking frontend errors to Magento Errors (Distributed Tracing)

For full observability you may want to connect your frontend errors and sessions to the thrown Magento errors.
This could give benefits like showing where in a Replay an error occurred in Magento.

For this you must first install the [Magento2 Sentry module](https://github.com/justbetter/magento2-sentry)

Then add the following to your Rapidez `.env`

```env
SENTRY_VUE_SAMPLE_RATE=10 # A percentage is required here (0 is allowed as well)
SENTRY_VUE_INTEGRATION_BROWSER_TRACING=true
SENTRY_VUE_INTEGRATION_HTTP_CLIENT=true
SENTRY_VUE_INTEGRATION_GRAPHQL_CLIENT=true
SENTRY_VUE_INTEGRATION_REPLAY=true
```

With this enabled you must make sure the `sentry-trace,baggage,traceparent` headers are allowed in you Magento's (and if applicable Rapidez') CORS config

Then in Magento make sure to enable "Tracing", "Performance tracking", and to set a "Traces sample rate" (0 is allowed)

With this set up your Rapidez and Magento Sentry should be linked with each other.

## License

GNU General Public License v3. Please see [License File](LICENSE) for more information.
