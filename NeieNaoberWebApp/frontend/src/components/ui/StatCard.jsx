export default function StatCard({ label, value, large = false }) {
    return (
        <div className="card stat-card">
            <span className="stat-card__label">{label}</span>
            <span className={large ? "stat-card__value stat-card__value--lg" : "stat-card__value"}>{value}</span>
        </div>
    );
}