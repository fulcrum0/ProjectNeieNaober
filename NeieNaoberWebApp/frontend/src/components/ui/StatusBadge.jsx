import { STATUS_LABELS } from "../../data/constants";

export default function StatusBadge({ status }) {
    return <span className={`badge badge--${status}`}>{STATUS_LABELS[status] ?? status}</span>;
}
