import { useState } from "react";
import ListToolbar from "../lists/ListToolbar";
import ListFooter from "../lists/ListFooter";
import SelectableTable from "../lists/SelectableTable";
import VolunteerRow from "./VolunteerRow";
import { useData } from "../../context/DataContext";
import { useSelection } from "../../hooks/useSelection";
import { filterList } from "../../helpers/filterList";
import { exportToExcel } from "../../helpers/exportExcel";
import { volunteerToRow, rowToVolunteer } from "../../helpers/excelMappers";
import { fullName, formatAddress } from "../../helpers/volunteerUtils";
import ExportDialog from "../ui/ExportDialog";

const COLUMNS = ["Vrijwilliger", "Email", "Ingediend", "Adres", "Detail", "Verwijderen"];

export default function VolunteerTable({ volunteers, detailPath, onDelete, onImport }) {
    const [exportOpen, setExportOpen] = useState(false);
    const { organisations } = useData();
    const [query, setQuery] = useState("");
    const visible = filterList(volunteers, query, (v) => [fullName(v), v.email, formatAddress(v)]);
    const selection = useSelection(visible);

    const orgName = (id) => organisations.find((o) => o.id === id)?.name ?? "";

    const remove = (ids) => {
        onDelete(ids);
        selection.clear();
    };

    const handleExport = (mode) => {
        const source = mode === "selected" ? volunteers.filter((v) => selection.selected.includes(v.id)) : volunteers;
        exportToExcel(source.map((v) => volunteerToRow(v, orgName(v.orgId))), "Vrijwilligers", "vrijwilligers.xlsx");
        setExportOpen(false);
    };

    return (
        <div className="card table-card">
            <ListToolbar
                placeholder="Zoek vrijwilliger"
                query={query}
                onQuery={setQuery}
                onExport={() => setExportOpen(true)}
                onImport={onImport && ((rows) => onImport(rows.map(rowToVolunteer)))}
            />
            <SelectableTable
                columns={COLUMNS}
                items={visible}
                selection={selection}
                renderRow={(v) => (
                    <VolunteerRow
                        key={v.id}
                        volunteer={v}
                        selected={selection.selected.includes(v.id)}
                        onToggle={selection.toggle}
                        detailTo={detailPath(v.id)}
                        onDelete={remove}
                    />
                )}
            />
            <ListFooter
                shown={visible.length}
                total={volunteers.length}
                noun="vrijwilligers"
                disabled={!selection.selected.length}
                onDelete={() => remove(selection.selected)}
            />
            {exportOpen && (
                <ExportDialog
                    total={volunteers.length}
                    selectedCount={selection.selected.length}
                    onConfirm={handleExport}
                    onClose={() => setExportOpen(false)}
                />
            )}
        </div>
    );
}