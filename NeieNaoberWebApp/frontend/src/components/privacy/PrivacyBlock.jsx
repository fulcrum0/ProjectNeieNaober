export default function PolicyBlock({ block }) {
    switch (block.type) {
        case "p":
            return <p>{block.text}</p>;
        case "strong":
            return <p><strong>{block.text}</strong></p>;
        case "table":
            return (
                <dl className="policy-table">
                    {block.rows.map(([k, v]) => (
                        <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
                    ))}
                </dl>
            );
        case "roles":
            return block.items.map((r) => (
                <div key={r.title} className="policy-role">
                    <strong>{r.title}</strong>
                    <p>{r.text}</p>
                </div>
            ));
        case "info":
            return (
                <aside className="note note--info">
                    <strong>{block.title}</strong>
                    <p>{block.text}</p>
                </aside>
            );
        case "contact":
            return (
                <aside className="note note--contact">
                    <strong>{block.title}</strong>
                    <a href={`mailto:${block.email}`}>{block.email}</a>
                    <p>{block.text}</p>
                </aside>
            );
        default:
            return null;
    }
}