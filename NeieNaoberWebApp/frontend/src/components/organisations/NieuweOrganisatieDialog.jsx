import { useState } from "react";
import ConfirmDialog from "../ui/ConfirmDialog";
import TextField from "../ui/TextField";
import Alert from "../ui/Alert";
import { api } from "../../services/ApiClient";

// UC-9: organisatie + één account. Het wachtwoord maakt de organisatie zelf via de link in de mail.
export default function NieuweOrganisatieDialog({ onClose, onGemaakt }) {
    const [form, setForm] = useState({ naam: "", plaats: "", email: "" });
    const [error, setError] = useState(null);
    const [busy, setBusy] = useState(false);
    const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

    const opslaan = async () => {
        setBusy(true);
        setError(null);
        try {
            const result = await api.post("/api/beheer/organisaties", form);
            onGemaakt(result);
        } catch (e) {
            setError(e);
        } finally {
            setBusy(false);
        }
    };

    return (
        <ConfirmDialog title="Nieuwe organisatie" confirmLabel="Opslaan en uitnodiging mailen" busy={busy} onConfirm={opslaan} onClose={onClose}>
            <TextField id="org-naam" label="Naam organisatie" required value={form.naam} onChange={set("naam")} error={error?.field("naam")} />
            <TextField id="org-plaats" label="Plaats" required value={form.plaats} onChange={set("plaats")} error={error?.field("plaats")} />
            <TextField id="org-email" label="E-mailadres contactpersoon" type="email" required value={form.email} onChange={set("email")} error={error?.field("email")} />
            {error && !Object.keys(error.errors).length && <Alert type="error" title={error.message} />}
            <p className="muted small">De organisatie krijgt een mail met een link om zelf een wachtwoord te maken.</p>
        </ConfirmDialog>
    );
}
