import { createContext, useContext, useState } from "react";
import { organisations as initialOrgs, volunteers as initialVolunteers } from "../data/mockData";

const DataContext = createContext(null);
const today = () => new Date().toISOString().slice(0, 10);

export function DataProvider({ children }) {
    const [organisations, setOrganisations] = useState(initialOrgs);
    const [volunteers, setVolunteers] = useState(initialVolunteers);

    const getVolunteer = (id) => volunteers.find((v) => v.id === id);
    const getOrganisation = (id) => organisations.find((o) => o.id === id);

    const addVolunteer = (orgId, data) =>
        setVolunteers((prev) => [...prev, { id: crypto.randomUUID(), orgId, createdAt: today(), ...data }]);

    const importVolunteers = (rows) => {
        const added = rows
            .map(({ orgName, ...v }) => ({ ...v, orgId: organisations.find((o) => o.name === orgName)?.id }))
            .filter((v) => v.orgId && v.firstName)
            .map((v) => ({ id: crypto.randomUUID(), createdAt: today(), ...v }));
        setVolunteers((prev) => [...prev, ...added]);
    };

    const removeVolunteers = (ids) => setVolunteers((prev) => prev.filter((v) => !ids.includes(v.id)));

    const importOrganisations = (rows) =>
        setOrganisations((prev) => [
            ...prev,
            ...rows.filter((r) => r.name).map((r) => ({ id: crypto.randomUUID(), ...r })),
        ]);

    const removeOrganisations = (ids) => {
        setOrganisations((prev) => prev.filter((o) => !ids.includes(o.id)));
        setVolunteers((prev) => prev.filter((v) => !ids.includes(v.orgId)));
    };

    return (
        <DataContext.Provider
            value={{
                organisations, volunteers, getVolunteer, getOrganisation,
                addVolunteer, importVolunteers, removeVolunteers,
                importOrganisations, removeOrganisations,
            }}
        >
            {children}
        </DataContext.Provider>
    );
}

export const useData = () => useContext(DataContext);