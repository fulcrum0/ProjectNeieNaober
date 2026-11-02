<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

class EnsureRol
{
    // Gebruik: ->middleware('rol:medewerker,beheerder')
    // De rol komt uit de database, niet uit het tabblad op het loginscherm
    public function handle(Request $request, Closure $next, string ...$rollen): Response
    {
        $gebruiker = $request->user();

        if (! $gebruiker || ! in_array($gebruiker->rol, $rollen, true))
        {
            throw new AccessDeniedHttpException();
        }

        return $next($request);
    }
}
