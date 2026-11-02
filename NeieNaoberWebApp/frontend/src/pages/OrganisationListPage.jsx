import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Plus } from "lucide-react";
import StatCard from "../components/ui/StatCard";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";
import Loading from "../components/ui/Loading";
import Pagination from "../components/ui/Pagination";
import ListToolbar from "../components/lists/ListToolbar";
import OrganisationTable from "../components/organisations/OrganisationTable";
import NieuweOrganisatieDialog from "../components/organisations/NieuweOrganisatieDialog";
import { useAuth } from "../context/AuthContext";
import { useApi } from "../hooks/useApi";
import { isBeheerder } from "../data/constants";

export default function OrganisationListPage() {
    const { user } = useAuth();
    const [params, setParams] = useSearchParams();
    const filters = Object.fromEntries(params);
    const { data, error, loading, reload } = useApi("/api/vip/organisaties", filters);
    const [nieuw, setNieuw] = useState(false);
    const [melding, setMelding] = useState("");

    return (
        <>
            <div className="page-head">
                <h1 className="page-title">Organisatielijst</h1>
                {isBeheerder(user) && <Button icon={Plus} onClick={() => setNieuw(true)}>Nieuwe organisatie</Button>}
            </div>
            <div className="stats stats--single">
                <StatCard label="Totaal geregistreerd" value={data?.meta.total ?? "-"} />
            </div>
            {melding && <Alert type="success" title={melding} />}
            {error && <Alert type="error" title={error.message} />}

            <div className="card table-card">
                <ListToolbar
                    key={filters.zoek ?? ""}
                    placeholder="Zoek organisatie of plaats"
                    query={filters.zoek}
                    onSearch={(zoek) => setParams(zoek ? { zoek } : {})}
                />
                {loading && !data ? <Loading /> : <OrganisationTable organisaties={data?.data ?? []} />}
                <Pagination meta={data?.meta} noun="organisaties" onPage={(page) => setParams({ ...filters, page: String(page) })} />
            </div>

            {nieuw && (
                <NieuweOrganisatieDialog
                    onClose={() => setNieuw(false)}
                    onGemaakt={(result) => {
                        setNieuw(false);
                        setMelding(`${result.data.naam}: ${result.message}`);
                        reload();
                    }}
                />
            )}
        </>
    );
}
