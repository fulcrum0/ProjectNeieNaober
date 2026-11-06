import { Plus, Send } from "lucide-react";
import StatCard from "../components/ui/StatCard";
import Button from "../components/ui/Button";
import VolunteerTable from "../components/volunteers/VolunteerTable";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import { isConcept } from "../helpers/volunteerUtils";

export default function OrganisationDashboard() {
    const { user } = useAuth();
    const { volunteers, removeVolunteers } = useData();
    const mine = volunteers.filter((v) => v.orgId === user.orgId);
    const concepts = mine.filter(isConcept).length;

    return (
        <>
            <div className="page-head">
                <h1 className="page-title">Dashboard</h1>
                <div className="page-head__actions">
                    <Button to="/organisatie/versturen" variant="outline" icon={Send}>
                        Gegevens versturen{concepts > 0 && <span className="count-pill">{concepts}</span>}
                    </Button>
                    <Button to="/organisatie/vrijwilligers/nieuw" icon={Plus}>Vrijwilliger registreren</Button>
                </div>
            </div>
            <div className="stats stats--org">
                <StatCard large label="Welkom" value={user.name} />
                <StatCard label="Totaal geregistreerd" value={mine.length} />
                <StatCard label="Nog te versturen" value={concepts} />
            </div>
            <VolunteerTable
                volunteers={mine}
                detailPath={(id) => `/organisatie/vrijwilligers/${id}`}
                onDelete={removeVolunteers}
                showStatus
                isLocked={(v) => !isConcept(v)}
            />
        </>
    );
}
