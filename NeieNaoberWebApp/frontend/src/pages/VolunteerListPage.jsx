import StatCard from "../components/ui/StatCard";
import VolunteerTable from "../components/volunteers/VolunteerTable";
import { useData } from "../context/DataContext";

export default function VolunteerListPage() {
    const { volunteers, removeVolunteers, importVolunteers } = useData();
    return (
        <>
            <h1 className="page-title">Vrijwilligerlijst</h1>
            <div className="stats stats--single">
                <StatCard label="Totaal geregistreerd" value={volunteers.length} />
            </div>
            <VolunteerTable
                volunteers={volunteers}
                detailPath={(id) => `/admin/vrijwilligers/${id}`}
                onDelete={removeVolunteers}
                onImport={importVolunteers}
            />
        </>
    );
}