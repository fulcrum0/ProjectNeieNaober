import { useRef, useState } from "react";
import { Download } from "lucide-react";
import Button from "../ui/Button";
import { api } from "../../services/ApiClient";

// Could (US-10): veel vrijwilligers tegelijk. Laravel controleert elke rij zoals het formulier
// en slaat bij één fout niets op; de fouten per rij tonen we aan de gebruiker.
export default function UploadButton({ onResult }) {
    const fileRef = useRef(null);
    const [busy, setBusy] = useState(false);

    const upload = async (e) => {
        const file = e.target.files[0];
        e.target.value = "";
        if (!file) return;

        const data = new FormData();
        data.append("bestand", file);
        setBusy(true);
        try {
            const result = await api.post("/api/mijn/vrijwilligers/upload", data);
            onResult({ type: "success", title: result.message });
        } catch (error) {
            onResult({
                type: "error",
                title: error.message,
                items: error.data.fouten?.map((f) => `Rij ${f.rij}: ${f.meldingen.join(" ")}`) || Object.values(error.errors).flat(),
            });
        } finally {
            setBusy(false);
        }
    };

    return (
        <>
            <Button variant="outline" icon={Download} disabled={busy} onClick={() => fileRef.current.click()}>
                {busy ? "Bezig..." : "Excel Import"}
            </Button>
            <input ref={fileRef} type="file" accept=".xlsx,.csv" hidden onChange={upload} />
        </>
    );
}
