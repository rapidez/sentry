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
    }

    public function boot()
    {
        $this->publishes([
            __DIR__.'/../config/rapidez/sentry-vue.php' => config_path('rapidez/sentry-vue.php'),
        ], 'rapidez-sentry-config');

        View::composer('rapidez::layouts.app', ConfigComposer::class);
    }
}
