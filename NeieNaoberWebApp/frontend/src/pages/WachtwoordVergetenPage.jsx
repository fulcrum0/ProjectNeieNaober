import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import TextField from "../components/ui/TextField";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";
import { api } from "../services/ApiClient";

// Could (US-14): altijd hetzelfde antwoord, zodat niemand kan zien of een e-mailadres bestaat
export default function WachtwoordVergetenPage() {
    const [email, setEmail] = useState("");
    const [result, setResult] = useState(null);
    const [busy, setBusy] = useState(false);

    const versturen = async (e) => {
        e.preventDefault();
        setBusy(true);
        try {
            const data = await api.post("/api/wachtwoord-vergeten", { email: email.trim() });
            setResult({ type: "success", title: data.message });
        } catch (err) {
            setResult({ type: "error", title: err.field("email") || err.message });
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="login-wrap">
            <form className="card login-card" onSubmit={versturen} noValidate>
                <h1 className="login-card__title">Wachtwoord vergeten</h1>
                <p className="muted">Vul uw e-mailadres in. U krijgt een mail met een link om een nieuw wachtwoord te maken.</p>
                <TextField id="email" label="E-mailadres" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                {result && <Alert type={result.type} title={result.title} />}
                <Button type="submit" icon={Mail} disabled={busy}>Link versturen</Button>
                <Link to="/login" className="ext-link">Terug naar inloggen</Link>
            </form>
        </div>
    );
}
