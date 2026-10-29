import { Trash2 } from "lucide-react";
import Button from "../ui/Button";

export default function ListFooter({ shown, total, noun, disabled, onDelete }) {
    return (
        <div className="table-footer">
            <span>
                {shown ? `1–${shown}` : 0} van {total} {noun}
            </span>
            <Button variant="danger" icon={Trash2} disabled={disabled} onClick={onDelete}>
                Verwijderen
            </Button>
        </div>
    );
}