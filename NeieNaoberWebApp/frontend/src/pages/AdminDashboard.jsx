import { Building2, FileSpreadsheet, Settings, Users } from "lucide-react";
import StatCard from "../components/ui/StatCard";
import NavTile from "../components/ui/NavTile";
import Alert from "../components/ui/Alert";
import { useAuth } from "../context/AuthContext";
import { useApi } from "../hooks/useApi";
import { isBeheerder } from "../data/constants";
import { formatDate } from "../helpers/formatDate";

export default function AdminDashboard() {
    const { user } = useAuth();
    const { data, error } = useApi("/api/vip/overzicht");
    const periode = data?.periode;
    const waarde = (key) => data?.[key] ?? "-";

    return (
        <>
            <h1 className="page-title">Dashboard</h1>
            {error && <Alert type="error" title={error.message} />}
            <div className="stats stats--vip">
                <StatCard large label="Welkom," value={user.naam} />
                <StatCard label="Organisaties" value={waarde("aantal_organisaties")} />
                <StatCard label="Aanmeldingen (verstuurd)" value={waarde("aantal_aanmeldingen")} />
                <StatCard label="Nog te controleren" value={waarde("aantal_nieuw")} />
                <StatCard label="Mogelijk dubbel" value={waarde("aantal_dubbel")} />
            </div>
            {data && (
                <p className="muted">
                    {periode
                        ? `Periode ${periode.naam}: ${formatDate(periode.startdatum)} t/m ${formatDate(periode.einddatum)}${periode.open ? " (open)" : " (gesloten)"} · ${data.aantal_goedgekeurd} goedgekeurd · ${data.aantal_afgekeurd} afgekeurd`
                        : "Er is nog geen aanmeldperiode. De beheerder maakt die aan onder Beheer."}
                </p>
            )}
            <div className="tiles">
                <NavTile to="/admin/vrijwilligers" icon={Users} label="AANMELDINGEN" />
                <NavTile to="/admin/organisaties" icon={Building2} label="ORGANISATIELIJST" />
                <NavTile to="/admin/export" icon={FileSpreadsheet} label="EXPORT & SJABLOON" />
                {isBeheerder(user) && <NavTile to="/admin/beheer" icon={Settings} label="BEHEER" />}
            </div>
        </>
    );
}
