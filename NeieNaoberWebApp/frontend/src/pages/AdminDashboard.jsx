import { Building2, Users } from "lucide-react";
import StatCard from "../components/ui/StatCard";
import NavTile from "../components/ui/NavTile";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";

export default function AdminDashboard() {
    const { user } = useAuth();
    const { organisations, volunteers } = useData();

    return (
        <>
            <h1 className="page-title">Dashboard</h1>
            <div className="grid">
                <StatCard large label="Welkom," value={user.name} />
                <StatCard label="Totaal geregistreerd organisaties" value={organisations.length} />
                <StatCard label="Totaal geregistreerd vrijwilligers" value={volunteers.length} />
            </div>
            <div className="tiles">
                <NavTile to="/admin/organisaties" icon={Building2} label="ORGANISATIELIJST" />
                <NavTile to="/admin/vrijwilligers" icon={Users} label="VRIJWILLIGERLIJST" />
            </div>
        </>
    );
}