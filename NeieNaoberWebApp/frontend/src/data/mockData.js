import { ROLES } from "./constants";

export const users = [
    { id: "u1", email: "lorem@vip.tynaarlo.nl", password: "password123", name: "VIP TYNAARLO", initials: "VT", role: ROLES.ADMIN },
    { id: "u2", email: "a@organisatie.nl", password: "password123", name: "Organisatie A", initials: "O", role: ROLES.ORG, orgId: "o1" },
    { id: "u3", email: "b@organisatie.nl", password: "password123", name: "Organisatie B", initials: "O", role: ROLES.ORG, orgId: "o2" },
];

export const organisations = [
    { id: "o1", name: "Organisatie A", phone: "06 1234 5678", email: "contact@organisatiea.com", location: "Tynaarlo / Drenthe", type: "Horeca" },
    { id: "o2", name: "Organisatie B", phone: "06 8765 4321", email: "contact@organisatieb.com", location: "Vries / Drenthe", type: "Zorg" },
];

export const volunteers = [
    { id: "v1", orgId: "o1", firstName: "Dinesh", lastName: "van Putten", email: "d.vanputten@example.com", phone: "06 1234 5678", birthDate: "1999-09-19", street: "Dinostraat", houseNumber: "99", addition: "", postcode: "1234AB", createdAt: "2026-09-24" },
    { id: "v2", orgId: "o1", firstName: "Rafael", lastName: "Chalabyan", email: "r.chalabyan@example.com", phone: "", birthDate: "", street: "Rafstraat", houseNumber: "11", addition: "", postcode: "5678CD", createdAt: "2026-10-01" },
    { id: "v3", orgId: "o1", firstName: "Orhan", lastName: "Kurt", email: "o.kurt@example.com", phone: "", birthDate: "", street: "Orstraat", houseNumber: "4", addition: "", postcode: "9012EF", createdAt: "2026-08-11" },
    { id: "v4", orgId: "o1", firstName: "Tarik", lastName: "Kurt", email: "t.kurt@example.com", phone: "", birthDate: "", street: "Tarstraat", houseNumber: "1", addition: "", postcode: "3456GH", createdAt: "2026-09-16" },
];