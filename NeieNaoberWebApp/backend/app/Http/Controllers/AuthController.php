<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\WachtwoordRequest;
use App\Http\Resources\GebruikerResource;
use App\Models\Gebruiker;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(LoginRequest $request): GebruikerResource
    {
        $gelukt = Auth::guard('web')->attempt([
            'email' => strtolower(trim($request->input('email'))),
            'password' => $request->input('wachtwoord'),
            'actief' => true,
        ]);

        if (! $gelukt)
        {
            // Altijd dezelfde melding, zodat niemand kan zien of een e-mailadres bestaat
            throw ValidationException::withMessages(['email' => __('auth.failed')]);
        }

        // Nieuwe sessie-id na inloggen, tegen session fixation
        $request->session()->regenerate();

        return new GebruikerResource(Auth::guard('web')->user()->load('organisatie'));
    }

    public function ik(Request $request): GebruikerResource
    {
        return new GebruikerResource($request->user()->load('organisatie'));
    }

    public function logout(Request $request): Response
    {
        Auth::guard('web')->logout();

        // Sessie weg en nieuw XSRF-token: uitloggen werkt meteen (TO 2)
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->noContent();
    }

    // Wachtwoord maken via de link uit de uitnodiging (of uit "wachtwoord vergeten")
    public function wachtwoord(WachtwoordRequest $request): JsonResponse
    {
        $status = Password::reset(
            [
                'email' => strtolower(trim($request->input('email'))),
                'token' => $request->input('token'),
                'password' => $request->input('wachtwoord'),
            ],
            function (Gebruiker $gebruiker, string $wachtwoord)
            {
                $gebruiker->forceFill(['wachtwoord' => $wachtwoord])->save();
                event(new PasswordReset($gebruiker));
            }
        );

        if ($status !== Password::PASSWORD_RESET)
        {
            throw ValidationException::withMessages(['token' => __($status)]);
        }

        return response()->json(['message' => __($status)]);
    }

    // Could: nieuwe link aanvragen. Altijd hetzelfde antwoord, ook als het adres niet bestaat.
    public function wachtwoordVergeten(Request $request): JsonResponse
    {
        $request->validate(['email' => ['required', 'string', 'email']]);

        Password::sendResetLink(['email' => strtolower(trim($request->input('email'))), 'actief' => true]);

        return response()->json(['message' => __(Password::RESET_LINK_SENT)]);
    }
}
