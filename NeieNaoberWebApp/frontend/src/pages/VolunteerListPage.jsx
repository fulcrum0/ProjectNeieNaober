import { useSearchParams } from "react-router-dom";
import StatCard from "../components/ui/StatCard";
import SelectField from "../components/ui/SelectField";
import Alert from "../components/ui/Alert";
import Loading from "../components/ui/Loading";
import Pagination from "../components/ui/Pagination";
import Button from "../components/ui/Button";
import ListToolbar from "../components/lists/ListToolbar";
import VolunteerTable from "../components/volunteers/VolunteerTable";
import { useApi } from "../hooks/useApi";
import { STATUS_LABELS } from "../data/constants";

// UC-3: zoeken, filteren en daarna per aanmelding controleren.
// De filters staan in de URL, zodat "Terug" vanaf een detail dezelfde lijst laat zien.
export default function VolunteerListPage() {
    const [params, setParams] = useSearchParams();
    const filters = Object.fromEntries(params);
    const { data, error, loading } = useApi("/api/vip/aanmeldingen", filters);
    const periodes = useApi("/api/vip/periodes");
    const organisatie = useApi(filters.organisatie ? `/api/vip/organisaties/${filters.organisatie}` : null);

    const zet = (key, value) => {
        const nieuw = { ...filters, [key]: value };
        if (key !== "page") delete nieuw.page;
        setParams(Object.fromEntries(Object.entries(nieuw).filter(([, v]) => v !== "" && v !== undefined && v !== null)));
    };

    return (
        <>
            <h1 className="page-title">Aanmeldingen</h1>
            <div className="stats stats--single">
                <StatCard label="Gevonden" value={data?.meta.total ?? "-"} />
            </div>

            <div className="card table-card">
                <ListToolbar key={filters.zoek ?? ""} placeholder="Zoek op naam, postcode of plaats" query={filters.zoek} onSearch={(zoek) => zet("zoek", zoek)} />
                <div className="filters">
                    <SelectField
                        id="status" label="Status" value={filters.status ?? ""} onChange={(e) => zet("status", e.target.value)}
                        options={[{ value: "", label: "Alle statussen" }, ...["nieuw", "goedgekeurd", "afgekeurd"].map((s) => ({ value: s, label: STATUS_LABELS[s] }))]}
                    />
                    <SelectField
                        id="periode" label="Periode" value={filters.periode ?? ""} onChange={(e) => zet("periode", e.target.value)}
                        options={[{ value: "", label: "Alle periodes" }, ...(periodes.data?.data ?? []).map((p) => ({ value: String(p.id), label: p.naam }))]}
                    />
                    <label className="check">
                        <input type="checkbox" checked={filters.dubbel === "1"} onChange={(e) => zet("dubbel", e.target.checked ? "1" : "")} />
                        Alleen mogelijk dubbel
                    </label>
                    {filters.organisatie && (
                        <Button variant="outline" onClick={() => zet("organisatie", "")}>
                            Organisatie: {organisatie.data?.data.naam ?? "..."} ✕
                        </Button>
                    )}
                </div>

                {error && <Alert type="error" title={error.message} />}
                {loading && !data ? (
                    <Loading />
                ) : (
                    <VolunteerTable
                        aanmeldingen={data?.data ?? []}
                        showOrganisation
                        detailPath={(id) => `/admin/vrijwilligers/${id}`}
                        emptyText="Geen aanmeldingen gevonden met deze filters."
                    />
                )}
                <Pagination meta={data?.meta} noun="aanmeldingen" onPage={(page) => zet("page", String(page))} />
            </div>
        </>
    );
}
