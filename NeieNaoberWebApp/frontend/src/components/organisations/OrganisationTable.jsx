import { useState } from "react";
import ListToolbar from "../lists/ListToolbar";
import ListFooter from "../lists/ListFooter";
import SelectableTable from "../lists/SelectableTable";
import OrganisationRow from "./OrganisationRow";
import { useData } from "../../context/DataContext";
import { useSelection } from "../../hooks/useSelection";
import { filterList } from "../../helpers/filterList";
import { exportToExcel } from "../../helpers/exportExcel";
import { organisationToRow, rowToOrganisation } from "../../helpers/excelMappers";
import ExportDialog from "../ui/ExportDialog";

const COLUMNS = ["Organisatie", "Locatie", "Totaal Vrijwilliger", "Aanpassen", "Verwijderen"];

export default function OrganisationTable() {
    const [exportOpen, setExportOpen] = useState(false);
    const { organisations, volunteers, removeOrganisations, importOrganisations } = useData();
    const [query, setQuery] = useState("");
    const visible = filterList(organisations, query, (o) => [o.name, o.location]);
    const selection = useSelection(visible);

    const count = (id) => volunteers.filter((v) => v.orgId === id).length;

    const remove = (ids) => {
        removeOrganisations(ids);
        selection.clear();
    };

    const handleExport = (mode) => {
        const source = mode === "selected" ? organisations.filter((o) => selection.selected.includes(o.id)) : organisations;
        exportToExcel(source.map((o) => organisationToRow(o, count(o.id))), "Organisaties", "organisaties.xlsx");
        setExportOpen(false);
    };

    return (
        <div className="card table-card">
            <ListToolbar
                placeholder="Zoek organisatie"
                query={query}
                onQuery={setQuery}
                onExport={() => setExportOpen(true)}
                onImport={(rows) => importOrganisations(rows.map(rowToOrganisation))}
            />
            <SelectableTable
                columns={COLUMNS}
                items={visible}
                selection={selection}
                renderRow={(o) => (
                    <OrganisationRow
                        key={o.id}
                        organisation={o}
                        count={count(o.id)}
                        selected={selection.selected.includes(o.id)}
                        onToggle={selection.toggle}
                        onDelete={remove}
                    />
                )}
            />
            <ListFooter
                shown={visible.length}
                total={organisations.length}
                noun="organisatie"
                disabled={!selection.selected.length}
                onDelete={() => remove(selection.selected)}
            />
            {exportOpen && (
                <ExportDialog
                    total={organisations.length}
                    selectedCount={selection.selected.length}
                    onConfirm={handleExport}
                    onClose={() => setExportOpen(false)}
                />
            )}
        </div>
    );
}