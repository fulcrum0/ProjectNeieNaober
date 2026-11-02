export function formatDate(iso) {
    if (!iso) return "-";
    return new Date(iso)
        .toLocaleDateString("nl-NL", { day: "numeric", month: "short", year: "numeric" })
        .replace(".", "");
}

export function formatDateTime(iso) {
    if (!iso) return "-";
    return new Date(iso).toLocaleString("nl-NL", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}
