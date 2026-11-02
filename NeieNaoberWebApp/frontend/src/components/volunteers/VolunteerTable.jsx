import { Link, useLocation } from "react-router-dom";
import StatusBadge from "../ui/StatusBadge";
import { formatDate } from "../../helpers/formatDate";
import { fullName, formatAddress } from "../../helpers/volunteerUtils";

// Eén tabel voor beide rollen: de organisatie ziet haar eigen lijst, VIP! ziet ook de organisatie
export default function VolunteerTable({ aanmeldingen, detailPath, showOrganisation = false, emptyText }) {
    // Onthoud de lijst met filters, zodat "Terug naar de lijst" op het detail dezelfde lijst laat zien
    const location = useLocation();
    const from = location.pathname + location.search;

    return (
        <table className="table">
            <thead>
                <tr>
                    <th>Vrijwilliger</th>
                    {showOrganisation && <th>Organisatie</th>}
                    <th>Adres</th>
                    <th>Status</th>
                    <th>Toegevoegd</th>
                    <th style={{ width: 90 }}>Detail</th>
                </tr>
            </thead>
            <tbody>
                {aanmeldingen.length === 0 && (
                    <tr>
                        <td className="empty" colSpan={showOrganisation ? 6 : 5}>
                            {emptyText}
                        </td>
                    </tr>
                )}
                {aanmeldingen.map((a) => (
                    <tr key={a.id}>
                        <td className="strong">
                            {[a.vrijwilliger.aanhef, fullName(a.vrijwilliger)].filter(Boolean).join(" ")}
                            {a.mogelijk_dubbel && (
                                <>
                                    {" "}
                                    <span className="badge badge--dubbel">Mogelijk dubbel</span>
                                </>
                            )}
                        </td>
                        {showOrganisation && (
                            <td>
                                {a.organisatie.naam}
                                {a.organisatie.zelf_aangemeld && <span className="muted small"> (zelf aangemeld)</span>}
                            </td>
                        )}
                        <td>{formatAddress(a.vrijwilliger)}</td>
                        <td>
                            <StatusBadge status={a.status} />
                        </td>
                        <td>{formatDate(a.aangemaakt_op)}</td>
                        <td>
                            <Link className="link-btn" to={detailPath(a.id)} state={{ from }}>
                                Detail
                            </Link>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
