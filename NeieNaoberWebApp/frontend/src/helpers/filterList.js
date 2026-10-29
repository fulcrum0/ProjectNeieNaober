export function filterList(list, query, getFields) {
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter((item) => getFields(item).some((f) => String(f).toLowerCase().includes(q)));
}