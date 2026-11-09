import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import Button from "../ui/Button";

export default function ListFooter({ pagination: p, noun, selected, disabled, onDelete }) {
    return (
        <div className="table-footer">
            <span>
                {p.total ? `${p.from}–${p.to}` : 0} van {p.total} {noun}
                {selected > 0 && ` · ${selected} geselecteerd`}
            </span>
            {p.pageCount > 1 && (
                <nav className="table-pager" aria-label="Paginering">
                    <Button variant="outline" icon={ChevronLeft} disabled={p.page === 1} onClick={p.previous}>Vorige</Button>
                    <span>Pagina {p.page} van {p.pageCount}</span>
                    <Button variant="outline" disabled={p.page === p.pageCount} onClick={p.next}>
                        Volgende <ChevronRight size={18} />
                    </Button>
                </nav>
            )}
            <Button variant="danger" icon={Trash2} disabled={disabled} onClick={onDelete}>
                Verwijderen
            </Button>
        </div>
    );
}
