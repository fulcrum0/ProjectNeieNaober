import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "./Button";

// De API geeft 50 rijen per pagina (TO 5); meta komt mee in elk lijst-antwoord
export default function Pagination({ meta, noun, onPage }) {
    if (!meta) return null;
    return (
        <div className="table-footer pagination">
            <span>
                {meta.total ? `${meta.from}–${meta.to}` : 0} van {meta.total} {noun}
            </span>
            {meta.last_page > 1 && (
                <div className="pagination__buttons">
                    <Button variant="outline" icon={ChevronLeft} disabled={meta.current_page <= 1} onClick={() => onPage(meta.current_page - 1)}>
                        Vorige
                    </Button>
                    <span>
                        Pagina {meta.current_page} van {meta.last_page}
                    </span>
                    <Button variant="outline" disabled={meta.current_page >= meta.last_page} onClick={() => onPage(meta.current_page + 1)}>
                        Volgende <ChevronRight size={18} />
                    </Button>
                </div>
            )}
        </div>
    );
}
