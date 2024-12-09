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
If *any* of them end up being undefined, Sentry will not be loaded and frontend errors will not be logged.

## License

GNU General Public License v3. Please see [License File](LICENSE) for more information.
