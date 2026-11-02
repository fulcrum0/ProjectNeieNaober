import { Link } from "react-router-dom";

export default function OrganisationTable({ organisaties }) {
    return (
        <table className="table">
            <thead>
                <tr>
                    <th>Organisatie</th>
                    <th>Plaats</th>
                    <th>E-mail account</th>
                    <th>Aanmeldingen</th>
                    <th>Nieuw</th>
                    <th>Goedgekeurd</th>
                    <th style={{ width: 90 }}>Detail</th>
                </tr>
            </thead>
            <tbody>
                {organisaties.length === 0 && (
                    <tr>
                        <td className="empty" colSpan={7}>Geen organisaties gevonden.</td>
                    </tr>
                )}
                {organisaties.map((o) => (
                    <tr key={o.id}>
                        <td className="strong">{o.naam}</td>
                        <td>{o.plaats}</td>
                        <td>{o.email}</td>
                        <td>{o.aantal_aanmeldingen}</td>
                        <td>{o.aantal_nieuw}</td>
                        <td>{o.aantal_goedgekeurd}</td>
                        <td>
                            <Link className="link-btn" to={`/admin/organisaties/${o.id}`}>Detail</Link>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
