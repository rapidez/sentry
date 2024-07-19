# Rapidez Sentry
This package integrates Sentry Vue into a Rapidez project.

## Installation

```
composer require rapidez/sentry
```

You will need to add the following line to your .env:

```
VITE_SENTRY_DSN=[your sentry DSN url here]
```

Setting your Sentry DSN to be public like this is [safe](https://docs.sentry.io/concepts/key-terms/dsn-explainer/).

You can also disable this package in your .env by adding:

```
SENTRY_ENABLED=false
```

## Configuration

You can publish the config with:
```
php artisan vendor:publish --tag=rapidez-sentry-config
```

Some basic configuration settings can also be set in your env, for example:
```
SENTRY_SAMPLE_RATE=50
SENTRY_INTEGRATION_REPLAY=true
```

## License

GNU General Public License v3. Please see [License File](LICENSE) for more information.
