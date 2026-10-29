import { useNavigate } from "react-router-dom";
import VolunteerForm from "../components/volunteers/VolunteerForm";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";

export default function VolunteerRegisterPage() {
    const { user } = useAuth();
    const { getOrganisation, addVolunteer } = useData();
    const navigate = useNavigate();

    const handleSubmit = (data) => {
        addVolunteer(user.orgId, data);
        navigate("/organisatie");
    };

    return (
        <>
            <h1 className="page-title">Vrijwilliger Registreren</h1>
            <VolunteerForm
                organisationName={getOrganisation(user.orgId)?.name}
                onSubmit={handleSubmit}
                onCancel={() => navigate("/organisatie")}
            />
        </>
    );
}