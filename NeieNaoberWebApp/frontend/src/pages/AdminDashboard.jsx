import { useState } from "react";
import StatCard from "../components/ui/StatCard";
import OrganisationTable from "../components/organisations/OrganisationTable";
import VolunteerTable from "../components/volunteers/VolunteerTable";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";

export default function AdminDashboard() {
    const { user } = useAuth();
    const { organisations, volunteers, removeVolunteers, importVolunteers } = useData();
    const [open, setOpen] = useState(null);

    const toggle = (list) => setOpen((current) => (current === list ? null : list));

    return (
        <>
            <h1 className="page-title">Dashboard</h1>
            <div className="stats">
                <StatCard large label="Welkom," value={user.name} />
                <StatCard
                    label="Totaal geregistreerd organisaties" value={organisations.length}
                    expanded={open === "organisations"} onClick={() => toggle("organisations")}
                />
                <StatCard
                    label="Totaal geregistreerd vrijwilligers" value={volunteers.length}
                    expanded={open === "volunteers"} onClick={() => toggle("volunteers")}
                />
            </div>
            {open === "organisations" && (
                <section className="dropdown-panel" aria-label="Organisatielijst">
                    <h2 className="dropdown-panel__title">Organisatielijst</h2>
                    <OrganisationTable />
                </section>
            )}
            {open === "volunteers" && (
                <section className="dropdown-panel" aria-label="Vrijwilligerlijst">
                    <h2 className="dropdown-panel__title">Vrijwilligerlijst</h2>
                    <VolunteerTable
                        volunteers={volunteers}
                        detailPath={(id) => `/admin/vrijwilligers/${id}`}
                        onDelete={removeVolunteers}
                        onImport={importVolunteers}
                    />
                </section>
            )}
        </>
    );
}
