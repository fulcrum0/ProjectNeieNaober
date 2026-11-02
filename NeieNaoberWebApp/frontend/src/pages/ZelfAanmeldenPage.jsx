import { useState } from "react";
import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import VolunteerForm from "../components/volunteers/VolunteerForm";
import FormSection from "../components/ui/FormSection";
import TextField from "../components/ui/TextField";
import Alert from "../components/ui/Alert";
import Loading from "../components/ui/Loading";
import { useApi } from "../hooks/useApi";
import { api } from "../services/ApiClient";
import { formatDate } from "../helpers/formatDate";

// Should (UC-8): voor wie in Tynaarlo woont en vrijwilligerswerk buiten de gemeente doet.
// De aanmelding krijgt status "nieuw" en VIP! controleert hem.
export default function ZelfAanmeldenPage() {
    const periode = useApi("/api/periode");
    const [organisatie, setOrganisatie] = useState("");
    const [akkoord, setAkkoord] = useState(false);
    const [fouten, setFouten] = useState({});
    const [klaar, setKlaar] = useState("");

    const versturen = async (form) => {
        setFouten({});
        try {
            const result = await api.post("/api/zelf-aanmelden", { ...form, organisatie_naam: organisatie.trim(), akkoord_privacy: akkoord });
            setKlaar(result.message);
        } catch (err) {
            setFouten(err.errors);
            throw err;
        }
    };

    if (periode.loading) return <Loading />;

    if (klaar) {
        return (
            <div className="narrow">
                <h1 className="page-title">Zelf aanmelden</h1>
                <Alert type="success" title={klaar} />
            </div>
        );
    }

    if (!periode.data?.data) {
        return (
            <div className="narrow">
                <h1 className="page-title">Zelf aanmelden</h1>
                <Alert type="warning" title="Er is nu geen aanmeldperiode">Aanmelden kan alleen tijdens de aanmeldperiode.</Alert>
            </div>
        );
    }

    return (
        <>
            <h1 className="page-title">Zelf aanmelden</h1>
            <p className="muted">
                Woont u in de gemeente Tynaarlo en doet u vrijwilligerswerk buiten de gemeente? Meld u dan hier aan voor de horecabon.
                Aanmelden kan tot en met {formatDate(periode.data.data.einddatum)}.
            </p>
            <VolunteerForm
                submitLabel="Aanmelding versturen"
                onSubmit={versturen}
                disabled={!akkoord}
                externalKeys={["organisatie_naam", "akkoord_privacy"]}
                aside={
                    <FormSection title="Organisatie en privacy">
                        <TextField
                            id="organisatie_naam" label="Naam van uw organisatie" required value={organisatie}
                            onChange={(e) => setOrganisatie(e.target.value)} error={fouten.organisatie_naam?.[0]}
                        />
                        <Link to="/privacy" target="_blank" className="ext-link">
                            Lees de privacyverklaring <ExternalLink size={14} />
                        </Link>
                        <label className="consent">
                            <input type="checkbox" checked={akkoord} onChange={(e) => setAkkoord(e.target.checked)} />
                            <span>Ik ga akkoord met de privacyverklaring. Mijn gegevens gaan naar VIP! Tynaarlo en de gemeente. *</span>
                        </label>
                        {fouten.akkoord_privacy && <p className="field__error">{fouten.akkoord_privacy[0]}</p>}
                    </FormSection>
                }
            />
        </>
    );
}
