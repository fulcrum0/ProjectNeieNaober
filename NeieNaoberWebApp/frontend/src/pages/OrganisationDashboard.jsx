import { useState } from "react";
import { Plus, Upload } from "lucide-react";
import StatCard from "../components/ui/StatCard";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";
import Loading from "../components/ui/Loading";
import Pagination from "../components/ui/Pagination";
import VolunteerTable from "../components/volunteers/VolunteerTable";
import VersturenPanel from "../components/organisation/VersturenPanel";
import UploadButton from "../components/organisation/UploadButton";
import { useAuth } from "../context/AuthContext";
import { useApi } from "../hooks/useApi";
import { api } from "../services/ApiClient";
import { formatDate } from "../helpers/formatDate";

export default function OrganisationDashboard() {
    const { user } = useAuth();
    const [page, setPage] = useState(1);
    const [melding, setMelding] = useState(null);
    const { data, error, loading, reload } = useApi("/api/mijn/vrijwilligers", { page });

    const exporteren = async () => {
        try {
            await api.download("/api/mijn/export", null, "vrijwilligers.xlsx");
        } catch (e) {
            setMelding({ type: "error", title: e.message });
        }
    };

    const naUpload = (result) => {
        setMelding(result);
        reload();
    };

    const periode = data?.periode;

    return (
        <>
            <div className="page-head">
                <h1 className="page-title">Dashboard</h1>
                {periode && <Button to="/organisatie/vrijwilligers/nieuw" icon={Plus}>Vrijwilliger registreren</Button>}
            </div>

            <div className="stats stats--org3">
                <StatCard large label="Welkom" value={user.naam} />
                <StatCard label="In mijn lijst" value={data?.meta.total ?? "-"} />
                <StatCard label="Nog niet verstuurd" value={data?.aantal_concept ?? "-"} />
            </div>

            {data && !periode && (
                <Alert type="warning" title="Er is nu geen aanmeldperiode">
                    Aanmelden kan alleen tijdens de aanmeldperiode. Vragen? Neem contact op met VIP! Tynaarlo.
                </Alert>
            )}
            {periode && (
                <p className="muted">
                    Aanmeldperiode <strong>{periode.naam}</strong>: aanmelden kan tot en met {formatDate(periode.einddatum)}.
                </p>
            )}

            {melding && (
                <Alert type={melding.type} title={melding.title}>
                    {melding.items?.length > 0 && (
                        <ul>
                            {melding.items.map((m) => (
                                <li key={m}>{m}</li>
                            ))}
                        </ul>
                    )}
                </Alert>
            )}
            {error && <Alert type="error" title={error.message} />}

            {data?.aantal_concept > 0 && (
                <VersturenPanel
                    aantal={data.aantal_concept}
                    onVerstuurd={(result) => {
                        setMelding({ type: "success", title: `${result.message} (${result.aantal_verstuurd} vrijwilligers)` });
                        reload();
                    }}
                />
            )}

            <div className="card table-card">
                <div className="table-toolbar">
                    <h2 className="form-section__subtitle">Mijn vrijwilligers</h2>
                    <div className="table-toolbar__actions">
                        {periode && <UploadButton onResult={naUpload} />}
                        <Button variant="outline" icon={Upload} onClick={exporteren}>Excel Export</Button>
                    </div>
                </div>
                {loading && !data ? (
                    <Loading />
                ) : (
                    <VolunteerTable
                        aanmeldingen={data?.data ?? []}
                        detailPath={(id) => `/organisatie/vrijwilligers/${id}`}
                        emptyText="Nog geen vrijwilligers. Klik op 'Vrijwilliger registreren'."
                    />
                )}
                <Pagination meta={data?.meta} noun="vrijwilligers" onPage={setPage} />
            </div>
            {periode && (
                <p className="muted small">
                    Excel Import: rij 1 met de kolommen Aanhef, Voornaam, Tussenvoegsel, Achternaam, Straat, Huisnummer, Postcode en
                    Woonplaats. Bij één fout wordt niets opgeslagen.
                </p>
            )}
        </>
    );
}
