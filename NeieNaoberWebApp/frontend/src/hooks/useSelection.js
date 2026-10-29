import { useState } from "react";

export function useSelection(items) {
    const [selected, setSelected] = useState([]);
    const allSelected = items.length > 0 && items.every((i) => selected.includes(i.id));
    const toggle = (id) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
    const toggleAll = () => setSelected(allSelected ? [] : items.map((i) => i.id));
    const clear = () => setSelected([]);
    return { selected, allSelected, toggle, toggleAll, clear };
}