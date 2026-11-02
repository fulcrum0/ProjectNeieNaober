<?php

namespace App\Services;

use App\Models\Aanmelding;
use App\Models\ExportSjabloon;
use App\Models\Periode;
use App\Models\Vrijwilliger;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Storage;
use PhpOffice\PhpSpreadsheet\Cell\Coordinate;
use PhpOffice\PhpSpreadsheet\Cell\DataType;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Reader\Csv;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ExcelService
{
    // Grote exports in stukjes, zodat het geheugen op de gratis hosting niet volloopt
    private const CHUNK_SIZE = 500;

    // Vaste kolommen voor de eigen lijst van een organisatie (FE-11)
    private const EIGEN_LIJST_KOLOMMEN = [
        'aanhef' => 'Aanhef',
        'voornaam' => 'Voornaam',
        'tussenvoegsel' => 'Tussenvoegsel',
        'achternaam' => 'Achternaam',
        'straat' => 'Straat',
        'huisnummer' => 'Huisnummer',
        'postcode' => 'Postcode',
        'woonplaats' => 'Woonplaats',
        'status' => 'Status',
    ];

    // Export voor de gemeente: het sjabloon van de gemeente, gevuld vanaf de eerste lege rij
    public function MaakGemeenteExport(Periode $periode, ExportSjabloon $sjabloon): Spreadsheet
    {
        $spreadsheet = IOFactory::load(Storage::disk('local')->path($sjabloon->bestandsnaam));
        $sheet = $spreadsheet->getActiveSheet();
        $rij = $sheet->getHighestDataRow() + 1;

        $query = Aanmelding::query()
            ->where('periode_id', $periode->id)
            ->where('status', Aanmelding::STATUS_GOEDGEKEURD)
            ->with(['vrijwilliger', 'organisatie']);

        $query->chunkById(self::CHUNK_SIZE, function ($aanmeldingen) use ($sheet, $sjabloon, $periode, &$rij)
        {
            foreach ($aanmeldingen as $aanmelding)
            {
                foreach ($sjabloon->kolommen as $kolom => $veld)
                {
                    if ($veld)
                    {
                        $this->ZetTekst($sheet, $kolom . $rij, $this->Waarde($aanmelding, $veld, $periode));
                    }
                }

                $rij++;
            }
        });

        return $spreadsheet;
    }

    public function MaakEigenLijst(Builder $query): Spreadsheet
    {
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Vrijwilligers');

        $kolom = 1;

        foreach (self::EIGEN_LIJST_KOLOMMEN as $titel)
        {
            $sheet->setCellValue(Coordinate::stringFromColumnIndex($kolom) . '1', $titel);
            $kolom++;
        }

        $sheet->getStyle('1:1')->getFont()->setBold(true);
        $rij = 2;

        $query->with('vrijwilliger')->chunkById(self::CHUNK_SIZE, function ($aanmeldingen) use ($sheet, &$rij)
        {
            foreach ($aanmeldingen as $aanmelding)
            {
                $kolom = 1;

                foreach (array_keys(self::EIGEN_LIJST_KOLOMMEN) as $veld)
                {
                    $waarde = $veld === 'status' ? $aanmelding->status : $aanmelding->vrijwilliger->{$veld};
                    $this->ZetTekst($sheet, Coordinate::stringFromColumnIndex($kolom) . $rij, $waarde);
                    $kolom++;
                }

                $rij++;
            }
        });

        return $spreadsheet;
    }

    public function Download(Spreadsheet $spreadsheet, string $bestandsnaam): StreamedResponse
    {
        return response()->streamDownload(function () use ($spreadsheet)
        {
            (new Xlsx($spreadsheet))->save('php://output');
        }, $bestandsnaam, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ]);
    }

    // Rij 1 van het sjabloon: de kolomnamen van de gemeente, bijvoorbeeld ["A" => "Achternaam"]
    public function LeesKolomnamen(string $pad): array
    {
        $sheet = IOFactory::load($pad)->getActiveSheet();
        $kolomnamen = [];
        $laatsteKolom = Coordinate::columnIndexFromString($sheet->getHighestDataColumn());

        for ($index = 1; $index <= $laatsteKolom; $index++)
        {
            $letter = Coordinate::stringFromColumnIndex($index);
            $naam = trim((string) $sheet->getCell($letter . '1')->getValue());

            if ($naam !== '')
            {
                $kolomnamen[$letter] = $naam;
            }
        }

        return $kolomnamen;
    }

    // Een eerste gok voor de koppeling, zodat VIP! meestal alleen hoeft te controleren
    public function RaadKolommen(array $kolomnamen): array
    {
        $koppeling = [];

        foreach ($kolomnamen as $letter => $naam)
        {
            $koppeling[$letter] = $this->RaadVeld($naam);
        }

        return $koppeling;
    }

    // Excel- of CSV-bestand met veel vrijwilligers (Could). Rij 1 = kolomnamen.
    public function LeesVrijwilligers(string $pad, string $extensie): array
    {
        $reader = IOFactory::createReader($extensie === 'xlsx' ? 'Xlsx' : 'Csv');

        if ($reader instanceof Csv)
        {
            // In Nederland zet Excel een puntkomma tussen de kolommen
            $reader->setDelimiter($this->RaadScheidingsteken($pad));
        }

        $reader->setReadDataOnly(true);
        $rijen = $reader->load($pad)->getActiveSheet()->toArray(null, true, false, false);

        if (count($rijen) === 0)
        {
            return [];
        }

        $koppen = array_map(fn ($kop) => $this->RaadVeld((string) $kop), array_shift($rijen));
        $resultaat = [];

        foreach ($rijen as $index => $rij)
        {
            if (count(array_filter($rij, fn ($cel) => trim((string) $cel) !== '')) === 0)
            {
                continue;
            }

            $gegevens = [];

            foreach ($koppen as $kolom => $veld)
            {
                if ($veld && in_array($veld, Vrijwilliger::VELDEN, true))
                {
                    $gegevens[$veld] = $rij[$kolom] ?? null;
                }
            }

            // +2: rij 1 is de kop en Excel telt vanaf 1, zo klopt het rijnummer in de foutmelding
            $resultaat[$index + 2] = $gegevens;
        }

        return $resultaat;
    }

    private function Waarde(Aanmelding $aanmelding, string $veld, Periode $periode): ?string
    {
        return match ($veld)
        {
            'organisatie' => $aanmelding->OrganisatieNaam(),
            'periode' => $periode->naam,
            default => $aanmelding->vrijwilliger->{$veld},
        };
    }

    // Alles als tekst, zodat "=..." nooit een formule wordt in Excel (formula injection)
    // en een postcode of huisnummer nooit een getal of datum.
    private function ZetTekst(Worksheet $sheet, string $cel, ?string $waarde): void
    {
        $sheet->setCellValueExplicit($cel, (string) $waarde, DataType::TYPE_STRING);
    }

    private function RaadVeld(string $naam): ?string
    {
        $schoon = preg_replace('/[^a-z]/', '', strtolower($naam));

        $woorden = [
            'aanhef' => ['aanhef', 'titel', 'geslacht'],
            'voornaam' => ['voornaam', 'roepnaam', 'firstname'],
            'tussenvoegsel' => ['tussenvoegsel', 'tussenvoegsels', 'voorvoegsel'],
            'achternaam' => ['achternaam', 'familienaam', 'lastname', 'naam'],
            'straat' => ['straat', 'straatnaam', 'adres', 'street'],
            'huisnummer' => ['huisnummer', 'huisnr', 'nr', 'nummer', 'housenumber'],
            'postcode' => ['postcode', 'zipcode', 'zip'],
            'woonplaats' => ['woonplaats', 'plaats', 'city'],
            'organisatie' => ['organisatie', 'vereniging', 'stichting', 'organisation'],
            'periode' => ['periode', 'jaar'],
        ];

        foreach ($woorden as $veld => $opties)
        {
            if (in_array($schoon, $opties, true))
            {
                return $veld;
            }
        }

        return null;
    }

    private function RaadScheidingsteken(string $pad): string
    {
        $bestand = fopen($pad, 'r');
        $eersteRegel = (string) fgets($bestand);
        fclose($bestand);

        return substr_count($eersteRegel, ';') >= substr_count($eersteRegel, ',') ? ';' : ',';
    }
}
