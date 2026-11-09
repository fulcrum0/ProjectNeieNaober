import { Link } from "react-router-dom";
import StatusBadge from "../ui/StatusBadge";
import { formatDate } from "../../helpers/formatDate";
import { fullName, formatAddress } from "../../helpers/volunteerUtils";

export default function VolunteerRow({ volunteer: v, selected, onToggle, detailTo, onDelete, showStatus, locked }) {
    return (
        <tr>
            <td className="col-check">
                <input type="checkbox" checked={selected} onChange={() => onToggle(v.id)} />
            </td>
            <td className="strong" title={fullName(v)}>{fullName(v)}</td>
            <td title={v.email}>{v.email}</td>
            <td>{formatDate(v.createdAt)}</td>
            <td title={formatAddress(v)}>{formatAddress(v)}</td>
            {showStatus && <td><StatusBadge volunteer={v} /></td>}
            <td><Link className="link-btn" to={detailTo}>Detail</Link></td>
            <td>
                <button
                    className="link-btn link-btn--danger" onClick={() => onDelete([v.id])} disabled={locked}
                    title={locked ? "Al verstuurd naar VIP! Tynaarlo" : undefined}
                >
                    Verwijderen
                </button>
            </td>
        </tr>
    );
}
