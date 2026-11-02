import { useState } from "react";
import { Link } from "react-router-dom";
import { ExternalLink, Send } from "lucide-react";
import FormSection from "../ui/FormSection";
import TextField from "../ui/TextField";
import Button from "../ui/Button";
import Alert from "../ui/Alert";
import { api } from "../../services/ApiClient";

// UC-2 stap 5-6: zonder privacyvinkje kan de organisatie niet versturen (FE-5).
// Laravel slaat naam, datum en versie op in "verklaringen" en zet concept op nieuw.
export default function VersturenPanel({ aantal, onVerstuurd }) {
    const [naam, setNaam] = useState("");
    const [akkoord, setAkkoord] = useState(false);
    const [errors, setErrors] = useState({});
    const [busy, setBusy] = useState(false);

    const versturen = async (e) => {
        e.preventDefault();
        setBusy(true);
        setErrors({});
        try {
            const result = await api.post("/api/mijn/versturen", { akkoord_privacy: akkoord, naam_invuller: naam.trim() });
            setNaam("");
            setAkkoord(false);
            onVerstuurd(result);
        } catch (error) {
            setErrors({ ...error.errors, algemeen: Object.keys(error.errors).length ? "" : error.message });
        } finally {
            setBusy(false);
        }
    };

    return (
        <form onSubmit={versturen} noValidate>
            <FormSection title={`Lijst versturen naar VIP! (${aantal} nog niet verstuurd)`}>
                <p className="muted">
                    Klaar met invoeren? Verstuur dan de lijst. Daarna kunt u deze vrijwilligers niet meer aanpassen; VIP! Tynaarlo
                    controleert ze. Nieuwe vrijwilligers kunt u later nog toevoegen en opnieuw versturen.
                </p>
                <Link to="/privacy" target="_blank" className="ext-link">
                    Lees de privacyverklaring <ExternalLink size={14} />
                </Link>
                <TextField
                    id="naam_invuller" label="Uw naam" required value={naam}
                    onChange={(e) => setNaam(e.target.value)} error={errors.naam_invuller?.[0]}
                />
                <label className="consent">
                    <input type="checkbox" checked={akkoord} onChange={(e) => setAkkoord(e.target.checked)} />
                    <span>
                        Ik verklaar namens de organisatie dat de vrijwilligers weten dat hun gegevens naar VIP! Tynaarlo en de
                        gemeente gaan, en ik ga akkoord met de privacyverklaring. *
                    </span>
                </label>
                {errors.akkoord_privacy && <p className="field__error">{errors.akkoord_privacy[0]}</p>}
                <Alert type="error">{errors.versturen?.[0] || errors.periode?.[0] || errors.algemeen}</Alert>
                <div>
                    <Button type="submit" icon={Send} disabled={busy || !akkoord}>
                        {busy ? "Bezig..." : `Lijst versturen (${aantal})`}
                    </Button>
                </div>
            </FormSection>
        </form>
    );
}
