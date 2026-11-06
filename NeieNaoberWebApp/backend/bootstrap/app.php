<?php

use App\Http\Middleware\EnsureRol;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Exceptions\ThrottleRequestsException;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void
    {
        $middleware->statefulApi();

        $middleware->alias([
            'rol' => EnsureRol::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void
    {
        $isApi = fn (Request $request) => $request->is('api/*') || $request->expectsJson();

        $exceptions->shouldRenderJsonWhen($isApi);

        $exceptions->render(function (ValidationException $e, Request $request) use ($isApi)
        {
            if ($isApi($request))
            {
                return response()->json([
                    'message' => 'Niet alle velden zijn goed ingevuld.',
                    'errors' => $e->errors(),
                ], $e->status);
            }
        });

        $exceptions->render(function (AuthenticationException $e, Request $request) use ($isApi)
        {
            if ($isApi($request))
            {
                return response()->json(['message' => 'U bent niet ingelogd.'], 401);
            }
        });

        $exceptions->render(function (AccessDeniedHttpException $e, Request $request) use ($isApi)
        {
            if ($isApi($request))
            {
                return response()->json(['message' => 'U mag dit niet doen.'], 403);
            }
        });

        $exceptions->render(function (NotFoundHttpException $e, Request $request) use ($isApi)
        {
            if ($isApi($request))
            {
                return response()->json(['message' => 'Dit record bestaat niet.'], 404);
            }
        });

        $exceptions->render(function (HttpException $e, Request $request) use ($isApi)
        {
            if ($e->getStatusCode() === 419 && $isApi($request))
            {
                return response()->json(['message' => 'Uw sessie is verlopen. Probeer het opnieuw.'], 419);
            }
        });

        $exceptions->render(function (ThrottleRequestsException $e, Request $request) use ($isApi)
        {
            if ($isApi($request))
            {
                return response()->json(['message' => 'Te vaak geprobeerd. Wacht even en probeer het opnieuw.'], 429, $e->getHeaders());
            }
        });
    })->create();
