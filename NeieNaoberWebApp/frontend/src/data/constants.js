// De rollen komen uit de database (TO 6.1); het tabblad op het loginscherm bepaalt niets
export const ROLES = { BEHEERDER: "beheerder", MEDEWERKER: "medewerker", ORG: "organisatie" };
export const VIP_ROLES = [ROLES.MEDEWERKER, ROLES.BEHEERDER];

export const isVip = (user) => VIP_ROLES.includes(user?.rol);
export const isBeheerder = (user) => user?.rol === ROLES.BEHEERDER;
export const homePath = (user) => (!user ? "/login" : isVip(user) ? "/admin" : "/organisatie");

export const ROLE_LABELS = { beheerder: "Beheerder VIP!", medewerker: "Medewerker VIP!", organisatie: "Organisatie" };

export const STATUS_LABELS = {
    concept: "Concept",
    nieuw: "Nieuw",
    goedgekeurd: "Goedgekeurd",
    afgekeurd: "Afgekeurd",
};

// Velden waaraan VIP! een kolom uit het sjabloon van de gemeente kan koppelen
export const VELD_LABELS = {
    aanhef: "Aanhef",
    voornaam: "Voornaam",
    tussenvoegsel: "Tussenvoegsel",
    achternaam: "Achternaam",
    straat: "Straat",
    huisnummer: "Huisnummer",
    postcode: "Postcode",
    woonplaats: "Woonplaats",
    organisatie: "Organisatie",
    periode: "Periode",
};
