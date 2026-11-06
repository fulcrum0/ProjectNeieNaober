import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../services/api";
import { useAuth } from "./AuthContext";

const DataContext = createContext(null);
const empty = { owner: null, organisations: [], volunteers: [] };

// Toont een fout van de backend; de schermen uit v1.0 hebben daar geen eigen plek voor.
// Liever de precieze melding ("al verstuurd", "al geregistreerd") dan de algemene.
const report = (err) => window.alert(Object.values(err.errors).flat()[0] ?? err.message);

export function DataProvider({ children }) {
    const { user } = useAuth();
    const [data, setData] = useState(empty);

    // De gegevens horen bij deze inlog: na elke keer inloggen (of herladen) opnieuw ophalen
    const ready = !user || data.owner === user;

    useEffect(() => {
        if (!user || data.owner === user) return;
        Promise.all([api.get("/api/organisations"), api.get("/api/volunteers")])
            .then(([organisations, volunteers]) => setData({ owner: user, organisations, volunteers }))
            .catch((err) => {
                setData({ ...empty, owner: user });
                report(err);
            });
    }, [user, data.owner]);

    if (!ready) return null;

    const organisations = user ? data.organisations : [];
    const volunteers = user ? data.volunteers : [];
    const update = (changes) => setData((prev) => ({ ...prev, ...changes(prev) }));

    const getVolunteer = (id) => volunteers.find((v) => v.id === id);
    const getOrganisation = (id) => organisations.find((o) => o.id === id);

    // Geeft true terug als het gelukt is, zodat het formulier weet of het verder mag
    const addVolunteer = (orgId, values) =>
        api.post("/api/volunteers", { orgId, ...values })
            .then((v) => {
                update((prev) => ({ volunteers: [...prev.volunteers, v] }));
                return true;
            })
            .catch((err) => {
                report(err);
                return false;
            });

    // Organisatie verstuurt concepten naar VIP! Tynaarlo; geeft de verstuurde vrijwilligers terug
    const sendVolunteers = (ids) =>
        api.post("/api/volunteers/send", { ids })
            .then((sent) => {
                const byId = Object.fromEntries(sent.map((v) => [v.id, v]));
                update((prev) => ({ volunteers: prev.volunteers.map((v) => byId[v.id] ?? v) }));
                return sent;
            })
            .catch((err) => {
                report(err);
                return [];
            });

    const importVolunteers = (rows) => {
        const valid = rows
            .map(({ orgName, ...v }) => ({ ...v, orgId: organisations.find((o) => o.name === orgName)?.id }))
            .filter((v) => v.orgId && v.firstName);
        if (!valid.length) return;
        return api.post("/api/volunteers/import", { volunteers: valid })
            .then((added) => update((prev) => ({ volunteers: [...prev.volunteers, ...added] })))
            .catch(report);
    };

    const removeVolunteers = (ids) =>
        api.delete("/api/volunteers", { ids })
            .then(() => update((prev) => ({ volunteers: prev.volunteers.filter((v) => !ids.includes(v.id)) })))
            .catch(report);

    const importOrganisations = (rows) => {
        const valid = rows.filter((r) => r.name);
        if (!valid.length) return;
        return api.post("/api/organisations/import", { organisations: valid })
            .then((added) => update((prev) => ({ organisations: [...prev.organisations, ...added] })))
            .catch(report);
    };

    const removeOrganisations = (ids) =>
        api.delete("/api/organisations", { ids })
            .then(() => update((prev) => ({
                organisations: prev.organisations.filter((o) => !ids.includes(o.id)),
                volunteers: prev.volunteers.filter((v) => !ids.includes(v.orgId)),
            })))
            .catch(report);

    return (
        <DataContext.Provider
            value={{
                organisations, volunteers, getVolunteer, getOrganisation,
                addVolunteer, sendVolunteers, importVolunteers, removeVolunteers,
                importOrganisations, removeOrganisations,
            }}
        >
            {children}
        </DataContext.Provider>
    );
}

export const useData = () => useContext(DataContext);
