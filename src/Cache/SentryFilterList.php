<?php

namespace Rapidez\Sentry\Cache;

use Illuminate\Support\Str;

class SentryFilterList
{
    /** @return array<string, string> */
    public function getCachedFilterList(): array
    {
        return cache()
            ->store('rapidez:multi')
            ->flexible(
                'sentry-filter-list',
                [now()->addHour(), now()->addDay()],
                $this->getFilterList(...),
            );
    }

    /** @return array<string, string> */
    protected function getFilterList(): array
    {
        $path = config('rapidez.sentry.filterList', null);

        if (! $path) {
            return [];
        }

        if (!Str::isUrl($path)) {
            return [];
        }

        $fileData = file_get_contents($path);
        if (! $fileData) {
            return [];
        }

        $jsonData = json_decode($fileData, true);
        if (! is_array($jsonData)) {
            return [];
        }

        return $jsonData;
    }
}
