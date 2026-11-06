import { useRef } from "react";
import { Search, Download, Upload } from "lucide-react";
import Button from "../ui/Button";
import { readExcelRows } from "../../helpers/importExcel";

export default function ListToolbar({ placeholder, query, onQuery, onExport, onImport }) {
    const fileRef = useRef(null);

    const handleFile = async (e) => {
        const file = e.target.files[0];
        if (file) onImport(await readExcelRows(file));
        e.target.value = "";
    };

    return (
        <div className="table-toolbar">
            <div className="search">
                <Search size={18} />
                <input placeholder={placeholder} value={query} onChange={(e) => onQuery(e.target.value)} />
            </div>
            <div className="table-toolbar__actions">
                {onImport && (
                    <>
                        <Button variant="outline" icon={Download} onClick={() => fileRef.current.click()}>
                            Excel Import
                        </Button>
                        <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" hidden onChange={handleFile} />
                    </>
                )}
                <Button variant="outline" icon={Upload} onClick={onExport}>
                    Excel Export
                </Button>
            </div>
        </div>
    );
}