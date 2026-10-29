import { Plus } from "lucide-react";
import StatCard from "../components/ui/StatCard";
import Button from "../components/ui/Button";
import VolunteerTable from "../components/volunteers/VolunteerTable";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";

export default function OrganisationDashboard() {
    const { user } = useAuth();
    const { volunteers, removeVolunteers } = useData();
    const mine = volunteers.filter((v) => v.orgId === user.orgId);

    return (
        <>
            <div className="page-head">
                <h1 className="page-title">Dashboard</h1>
                <Button to="/organisatie/vrijwilligers/nieuw" icon={Plus}>Vrijwilliger registreren</Button>
            </div>
            <div className="stats stats--org">
                <StatCard large label="Welkom" value={user.name} />
                <StatCard label="Totaal geregistreerd" value={mine.length} />
            </div>
            <VolunteerTable
                volunteers={mine}
                detailPath={(id) => `/organisatie/vrijwilligers/${id}`}
                onDelete={removeVolunteers}
            />
        </>
    );
}