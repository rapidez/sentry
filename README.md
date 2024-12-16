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

## Testing

Errors thrown directly from the browser console don't get caught by Sentry, so you can test whether or not the frontend error reporting works by sending a test error in the browser console with:

```js
document.dispatchEvent(new Event('sentry-test-error'))
```

This functionality can be disabled in your `.env`:

```
SENTRY_VUE_ALLOW_TEST_ERRORS=false
```

## License

GNU General Public License v3. Please see [License File](LICENSE) for more information.
