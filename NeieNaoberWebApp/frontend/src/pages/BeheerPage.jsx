import { useState } from "react";
import { CalendarPlus, Trash2 } from "lucide-react";
import Button from "../components/ui/Button";
import FormSection from "../components/ui/FormSection";
import TextField from "../components/ui/TextField";
import Alert from "../components/ui/Alert";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import Loading from "../components/ui/Loading";
import { useApi } from "../hooks/useApi";
import { api } from "../services/ApiClient";
import { formatDate, formatDateTime } from "../helpers/formatDate";

const leeg = { naam: "", startdatum: "", einddatum: "" };

// Alleen de beheerder: periodes maken (UC-5) en gegevens eerder verwijderen (UC-7, 3a)
export default function BeheerPage() {
    const { data, error, loading, reload } = useApi("/api/vip/periodes");
    const [form, setForm] = useState(leeg);
    const [fout, setFout] = useState(null);
    const [melding, setMelding] = useState(null);
    const [teVerwijderen, setTeVerwijderen] = useState(null);
    const [bevestiging, setBevestiging] = useState("");
    const [busy, setBusy] = useState(false);
    const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

    const periodeMaken = async (e) => {
        e.preventDefault();
        setBusy(true);
        setFout(null);
        try {
            await api.post("/api/beheer/periodes", form);
            setMelding({ type: "success", title: `De periode "${form.naam}" is opgeslagen.` });
            setForm(leeg);
            reload();
        } catch (err) {
            setFout(err);
        } finally {
            setBusy(false);
        }
    };

    const verwijderen = async () => {
        setBusy(true);
        try {
            await api.delete(`/api/beheer/periodes/${teVerwijderen.id}/gegevens`, { bevestiging });
            setMelding({ type: "success", title: `De gegevens van "${teVerwijderen.naam}" zijn definitief verwijderd.` });
            setTeVerwijderen(null);
            reload();
        } catch (err) {
            setMelding({ type: "error", title: err.field("bevestiging") || err.message });
        } finally {
            setBusy(false);
        }
    };

    return (
        <>
            <h1 className="page-title">Beheer</h1>
            {melding && <Alert type={melding.type} title={melding.title} />}

            <FormSection title="Nieuwe aanmeldperiode">
                <form className="inline-form" onSubmit={periodeMaken} noValidate>
                    <TextField id="periode-naam" label="Naam" required placeholder="bijv. Horecabon 2027" value={form.naam} onChange={set("naam")} error={fout?.field("naam")} />
                    <TextField id="startdatum" label="Startdatum" type="date" required value={form.startdatum} onChange={set("startdatum")} error={fout?.field("startdatum")} />
                    <TextField id="einddatum" label="Einddatum" type="date" required value={form.einddatum} onChange={set("einddatum")} error={fout?.field("einddatum")} />
                    <Button type="submit" icon={CalendarPlus} disabled={busy}>Opslaan</Button>
                </form>
                {fout && !Object.keys(fout.errors).length && <Alert type="error" title={fout.message} />}
                <p className="muted small">Periodes mogen niet overlappen. Na de einddatum kan niemand meer aanmelden.</p>
            </FormSection>

            <FormSection title="Periodes">
                {error && <Alert type="error" title={error.message} />}
                {loading && !data ? (
                    <Loading />
                ) : (
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Naam</th>
                                <th>Start</th>
                                <th>Einde</th>
                                <th>Export gemaakt</th>
                                <th>Gegevens verwijderd</th>
                                <th style={{ width: 200 }}>AVG</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(data?.data ?? []).length === 0 && (
                                <tr><td className="empty" colSpan={6}>Nog geen periodes.</td></tr>
                            )}
                            {(data?.data ?? []).map((p) => (
                                <tr key={p.id}>
                                    <td className="strong">
                                        {p.naam} {p.open && <span className="badge badge--goedgekeurd">Open</span>}
                                    </td>
                                    <td>{formatDate(p.startdatum)}</td>
                                    <td>{formatDate(p.einddatum)}</td>
                                    <td>{formatDateTime(p.geexporteerd_op)}</td>
                                    <td>{formatDateTime(p.gegevens_verwijderd_op)}</td>
                                    <td>
                                        {!p.gegevens_verwijderd_op && (
                                            <button className="link-btn link-btn--danger" onClick={() => { setTeVerwijderen(p); setBevestiging(""); }}>
                                                <Trash2 size={14} /> Gegevens verwijderen
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                <p className="muted small">
                    Het systeem verwijdert de gegevens elke nacht vanzelf, 1 maand na de einddatum en alleen als de export gemaakt
                    is. Eerder verwijderen kan hier.
                </p>
            </FormSection>

            {teVerwijderen && (
                <ConfirmDialog
                    title="Gegevens definitief verwijderen?"
                    confirmLabel="Definitief verwijderen"
                    variant="danger"
                    busy={busy}
                    confirmDisabled={bevestiging !== "VERWIJDER"}
                    onConfirm={verwijderen}
                    onClose={() => setTeVerwijderen(null)}
                >
                    <p className="muted">
                        Alle vrijwilligers en aanmeldingen van <strong>{teVerwijderen.naam}</strong> worden verwijderd. Dit kan niet
                        ongedaan worden gemaakt.
                        {!teVerwijderen.geexporteerd_op && " Let op: voor deze periode is nog geen export gemaakt!"}
                    </p>
                    <TextField id="bevestiging" label="Typ VERWIJDER om te bevestigen" value={bevestiging} onChange={(e) => setBevestiging(e.target.value)} />
                </ConfirmDialog>
            )}
        </>
    );
}
