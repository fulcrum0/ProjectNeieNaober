import StatCard from "../components/ui/StatCard";
import OrganisationTable from "../components/organisations/OrganisationTable";
import { useData } from "../context/DataContext";

export default function OrganisationListPage() {
    const { organisations } = useData();
    return (
        <>
            <h1 className="page-title">Organisatielijst</h1>
            <div className="stats stats--single">
                <StatCard label="Totaal geregistreerd" value={organisations.length} />
            </div>
            <OrganisationTable />
        </>
    );
}