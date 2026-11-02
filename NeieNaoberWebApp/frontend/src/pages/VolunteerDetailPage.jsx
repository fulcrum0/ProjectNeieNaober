import { useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Check, Pencil, Trash2, X } from "lucide-react";
import Button from "../components/ui/Button";
import FormSection from "../components/ui/FormSection";
import DetailList from "../components/ui/DetailList";
import StatusBadge from "../components/ui/StatusBadge";
import Alert from "../components/ui/Alert";
import Loading from "../components/ui/Loading";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import VolunteerForm from "../components/volunteers/VolunteerForm";
import { useAuth } from "../context/AuthContext";
import { useApi } from "../hooks/useApi";
import { api } from "../services/ApiClient";
import { isVip } from "../data/constants";
import { formatDate, formatDateTime } from "../helpers/formatDate";
import { fullName, formatAddress, formatPostcode } from "../helpers/volunteerUtils";

export default function VolunteerDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const location = useLocation();
    const vip = isVip(user);
    // VIP! en de organisatie hebben elk hun eigen API-pad; Laravel controleert wie wat mag zien
    const basis = vip ? `/api/vip/aanmeldingen/${id}` : `/api/mijn/vrijwilligers/${id}`;
    const terug = location.state?.from || (vip ? "/admin/vrijwilligers" : "/organisatie");

    const { data, error, loading, reload } = useApi(basis);
    const [bewerken, setBewerken] = useState(false);
    const [verwijderen, setVerwijderen] = useState(false);
    const [melding, setMelding] = useState(null);
    const [busy, setBusy] = useState(false);

    if (loading && !data) return <Loading />;
    if (error) {
        return (
            <>
                <Alert type="error" title={error.message} />
                <Button variant="outline" to={terug}>Terug naar de lijst</Button>
            </>
        );
    }

    const a = data.data;
    const v = a.vrijwilliger;
    const magAanpassen = vip || a.status === "concept";

    const opslaan = async (form) => {
        await api.put(basis, form);
        setBewerken(false);
        setMelding({ type: "success", title: "De gegevens zijn opgeslagen." });
        reload();
    };

    const beoordelen = async (aanmeldingId, status) => {
        setBusy(true);
        try {
            await api.patch(`/api/vip/aanmeldingen/${aanmeldingId}/status`, { status });
            setMelding({ type: "success", title: status === "goedgekeurd" ? "De aanmelding is goedgekeurd." : "De aanmelding is afgekeurd." });
            reload();
        } catch (e) {
            setMelding({ type: "error", title: e.message, items: Object.values(e.errors).flat() });
        } finally {
            setBusy(false);
        }
    };

    const verwijder = async () => {
        setBusy(true);
        try {
            await api.delete(basis);
            navigate(terug);
        } catch (e) {
            setMelding({ type: "error", title: e.message });
            setVerwijderen(false);
        } finally {
            setBusy(false);
        }
    };

    return (
        <>
            <div className="page-head">
                <h1 className="page-title">Vrijwilliger Gegevens</h1>
                <StatusBadge status={a.status} />
            </div>

            {melding && (
                <Alert type={melding.type} title={melding.title}>
                    {melding.items?.map((m) => <p key={m}>{m}</p>)}
                </Alert>
            )}

            {!vip && a.status !== "concept" && (
                <Alert title="Deze vrijwilliger is al verstuurd">
                    U kunt de gegevens niet meer aanpassen. Klopt er iets niet? Neem contact op met VIP! Tynaarlo.
                </Alert>
            )}

            {bewerken ? (
                <VolunteerForm initial={v} onSubmit={opslaan} onCancel={() => setBewerken(false)} submitLabel="Wijzigingen opslaan" />
            ) : (
                <FormSection title={<>Gegevens van <strong>{fullName(v)}</strong></>}>
                    <DetailList
                        items={[
                            { label: "Aanhef", value: v.aanhef, half: true },
                            { label: "Voornaam", value: v.voornaam, half: true },
                            { label: "Tussenvoegsel", value: v.tussenvoegsel, half: true },
                            { label: "Achternaam", value: v.achternaam, half: true },
                            { label: "Straat en huisnummer", value: `${v.straat} ${v.huisnummer}`, half: true },
                            { label: "Postcode en woonplaats", value: `${formatPostcode(v.postcode)} ${v.woonplaats}`, half: true },
                            {
                                label: "Organisatie",
                                value: a.organisatie.zelf_aangemeld ? `${a.organisatie.naam} (zelf aangemeld)` : a.organisatie.naam,
                                half: true,
                            },
                            { label: "Toegevoegd op", value: formatDate(a.aangemaakt_op), half: true },
                            { label: "Verstuurd op", value: a.verstuurd_op ? formatDateTime(a.verstuurd_op) : "", half: true },
                            ...(vip
                                ? [{ label: "Beoordeeld", value: a.beoordeeld_op ? `${formatDateTime(a.beoordeeld_op)} door ${a.beoordeeld_door ?? "-"}` : "", half: true }]
                                : []),
                        ]}
                    />
                </FormSection>
            )}

            {!bewerken && (
                <div className="actions">
                    <Button variant="outline" to={terug}>Terug naar de lijst</Button>
                    {magAanpassen && <Button variant="outline" icon={Pencil} onClick={() => setBewerken(true)}>Aanpassen</Button>}
                    {!vip && a.status === "concept" && (
                        <Button variant="danger" icon={Trash2} onClick={() => setVerwijderen(true)}>Verwijderen</Button>
                    )}
                    {vip && a.status !== "concept" && (
                        <>
                            <Button icon={Check} disabled={busy || a.status === "goedgekeurd"} onClick={() => beoordelen(a.id, "goedgekeurd")}>
                                Goedkeuren
                            </Button>
                            <Button variant="danger" icon={X} disabled={busy || a.status === "afgekeurd"} onClick={() => beoordelen(a.id, "afgekeurd")}>
                                Afkeuren
                            </Button>
                        </>
                    )}
                </div>
            )}

            {vip && a.mogelijke_dubbels?.length > 0 && (
                <FormSection title="Mogelijk dubbele aanmeldingen">
                    <p className="muted">
                        Zelfde achternaam en adres bij een andere organisatie. Vergelijk ze en kies welke blijft; keur de andere af.
                        Het systeem voegt nooit zelf samen.
                    </p>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Vrijwilliger</th>
                                <th>Organisatie</th>
                                <th>Adres</th>
                                <th>Status</th>
                                <th>Acties</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[a, ...a.mogelijke_dubbels].map((d) => (
                                <tr key={d.id}>
                                    <td className="strong">
                                        {fullName(d.vrijwilliger)}
                                        {d.id === a.id && <span className="muted small"> (deze)</span>}
                                    </td>
                                    <td>{d.organisatie.naam}</td>
                                    <td>{formatAddress(d.vrijwilliger)}</td>
                                    <td><StatusBadge status={d.status} /></td>
                                    <td>
                                        {d.id !== a.id && (
                                            <>
                                                <Link className="link-btn" to={`/admin/vrijwilligers/${d.id}`} state={{ from: terug }}>Detail</Link>{" · "}
                                                <button className="link-btn link-btn--danger" disabled={busy || d.status === "afgekeurd"} onClick={() => beoordelen(d.id, "afgekeurd")}>
                                                    Afkeuren
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </FormSection>
            )}

            {verwijderen && (
                <ConfirmDialog
                    title="Vrijwilliger verwijderen?"
                    confirmLabel="Verwijderen"
                    variant="danger"
                    busy={busy}
                    onConfirm={verwijder}
                    onClose={() => setVerwijderen(false)}
                >
                    <p className="muted">
                        {fullName(v)} wordt uit uw lijst verwijderd. Dit kan niet ongedaan worden gemaakt.
                    </p>
                </ConfirmDialog>
            )}
        </>
    );
}
