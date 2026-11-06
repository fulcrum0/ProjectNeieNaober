<?php

namespace App\Http\Controllers;

use App\Http\Requests\VrijwilligerRequest;
use App\Http\Resources\VrijwilligerResource;
use App\Models\Organisatie;
use App\Models\Vrijwilliger;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class VrijwilligerController extends Controller
{
    // Beheerder: alle vrijwilligers. Organisatie: alleen de eigen.
    public function index(Request $request): AnonymousResourceCollection
    {
        $vrijwilligers = Vrijwilliger::query()->zichtbaarVoor($request->user())->orderBy('id')->get();

        return VrijwilligerResource::collection($vrijwilligers);
    }

    // Een organisatie maakt een concept; pas na versturen ziet de beheerder hem.
    // Wat de beheerder zelf toevoegt, is meteen bij VIP! en dus verstuurd.
    public function store(VrijwilligerRequest $request): VrijwilligerResource
    {
        $vrijwilliger = Vrijwilliger::create([
            'organisatie_id' => $request->OrganisatieId(),
            ...VrijwilligerRequest::NaarKolommen($request->validated()),
            'verstuurd_op' => $request->user()->IsBeheerder() ? now() : null,
        ]);

        return new VrijwilligerResource($vrijwilliger);
    }

    // Organisatie verstuurt (een deel van) haar concepten naar VIP! Tynaarlo
    public function send(Request $request): AnonymousResourceCollection
    {
        $request->validate(['ids' => ['required', 'array', 'min:1'], 'ids.*' => ['integer']]);

        $vrijwilligers = Vrijwilliger::query()
            ->zichtbaarVoor($request->user())
            ->concept()
            ->whereKey($request->input('ids'))
            ->get();

        Vrijwilliger::query()->whereKey($vrijwilligers->modelKeys())->update(['verstuurd_op' => now()]);

        return VrijwilligerResource::collection($vrijwilligers->each->refresh());
    }

    // Excel-import (alleen beheerder). Net als in v1.0: rijen zonder voornaam of
    // met een onbekende organisatie worden overgeslagen.
    public function import(Request $request): AnonymousResourceCollection
    {
        $request->validate(['volunteers' => ['required', 'array']]);

        $organisaties = Organisatie::query()->pluck('id')->flip();
        $nieuw = collect();
        $gezien = [];

        foreach ($request->input('volunteers') as $rij)
        {
            $rij = self::AlsTekst($rij);
            $validator = Validator::make($rij, [
                'orgId' => ['required', 'integer'],
                ...VrijwilligerRequest::Velden(),
            ]);

            if ($validator->fails() || ! $organisaties->has((int) $rij['orgId']))
            {
                continue;
            }

            $organisatieId = (int) $rij['orgId'];
            $kolommen = VrijwilligerRequest::NaarKolommen($validator->validated());

            // Dubbel met wat er al staat, of met een eerdere rij in hetzelfde bestand
            $sleutels = array_filter([
                filled($kolommen['email']) ? 'e|' . mb_strtolower($kolommen['email']) : null,
                filled($kolommen['achternaam']) && filled($kolommen['geboortedatum'])
                    ? 'n|' . mb_strtolower("{$kolommen['voornaam']}|{$kolommen['tussenvoegsel']}|{$kolommen['achternaam']}|{$kolommen['geboortedatum']}")
                    : null,
            ]);

            if (Vrijwilliger::DubbelVeld($organisatieId, $kolommen) || array_intersect($sleutels, $gezien[$organisatieId] ?? []))
            {
                continue;
            }

            $gezien[$organisatieId] = [...$gezien[$organisatieId] ?? [], ...$sleutels];

            // Door de beheerder geïmporteerd, dus al bij VIP!
            $nieuw->push(Vrijwilliger::create([
                'organisatie_id' => $organisatieId,
                ...$kolommen,
                'verstuurd_op' => now(),
            ]));
        }

        return VrijwilligerResource::collection($nieuw);
    }

    // Een organisatie kan alleen haar eigen concepten verwijderen: verstuurde gegevens zijn al bij de gemeente.
    // Ids van anderen worden genegeerd.
    public function destroy(Request $request): Response
    {
        $request->validate(['ids' => ['required', 'array'], 'ids.*' => ['integer']]);

        $vrijwilligers = Vrijwilliger::query()->zichtbaarVoor($request->user())->whereKey($request->input('ids'));

        if (! $request->user()->IsBeheerder() && (clone $vrijwilligers)->whereNotNull('verstuurd_op')->exists())
        {
            throw ValidationException::withMessages([
                'ids' => 'Verstuurde vrijwilligers kun je niet meer verwijderen. Neem hiervoor contact op met VIP! Tynaarlo.',
            ]);
        }

        $vrijwilligers->delete();

        return response()->noContent();
    }

    // Excel geeft een telefoon- of huisnummer soms als getal (612345678); de controles verwachten tekst
    public static function AlsTekst(mixed $rij): array
    {
        return array_map(fn ($waarde) => is_int($waarde) || is_float($waarde) ? (string) $waarde : $waarde, is_array($rij) ? $rij : []);
    }
}
