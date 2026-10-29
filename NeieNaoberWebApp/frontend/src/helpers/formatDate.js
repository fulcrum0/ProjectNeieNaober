export function formatDate(iso) {
    return new Date(iso)
        .toLocaleDateString("nl-NL", { day: "numeric", month: "short", year: "numeric" })
        .replace(".", "");
}