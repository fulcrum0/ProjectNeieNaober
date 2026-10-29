import * as XLSX from "xlsx";

export function exportToExcel(rows, sheetName, filename) {
    const book = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, XLSX.utils.json_to_sheet(rows), sheetName);
    XLSX.writeFile(book, filename);
}