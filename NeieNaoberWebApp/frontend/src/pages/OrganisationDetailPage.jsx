import { useState } from "react";
import { useParams } from "react-router-dom";
import { Mail, Users } from "lucide-react";
import Button from "../components/ui/Button";
import FormSection from "../components/ui/FormSection";
import DetailList from "../components/ui/DetailList";
import Alert from "../components/ui/Alert";
import Loading from "../components/ui/Loading";
import { useAuth } from "../context/AuthContext";
import { useApi } from "../hooks/useApi";
import { api } from "../services/ApiClient";
import { isBeheerder } from "../data/constants";
import { formatDate } from "../helpers/formatDate";

export default function OrganisationDetailPage() {
    const { id } = useParams();
    const { user } = useAuth();
    const { data, error, loading } = useApi(`/api/vip/organisaties/${id}`);
    const [melding, setMelding] = useState(null);

    // UC-9, 5a: is de link verlopen? Dan stuurt de beheerder een nieuwe uitnodiging
    const uitnodigen = async () => {
        try {
            const result = await api.post(`/api/beheer/organisaties/${id}/uitnodiging`);
            setMelding({ type: "success", title: result.message });
        } catch (e) {
            setMelding({ type: "error", title: e.message });
        }
    };

    if (loading && !data) return <Loading />;
    if (error) return <Alert type="error" title={error.message} />;

    const o = data.data;

    return (
        <>
            <h1 className="page-title">Organisatie Gegevens</h1>
            {melding && <Alert type={melding.type} title={melding.title} />}
            <FormSection title={<>Gegevens van <strong>{o.naam}</strong></>}>
                <DetailList
                    items={[
                        { label: "Organisatienaam", value: o.naam, half: true },
                        { label: "Plaats", value: o.plaats, half: true },
                        { label: "E-mail account", value: o.email, half: true },
                        { label: "Aangemaakt op", value: formatDate(o.aangemaakt_op), half: true },
                        { label: "Aanmeldingen (verstuurd)", value: String(o.aantal_aanmeldingen), half: true },
                        { label: "Nog te controleren", value: String(o.aantal_nieuw), half: true },
                        { label: "Goedgekeurd", value: String(o.aantal_goedgekeurd), half: true },
                    ]}
                />
            </FormSection>
            <div className="actions">
                <Button variant="outline" to="/admin/organisaties">Terug</Button>
                <Button icon={Users} to={`/admin/vrijwilligers?organisatie=${o.id}`}>Aanmeldingen bekijken</Button>
                {isBeheerder(user) && <Button variant="outline" icon={Mail} onClick={uitnodigen}>Nieuwe uitnodiging sturen</Button>}
            </div>
        </>
    );
}
