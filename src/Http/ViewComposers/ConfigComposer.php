<?php

namespace Rapidez\Sentry\Http\ViewComposers;

use Illuminate\Support\Facades\Config;
use Illuminate\View\View;

class ConfigComposer
{
    public function compose(View $view)
    {
        Config::set('frontend.sentry.configuration', config('rapidez.sentry-vue.configuration'));
        Config::set('frontend.sentry.enabled', config('rapidez.sentry-vue.configuration.enabled'));
        Config::set('frontend.sentry.integrations', config('rapidez.sentry-vue.integrations'));
    }
}
