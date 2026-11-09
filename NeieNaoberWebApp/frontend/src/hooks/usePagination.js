import { useState } from "react";

const PAGE_SIZE = 25;

export function usePagination(items) {
    const [page, setPage] = useState(1);

    const pageCount = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
    const current = Math.min(page, pageCount);
    const start = (current - 1) * PAGE_SIZE;
    const pageItems = items.slice(start, start + PAGE_SIZE);

    return {
        pageItems,
        page: current,
        pageCount,
        total: items.length,
        from: start + 1,
        to: start + pageItems.length,
        previous: () => setPage(current - 1),
        next: () => setPage(current + 1),
        reset: () => setPage(1),
    };
}
