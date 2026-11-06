import { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, Plus, Send } from "lucide-react";
import Button from "../components/ui/Button";
import StatCard from "../components/ui/StatCard";
import SelectableTable from "../components/lists/SelectableTable";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import { useSelection } from "../hooks/useSelection";
import { formatDate } from "../helpers/formatDate";
import { formatAddress, fullName, isConcept } from "../helpers/volunteerUtils";

const COLUMNS = ["Vrijwilliger", "Email", "Ingediend", "Adres"];

export default function SendPage() {
    const { user } = useAuth();
    const { volunteers, sendVolunteers } = useData();
    const mine = volunteers.filter((v) => v.orgId === user.orgId);
    const concepts = mine.filter(isConcept);
    const sent = mine.filter((v) => !isConcept(v)).sort((a, b) => b.sentAt.localeCompare(a.sentAt));

    const selection = useSelection(concepts, concepts.map((v) => v.id));
    const chosen = selection.selected.filter((id) => concepts.some((v) => v.id === id));
    const [confirmed, setConfirmed] = useState(false);
    const [sending, setSending] = useState(false);
    const [result, setResult] = useState(null);

    const handleSend = async () => {
        setSending(true);
        const done = await sendVolunteers(chosen);
        setSending(false);
        if (done.length) {
            setResult(done.length);
            setConfirmed(false);
            selection.clear();
        }
    };

    return (
        <>
            <h1 className="page-title">Gegevens versturen</h1>

            {result && (
                <div className="note note--success" role="status">
                    <CheckCircle2 size={20} />
                    <p>{result === 1 ? "1 vrijwilliger is" : `${result} vrijwilligers zijn`} verstuurd naar VIP! Tynaarlo.</p>
                </div>
            )}

            <div className="stats stats--pair">
                <StatCard label="Klaar om te versturen" value={concepts.length} />
                <StatCard label="Al verstuurd" value={sent.length} />
            </div>

            <section className="card table-card send-section">
                <h2 className="send-section__title">Nog niet verstuurd</h2>
                {concepts.length === 0 ? (
                    <div className="empty-state">
                        <p className="muted">Alle geregistreerde vrijwilligers zijn verstuurd.</p>
                        <Button to="/organisatie/vrijwilligers/nieuw" icon={Plus}>Vrijwilliger registreren</Button>
                    </div>
                ) : (
                    <>
                        <SelectableTable
                            columns={COLUMNS}
                            items={concepts}
                            selection={selection}
                            renderRow={(v) => (
                                <tr key={v.id}>
                                    <td className="col-check">
                                        <input
                                            type="checkbox" aria-label={`Selecteer ${fullName(v)}`}
                                            checked={selection.selected.includes(v.id)} onChange={() => selection.toggle(v.id)}
                                        />
                                    </td>
                                    <td className="strong">
                                        <Link className="link-plain" to={`/organisatie/vrijwilligers/${v.id}`}>{fullName(v)}</Link>
                                    </td>
                                    <td>{v.email}</td>
                                    <td>{formatDate(v.createdAt)}</td>
                                    <td>{formatAddress(v)}</td>
                                </tr>
                            )}
                        />
                        <label className="consent send-consent">
                            <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} />
                            <span>
                                Ik heb de gegevens gecontroleerd en verstuur {chosen.length === 1 ? "1 vrijwilliger" : `${chosen.length} vrijwilligers`} naar
                                VIP! Tynaarlo. *
                            </span>
                        </label>
                        <div className="form-actions">
                            <Button variant="outline" to="/organisatie">Terug naar overzicht</Button>
                            <Button icon={Send} disabled={!chosen.length || !confirmed || sending} onClick={handleSend}>
                                {sending ? "Bezig met versturen…" : `Versturen (${chosen.length})`}
                            </Button>
                        </div>
                    </>
                )}
            </section>

            {sent.length > 0 && (
                <section className="card table-card send-section">
                    <h2 className="send-section__title">Al verstuurd</h2>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Vrijwilliger</th>
                                <th>Email</th>
                                <th>Ingediend</th>
                                <th>Verstuurd op</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sent.map((v) => (
                                <tr key={v.id}>
                                    <td className="strong">
                                        <Link className="link-plain" to={`/organisatie/vrijwilligers/${v.id}`}>{fullName(v)}</Link>
                                    </td>
                                    <td>{v.email}</td>
                                    <td>{formatDate(v.createdAt)}</td>
                                    <td>{formatDate(v.sentAt)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            )}
        </>
    );
}
