export default function DetailList({ items }) {
    return (
        <dl className="detail-list">
            {items.map(({ label, value, half }) => (
                <div key={label} className={half ? "" : "detail-list__full"}>
                    <dt>{label}</dt>
                    <dd>{value || "-"}</dd>
                </div>
            ))}
        </dl>
    );
}