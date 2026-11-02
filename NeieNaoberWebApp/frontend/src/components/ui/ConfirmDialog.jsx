import Button from "./Button";

// Zelfde stijl als ExportDialog. Geen window.confirm: die is klein en slecht leesbaar voor oudere gebruikers.
export default function ConfirmDialog({ title, children, confirmLabel, variant = "primary", confirmDisabled, busy, onConfirm, onClose }) {
    return (
        <div className="dialog-backdrop" onClick={onClose}>
            <div className="dialog" role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}>
                <h2 className="dialog__title">{title}</h2>
                {children}
                <div className="dialog__actions">
                    <Button variant="outline" onClick={onClose}>Annuleren</Button>
                    <Button variant={variant} disabled={confirmDisabled || busy} onClick={onConfirm}>
                        {busy ? "Bezig..." : confirmLabel}
                    </Button>
                </div>
            </div>
        </div>
    );
}
