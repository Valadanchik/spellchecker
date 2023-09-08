<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Services\SpellCheckService;
class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
       $this->app->bind(SpellCheckService::class, function ($app) {
              return new SpellCheckService();
          });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
