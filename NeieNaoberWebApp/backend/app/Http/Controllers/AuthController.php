<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Resources\GebruikerResource;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(LoginRequest $request): GebruikerResource
    {
        $gelukt = Auth::guard('web')->attempt([
            'email' => strtolower(trim($request->input('email'))),
            'password' => $request->input('password'),
        ]);

        if (! $gelukt)
        {
            throw ValidationException::withMessages(['email' => __('auth.failed')]);
        }

        $request->session()->regenerate();

        return new GebruikerResource(Auth::guard('web')->user());
    }

    public function ik(Request $request): GebruikerResource
    {
        return new GebruikerResource($request->user());
    }

    public function logout(Request $request): Response
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->noContent();
    }
}
