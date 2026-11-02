<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

abstract class Controller
{
    // Geeft $this->authorize(), zodat elke controller de policies op dezelfde manier gebruikt
    use AuthorizesRequests;
}
