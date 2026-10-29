import * as XLSX from "xlsx";

export async function readExcelRows(file) {
    const book = XLSX.read(await file.arrayBuffer());
    return XLSX.utils.sheet_to_json(book.Sheets[book.SheetNames[0]]);
}