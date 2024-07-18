<?php

namespace Rapidez\Sentry\Http\ViewComposers;

use Illuminate\Support\Facades\Config;
use Illuminate\View\View;

class ConfigComposer
{
    public function compose(View $view)
    {
        Config::set('frontend.sentry.configuration', config('rapidez.sentry.configuration'));
        Config::set('frontend.sentry.integrations', config('rapidez.sentry.integrations'));
    }
}
