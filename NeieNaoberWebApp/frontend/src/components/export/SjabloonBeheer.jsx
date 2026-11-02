import { useRef, useState } from "react";
import { Download, Save } from "lucide-react";
import Button from "../ui/Button";
import FormSection from "../ui/FormSection";
import SelectField from "../ui/SelectField";
import TextField from "../ui/TextField";
import Alert from "../ui/Alert";
import Loading from "../ui/Loading";
import { useApi } from "../../hooks/useApi";
import { api } from "../../services/ApiClient";
import { VELD_LABELS } from "../../data/constants";
import { formatDate } from "../../helpers/formatDate";

// US-11: nieuw sjabloon van de gemeente uploaden en de kolommen aan velden koppelen.
// Er is altijd maar één sjabloon actief; dat regelt Laravel.
export default function SjabloonBeheer() {
    const { data, error, loading, reload } = useApi("/api/vip/sjablonen");
    const [openId, setOpenId] = useState(null);
    const [melding, setMelding] = useState(null);
    const [naam, setNaam] = useState("");
    const [busy, setBusy] = useState(false);
    const fileRef = useRef(null);

    const sjablonen = data?.data ?? [];
    const velden = data?.velden ?? Object.keys(VELD_LABELS);

    const uploaden = async (e) => {
        const file = e.target.files[0];
        e.target.value = "";
        if (!file) return;

        const form = new FormData();
        form.append("bestand", file);
        if (naam.trim()) form.append("naam", naam.trim());

        setBusy(true);
        setMelding(null);
        try {
            const result = await api.post("/api/vip/sjablonen", form);
            setNaam("");
            setOpenId(result.data.id);
            setMelding({ type: "success", title: `${Object.keys(result.gevonden_kolommen).length} kolommen gevonden. Controleer hieronder de koppeling.` });
            reload();
        } catch (err) {
            setMelding({ type: "error", title: err.field("bestand") || err.message });
        } finally {
            setBusy(false);
        }
    };

    const wijzig = async (sjabloon, body, tekst) => {
        setMelding(null);
        try {
            await api.put(`/api/vip/sjablonen/${sjabloon.id}`, body);
            setMelding({ type: "success", title: tekst });
            reload();
        } catch (err) {
            setMelding({ type: "error", title: err.message, items: Object.values(err.errors).flat() });
        }
    };

    const verwijder = async (sjabloon) => {
        try {
            await api.delete(`/api/vip/sjablonen/${sjabloon.id}`);
            reload();
        } catch (err) {
            setMelding({ type: "error", title: err.field("actief") || err.message });
        }
    };

    return (
        <FormSection title="Excel-sjabloon van de gemeente">
            <p className="muted">
                Heeft de gemeente een nieuwe indeling? Upload dan het nieuwe sjabloon (.xlsx, max. 2 MB). Rij 1 moet de kolomnamen
                hebben. Het systeem raadt de koppeling; u controleert hem en zet het sjabloon actief.
            </p>
            <div className="inline-form">
                <TextField id="sjabloon-naam" label="Naam (mag leeg)" value={naam} onChange={(e) => setNaam(e.target.value)} placeholder="bijv. Gemeente 2027" />
                <Button icon={Download} disabled={busy} onClick={() => fileRef.current.click()}>
                    {busy ? "Bezig..." : "Sjabloon uploaden"}
                </Button>
                <input ref={fileRef} type="file" accept=".xlsx" hidden onChange={uploaden} />
            </div>

            {melding && (
                <Alert type={melding.type} title={melding.title}>
                    {melding.items?.map((m) => <p key={m}>{m}</p>)}
                </Alert>
            )}
            {error && <Alert type="error" title={error.message} />}
            {loading && !data && <Loading />}

            {sjablonen.length > 0 && (
                <table className="table">
                    <thead>
                        <tr>
                            <th>Naam</th>
                            <th>Status</th>
                            <th>Geüpload</th>
                            <th style={{ width: 320 }}>Acties</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sjablonen.map((s) => (
                            <tr key={s.id}>
                                <td className="strong">{s.naam}</td>
                                <td>{s.actief ? <span className="badge badge--actief">Actief</span> : <span className="muted">Niet actief</span>}</td>
                                <td>{formatDate(s.aangemaakt_op)}{s.geupload_door ? ` door ${s.geupload_door}` : ""}</td>
                                <td>
                                    <button className="link-btn" onClick={() => setOpenId(openId === s.id ? null : s.id)}>
                                        {openId === s.id ? "Sluiten" : "Kolommen koppelen"}
                                    </button>
                                    {!s.actief && (
                                        <>
                                            {" · "}
                                            <button className="link-btn" onClick={() => wijzig(s, { actief: true }, `${s.naam} is nu het actieve sjabloon.`)}>
                                                Actief maken
                                            </button>
                                            {" · "}
                                            <button className="link-btn link-btn--danger" onClick={() => verwijder(s)}>Verwijderen</button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {sjablonen
                .filter((s) => s.id === openId)
                .map((s) => (
                    <KolomKoppeling
                        key={s.id}
                        sjabloon={s}
                        velden={velden}
                        onOpslaan={(kolommen) => wijzig(s, { kolommen }, "De koppeling is opgeslagen.")}
                    />
                ))}
        </FormSection>
    );
}

function KolomKoppeling({ sjabloon, velden, onOpslaan }) {
    const [kolommen, setKolommen] = useState(sjabloon.kolommen);
    const letters = Object.keys(kolommen);
    const opties = [{ value: "", label: "— niet gebruiken —" }, ...velden.map((v) => ({ value: v, label: VELD_LABELS[v] ?? v }))];

    return (
        <>
            <h3 className="form-section__subtitle">Koppeling van "{sjabloon.naam}"</h3>
            <div className="mapping">
                {letters.map((letter) => (
                    <SelectField
                        key={letter}
                        id={`kolom-${sjabloon.id}-${letter}`}
                        label={`Kolom ${letter}${sjabloon.kolomnamen?.[letter] ? `: ${sjabloon.kolomnamen[letter]}` : ""}`}
                        value={kolommen[letter] ?? ""}
                        onChange={(e) => setKolommen({ ...kolommen, [letter]: e.target.value || null })}
                        options={opties}
                    />
                ))}
            </div>
            <div>
                <Button icon={Save} onClick={() => onOpslaan(kolommen)}>Koppeling opslaan</Button>
            </div>
        </>
    );
}
