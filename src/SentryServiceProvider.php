<?php

namespace Rapidez\Sentry;

use Illuminate\Support\Facades\View;
use Illuminate\Support\ServiceProvider;
use Rapidez\Sentry\Http\ViewComposers\ConfigComposer;

class SentryServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->mergeConfigFrom(__DIR__.'/../config/rapidez/sentry-vue.php', 'rapidez.sentry-vue');
        $this->mergeConfigFrom(__DIR__.'/../config/rapidez/sentry.php', 'rapidez.sentry');
    }

    public function boot()
    {
        $this->bootComposers()
            ->bootIgnoreLists()
            ->bootPublishes();
    }

    protected function bootComposers(): static
    {
        View::composer('rapidez::layouts.app', ConfigComposer::class);

        return $this;
    }

    protected function bootIgnoreLists(): static
    {
        $filterList = resolve(\Rapidez\Sentry\Cache\SentryFilterList::class)->getCachedFilterList();

        $vueList = collect($filterList)
            ->pluck('message')
            ->merge(config('rapidez.sentry-vue.configuration.ignoreErrors', []))
            ->whereNotNull()
            ->unique();

        $laravelList = collect($filterList)
            ->merge(config('rapidez.sentry.ignoreErrors', []))
            ->whereNotNull()
            ->unique();

        config([
            'rapidez.sentry-vue.configuration.ignoreErrors' => $vueList->values()->all(),
            'rapidez.sentry.ignoreErrors' => $laravelList->values()->all(),
        ]);

        return $this;
    }

    protected function bootPublishes(): static
    {
        $this->publishes([
            __DIR__.'/../config/rapidez/sentry-vue.php' => config_path('rapidez/sentry-vue.php'),
            __DIR__.'/../config/rapidez/sentry.php' => config_path('rapidez/sentry.php'),
        ], 'rapidez-sentry-config');

        return $this;
    }
}
