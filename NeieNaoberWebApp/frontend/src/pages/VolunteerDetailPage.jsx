import { Navigate, useNavigate, useParams } from "react-router-dom";
import Button from "../components/ui/Button";
import FormSection from "../components/ui/FormSection";
import DetailList from "../components/ui/DetailList";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import { ROLES } from "../data/constants";
import { formatDate } from "../helpers/formatDate";
import { fullName, formatAddress, calcAge } from "../helpers/volunteerUtils";

export default function VolunteerDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { getVolunteer } = useData();
    const v = getVolunteer(id);

    if (!v || (user.role === ROLES.ORG && v.orgId !== user.orgId)) return <Navigate to="/" replace />;

    const birth = v.birthDate ? `${formatDate(v.birthDate)} (${calcAge(v.birthDate)} jaar)` : "";

    return (
        <>
            <h1 className="page-title">Vrijwilliger Gegevens</h1>
            <FormSection title={<>Gegevens van <strong>{fullName(v)}</strong></>}>
                <DetailList
                    items={[
                        { label: "Voornaam", value: v.firstName, half: true },
                        { label: "Achternaam", value: v.lastName, half: true },
                        { label: "E-mailadres", value: v.email },
                        { label: "Geboortedatum", value: birth },
                        { label: "Telefoonnummer", value: v.phone },
                        { label: "Adres", value: formatAddress(v) },
                    ]}
                />
            </FormSection>
            <Button variant="outline" onClick={() => navigate(-1)}>Terug</Button>
        </>
    );
}