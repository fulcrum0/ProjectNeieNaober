import { useState } from "react";
import { FileSpreadsheet } from "lucide-react";
import Button from "../components/ui/Button";
import FormSection from "../components/ui/FormSection";
import SelectField from "../components/ui/SelectField";
import Alert from "../components/ui/Alert";
import SjabloonBeheer from "../components/export/SjabloonBeheer";
import { useApi } from "../hooks/useApi";
import { api } from "../services/ApiClient";
import { formatDateTime } from "../helpers/formatDate";

// UC-4: Excel voor de gemeente, met alleen goedgekeurde aanmeldingen in het actieve sjabloon (FE-7)
export default function ExportPage() {
    const periodes = useApi("/api/vip/periodes");
    const lijst = periodes.data?.data ?? [];
    const [gekozen, setGekozen] = useState("");
    const [melding, setMelding] = useState(null);
    const [waarschuwing, setWaarschuwing] = useState("");
    const [busy, setBusy] = useState(false);

    // Standaard de open periode, anders de nieuwste
    const periodeId = gekozen || String((lijst.find((p) => p.open) ?? lijst[0])?.id ?? "");
    const periode = lijst.find((p) => String(p.id) === periodeId);

    const exporteren = async (doorgaan = false) => {
        setBusy(true);
        setMelding(null);
        try {
            await api.download("/api/vip/export", { periode_id: periodeId, doorgaan: doorgaan ? 1 : null }, "horecabon.xlsx");
            setWaarschuwing("");
            setMelding({ type: "success", title: "Het Excel-bestand is gemaakt. De datum van de export is opgeslagen." });
            periodes.reload();
        } catch (e) {
            // UC-4, 3a: nog niet alles gecontroleerd? Waarschuwen; de medewerker kan toch doorgaan
            if (e.errors.periode_id && !doorgaan) setWaarschuwing(e.errors.periode_id[0]);
            else setMelding({ type: "error", title: e.message, items: Object.values(e.errors).flat() });
        } finally {
            setBusy(false);
        }
    };

    return (
        <>
            <h1 className="page-title">Export en sjabloon</h1>

            <FormSection title="Excel-bestand voor de gemeente">
                <p className="muted">
                    Alleen <strong>goedgekeurde</strong> aanmeldingen gaan mee, in de kolommen van het actieve sjabloon. Na de export
                    mag het systeem de gegevens 1 maand na de einddatum verwijderen (AVG).
                </p>
                <div className="inline-form">
                    <SelectField
                        id="export-periode" label="Periode" value={periodeId}
                        onChange={(e) => {
                            setGekozen(e.target.value);
                            setWaarschuwing("");
                        }}
                        options={lijst.length ? lijst.map((p) => ({ value: String(p.id), label: p.naam })) : [{ value: "", label: "Nog geen periodes" }]}
                    />
                    <Button icon={FileSpreadsheet} disabled={busy || !periodeId} onClick={() => exporteren(false)}>
                        {busy ? "Bezig..." : "Excel maken"}
                    </Button>
                </div>
                {periode && <p className="muted small">Laatste export van deze periode: {formatDateTime(periode.geexporteerd_op)}</p>}

                {waarschuwing && (
                    <Alert type="warning" title={waarschuwing}>
                        <p>Niet-gecontroleerde aanmeldingen gaan niet mee in het bestand.</p>
                        <div className="actions">
                            <Button variant="outline" onClick={() => setWaarschuwing("")}>Stoppen en eerst controleren</Button>
                            <Button disabled={busy} onClick={() => exporteren(true)}>Toch doorgaan</Button>
                        </div>
                    </Alert>
                )}
                {melding && (
                    <Alert type={melding.type} title={melding.title}>
                        {melding.items?.map((m) => <p key={m}>{m}</p>)}
                    </Alert>
                )}
            </FormSection>

            <SjabloonBeheer />
        </>
    );
}
