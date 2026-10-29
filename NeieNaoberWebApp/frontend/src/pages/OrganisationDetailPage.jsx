import { Navigate, useNavigate, useParams } from "react-router-dom";
import Button from "../components/ui/Button";
import FormSection from "../components/ui/FormSection";
import DetailList from "../components/ui/DetailList";
import { useData } from "../context/DataContext";

export default function OrganisationDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getOrganisation, volunteers } = useData();
    const o = getOrganisation(id);

    if (!o) return <Navigate to="/admin/organisaties" replace />;

    return (
        <>
            <h1 className="page-title">Organisatie Gegevens</h1>
            <FormSection title={<>Gegevens van <strong>{o.name}</strong></>}>
                <DetailList
                    items={[
                        { label: "Organisatienaam", value: o.name },
                        { label: "Contact Nummer", value: o.phone },
                        { label: "Contact Mail", value: o.email },
                        { label: "Locatie", value: o.location },
                        { label: "Aantal vrijwilligers", value: volunteers.filter((v) => v.orgId === o.id).length },
                        { label: "Soort", value: o.type },
                    ]}
                />
            </FormSection>
            <Button variant="outline" onClick={() => navigate(-1)}>Terug</Button>
        </>
    );
}