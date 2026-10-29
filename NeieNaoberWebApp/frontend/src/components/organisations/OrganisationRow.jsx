import { Link } from "react-router-dom";

export default function OrganisationRow({ organisation: o, count, selected, onToggle, onDelete }) {
    return (
        <tr>
            <td className="col-check">
                <input type="checkbox" checked={selected} onChange={() => onToggle(o.id)} />
            </td>
            <td className="strong">{o.name}</td>
            <td>{o.location}</td>
            <td>{count}</td>
            <td><Link className="link-btn" to={`/admin/organisaties/${o.id}`}>Aanpassen</Link></td>
            <td>
                <button className="link-btn link-btn--danger" onClick={() => onDelete([o.id])}>Verwijderen</button>
            </td>
        </tr>
    );
}