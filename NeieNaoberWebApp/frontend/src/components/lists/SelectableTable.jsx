export default function SelectableTable({ columns, items, selection, renderRow }) {
    return (
        <table className="table">
            <thead>
                <tr>
                    <th className="col-check">
                        <input type="checkbox" checked={selection.allSelected} onChange={selection.toggleAll} />
                    </th>
                    {columns.map((c) => (
                        <th key={c}>{c}</th>
                    ))}
                </tr>
            </thead>
            <tbody>{items.map(renderRow)}</tbody>
        </table>
    );
}