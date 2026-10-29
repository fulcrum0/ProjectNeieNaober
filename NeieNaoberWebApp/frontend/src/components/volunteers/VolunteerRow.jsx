import { Link } from "react-router-dom";
import { formatDate } from "../../helpers/formatDate";
import { fullName, formatAddress } from "../../helpers/volunteerUtils";

export default function VolunteerRow({ volunteer: v, selected, onToggle, detailTo, onDelete }) {
    return (
        <tr>
            <td className="col-check">
                <input type="checkbox" checked={selected} onChange={() => onToggle(v.id)} />
            </td>
            <td className="strong">{fullName(v)}</td>
            <td>{v.email}</td>
            <td>{formatDate(v.createdAt)}</td>
            <td>{formatAddress(v)}</td>
            <td><Link className="link-btn" to={detailTo}>Detail</Link></td>
            <td>
                <button className="link-btn link-btn--danger" onClick={() => onDelete([v.id])}>Verwijderen</button>
            </td>
        </tr>
    );
}