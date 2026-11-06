<?php

namespace App\Http\Controllers;

use App\Http\Resources\OrganisatieResource;
use App\Models\Organisatie;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;

class OrganisatieController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $gebruiker = $request->user();

        $organisaties = Organisatie::query()
            ->when(! $gebruiker->IsBeheerder(), fn ($q) => $q->whereKey($gebruiker->organisatie_id))
            ->orderBy('id')
            ->get();

        return OrganisatieResource::collection($organisaties);
    }

    public function import(Request $request): AnonymousResourceCollection
    {
        $request->validate(['organisations' => ['required', 'array']]);

        $nieuw = collect();

        foreach ($request->input('organisations') as $rij)
        {
            $rij = VrijwilligerController::AlsTekst($rij);
            $validator = Validator::make($rij, [
                'name' => ['required', 'string', 'max:150', 'unique:organisaties,naam'],
                'phone' => ['nullable', 'string', 'max:30'],
                'email' => ['nullable', 'string', 'email', 'max:255'],
                'location' => ['nullable', 'string', 'max:100'],
                'type' => ['nullable', 'string', 'max:50'],
            ]);

            if ($validator->fails())
            {
                continue;
            }

            $nieuw->push(Organisatie::create([
                'naam' => trim($rij['name']),
                'telefoon' => $rij['phone'] ?? null,
                'email' => $rij['email'] ?? null,
                'locatie' => $rij['location'] ?? null,
                'soort' => $rij['type'] ?? null,
            ]));
        }

        return OrganisatieResource::collection($nieuw);
    }

    public function destroy(Request $request): Response
    {
        $request->validate(['ids' => ['required', 'array'], 'ids.*' => ['integer']]);

        Organisatie::query()->whereKey($request->input('ids'))->delete();

        return response()->noContent();
    }
}
