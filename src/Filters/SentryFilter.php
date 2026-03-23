<?php

namespace Rapidez\Sentry\Filters;

use Sentry\Event;
use Sentry\EventHint;

class SentryFilter
{
    public static function beforeSend(Event $event, EventHint $hint): ?Event
    {
        $filterList = resolve(\Rapidez\Sentry\Cache\SentryFilterList::class)->getCachedFilterList();

        $messagesToFilter = collect($filterList)->pluck('message')->whereNotNull();
        $exceptionsToFilter = collect($filterList)->pluck('exception')->whereNotNull();

        if ($messagesToFilter->contains(fn($message) => str_contains($event->getMessage(), $message))) {
            return null;
        }

        if ($exceptionsToFilter->contains(fn($exception) => $hint->exception instanceof $exception)) {
            return null;
        }

        return $event;
    }
}
