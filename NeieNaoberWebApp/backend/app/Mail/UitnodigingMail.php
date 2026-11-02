<?php

namespace App\Mail;

use App\Models\Gebruiker;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

// Nieuwe organisatie: zelf een wachtwoord maken via een link, zodat niemand anders het kent
class UitnodigingMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Gebruiker $gebruiker, public string $link)
    {
    }

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'Uw account voor de horecabon van VIP! Tynaarlo');
    }

    public function content(): Content
    {
        return new Content(text: 'mail.uitnodiging');
    }
}
