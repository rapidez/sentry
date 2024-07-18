# Rapidez Sentry
This package integrates Sentry Vue into a rapidez project.

## Installation

```
composer require rapidez/sentry
```

You will need to add the following line to your .env:

```
VITE_SENTRY_DSN=[your sentry DSN url here]
```

Setting your Sentry DSN to be public like this is [safe](https://docs.sentry.io/concepts/key-terms/dsn-explainer/).

## Configuration

You can publish the config with:
```
php artisan vendor:publish --tag=rapidez-sentry-config
```

## License

GNU General Public License v3. Please see [License File](LICENSE) for more information.
