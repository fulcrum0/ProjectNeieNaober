<?php

namespace App\Mail;

use App\Models\Periode;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

// UC-7 stap 2a: geen export gedaan, dus de AVG-opruiming verwijdert niets en waarschuwt VIP!
class GeenExportMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Periode $periode)
    {
    }

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'Let op: gegevens nog niet verwijderd (' . $this->periode->naam . ')');
    }

    public function content(): Content
    {
        return new Content(text: 'mail.geen-export');
    }
}
