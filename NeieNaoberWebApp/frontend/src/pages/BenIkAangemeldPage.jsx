import { useState } from "react";
import { Search } from "lucide-react";
import TextField from "../components/ui/TextField";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";
import { api } from "../services/ApiClient";

const leeg = { voornaam: "", achternaam: "", postcode: "", huisnummer: "" };

// Should (UC-6): het antwoord is alleen ja of nee; nooit een adres of andere gegevens (AVG)
export default function BenIkAangemeldPage() {
    const [form, setForm] = useState(leeg);
    const [fout, setFout] = useState(null);
    const [antwoord, setAntwoord] = useState(null);
    const [busy, setBusy] = useState(false);
    const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

    const zoeken = async (e) => {
        e.preventDefault();
        setBusy(true);
        setFout(null);
        setAntwoord(null);
        try {
            setAntwoord(await api.post("/api/ben-ik-aangemeld", form));
        } catch (err) {
            setFout(err);
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="login-wrap">
            <form className="card login-card" onSubmit={zoeken} noValidate>
                <h1 className="login-card__title">Ben ik al aangemeld?</h1>
                <p className="muted">Vul uw gegevens in. U ziet alleen of u bent aangemeld voor de horecabon.</p>
                <div className="form-row">
                    <TextField id="voornaam" label="Voornaam" required value={form.voornaam} onChange={set("voornaam")} error={fout?.field("voornaam")} />
                    <TextField id="achternaam" label="Achternaam" required value={form.achternaam} onChange={set("achternaam")} error={fout?.field("achternaam")} />
                </div>
                <div className="form-row">
                    <TextField id="postcode" label="Postcode" required placeholder="bijv. 9481 AB" value={form.postcode} onChange={set("postcode")} error={fout?.field("postcode")} />
                    <TextField id="huisnummer" label="Huisnummer" required value={form.huisnummer} onChange={set("huisnummer")} error={fout?.field("huisnummer")} />
                </div>
                {fout && !Object.keys(fout.errors).length && <Alert type="error" title={fout.message} />}
                {antwoord && (
                    <Alert type={antwoord.aangemeld ? "success" : "warning"}>
                        <p className="result">{antwoord.message}</p>
                    </Alert>
                )}
                <Button type="submit" icon={Search} disabled={busy}>Zoeken</Button>
            </form>
        </div>
    );
}
