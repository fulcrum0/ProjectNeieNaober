import { ChevronDown } from "lucide-react";

// Met onClick wordt de kaart een knop die een lijst open- en dichtklapt
export default function StatCard({ label, value, large = false, onClick, expanded }) {
    const content = (
        <>
            <span className="stat-card__label">{label}</span>
            <span className={large ? "stat-card__value stat-card__value--lg" : "stat-card__value"}>{value}</span>
        </>
    );

    if (!onClick) return <div className="card stat-card">{content}</div>;

    return (
        <button
            type="button"
            className={`card stat-card stat-card--button ${expanded ? "stat-card--open" : ""}`}
            aria-expanded={expanded}
            onClick={onClick}
        >
            {content}
            <span className="stat-card__hint">
                {expanded ? "Lijst verbergen" : "Lijst bekijken"} <ChevronDown size={16} className="stat-card__chevron" />
            </span>
        </button>
    );
}
