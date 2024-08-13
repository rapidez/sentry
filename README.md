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

## License

GNU General Public License v3. Please see [License File](LICENSE) for more information.
