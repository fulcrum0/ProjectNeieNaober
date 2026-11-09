export default function SelectableTable({ columns, items, selection, renderRow, singleLine = false }) {
    return (
        <table className={singleLine ? "table table--single-line" : "table"}>
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