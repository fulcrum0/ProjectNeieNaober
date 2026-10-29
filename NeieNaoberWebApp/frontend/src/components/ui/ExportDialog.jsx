import { useState } from "react";
import Button from "./Button";

export default function ExportDialog({ total, selectedCount, onConfirm, onClose }) {
    const [mode, setMode] = useState(selectedCount ? "selected" : "all");

    return (
        <div className="dialog-backdrop" onClick={onClose}>
            <div className="dialog" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
                <h2 className="dialog__title">Excel Export</h2>
                <p className="muted">Wat wil je exporteren?</p>

                <label className="dialog__option">
                    <input type="radio" name="export-mode" checked={mode === "all"} onChange={() => setMode("all")} />
                    <span>Hele lijst ({total})</span>
                </label>
                <label className={`dialog__option ${selectedCount ? "" : "dialog__option--disabled"}`}>
                    <input
                        type="radio" name="export-mode" disabled={!selectedCount}
                        checked={mode === "selected"} onChange={() => setMode("selected")}
                    />
                    <span>Alleen geselecteerd ({selectedCount})</span>
                </label>

                <div className="dialog__actions">
                    <Button variant="outline" onClick={onClose}>Annuleren</Button>
                    <Button onClick={() => onConfirm(mode)}>Exporteren</Button>
                </div>
            </div>
        </div>
    );
}