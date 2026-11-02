import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { KeyRound } from "lucide-react";
import TextField from "../components/ui/TextField";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";
import { api } from "../services/ApiClient";

// UC-9: de organisatie maakt zelf een wachtwoord via de link uit de uitnodiging, zodat niemand anders het kent
export default function WachtwoordMakenPage() {
    const [params] = useSearchParams();
    const [wachtwoord, setWachtwoord] = useState("");
    const [herhaling, setHerhaling] = useState("");
    const [fout, setFout] = useState(null);
    const [klaar, setKlaar] = useState("");
    const [busy, setBusy] = useState(false);

    const opslaan = async (e) => {
        e.preventDefault();
        setBusy(true);
        setFout(null);
        try {
            const data = await api.post("/api/wachtwoord", {
                token: params.get("token"),
                email: params.get("email"),
                wachtwoord,
                wachtwoord_confirmation: herhaling,
            });
            setKlaar(data.message);
        } catch (err) {
            setFout(err);
        } finally {
            setBusy(false);
        }
    };

    if (klaar) {
        return (
            <div className="login-wrap">
                <div className="card login-card">
                    <h1 className="login-card__title">Wachtwoord opgeslagen</h1>
                    <Alert type="success" title={klaar} />
                    <Button to="/login">Naar inloggen</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="login-wrap">
            <form className="card login-card" onSubmit={opslaan} noValidate>
                <h1 className="login-card__title">Wachtwoord maken</h1>
                <p className="muted">Account: <strong>{params.get("email")}</strong>. Kies een wachtwoord van minimaal 12 tekens.</p>
                <TextField id="wachtwoord" label="Nieuw wachtwoord" type="password" required autoComplete="new-password" value={wachtwoord} onChange={(e) => setWachtwoord(e.target.value)} error={fout?.field("wachtwoord")} />
                <TextField id="herhaling" label="Herhaal het wachtwoord" type="password" required autoComplete="new-password" value={herhaling} onChange={(e) => setHerhaling(e.target.value)} />
                {fout && (fout.field("token") || fout.field("email") || !Object.keys(fout.errors).length) && (
                    <Alert type="error" title={fout.field("token") || fout.field("email") || fout.message} />
                )}
                <Button type="submit" icon={KeyRound} disabled={busy}>Wachtwoord opslaan</Button>
            </form>
        </div>
    );
}
