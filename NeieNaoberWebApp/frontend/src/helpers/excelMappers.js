import { formatDate } from "./formatDate";

export const volunteerToRow = (v, orgName) => ({
    Voornaam: v.firstName,
    Achternaam: v.lastName,
    Email: v.email,
    Telefoonnummer: v.phone,
    Straatnaam: v.street,
    Huisnummer: v.houseNumber,
    Toevoeging: v.addition,
    Postcode: v.postcode,
    Organisatie: orgName,
    Ingediend: formatDate(v.createdAt),
});

export const rowToVolunteer = (r) => ({
    firstName: r.Voornaam ?? "",
    lastName: r.Achternaam ?? "",
    email: r.Email ?? "",
    phone: r.Telefoonnummer ?? "",
    street: r.Straatnaam ?? "",
    houseNumber: String(r.Huisnummer ?? ""),
    addition: r.Toevoeging ?? "",
    postcode: r.Postcode ?? "",
    birthDate: "",
    orgName: r.Organisatie,
});

export const organisationToRow = (o, count) => ({
    Organisatie: o.name,
    Locatie: o.location,
    "Totaal Vrijwilliger": count,
});

export const rowToOrganisation = (r) => ({
    name: r.Organisatie ?? "",
    location: r.Locatie ?? "",
    email: "",
    phone: "",
    type: "",
});