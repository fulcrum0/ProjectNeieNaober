import { useNavigate } from "react-router-dom";
import VolunteerForm from "../components/volunteers/VolunteerForm";
import FormSection from "../components/ui/FormSection";
import TextField from "../components/ui/TextField";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/ApiClient";

export default function VolunteerRegisterPage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const opslaan = async (form) => {
        await api.post("/api/mijn/vrijwilligers", form);
        navigate("/organisatie");
    };

    return (
        <>
            <h1 className="page-title">Vrijwilliger Registreren</h1>
            <VolunteerForm
                submitLabel="Opslaan in mijn lijst"
                onSubmit={opslaan}
                onCancel={() => navigate("/organisatie")}
                aside={
                    <FormSection title="Organisatie">
                        <TextField id="org" label="Organisatie" value={user.organisatie?.naam ?? ""} readOnly disabled />
                        <p className="muted">
                            De vrijwilliger komt in uw lijst met de status <strong>concept</strong>. Als de lijst klaar is,
                            verstuurt u hem op het dashboard. Daar zet u ook het vinkje voor de privacyverklaring.
                        </p>
                        <p className="muted small">
                            Een vrijwilliger kan per periode bij maximaal 3 organisaties aangemeld worden.
                        </p>
                    </FormSection>
                }
            />
        </>
    );
}
