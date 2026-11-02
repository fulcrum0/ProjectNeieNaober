// Werken met de vrijwilliger zoals de API hem stuurt (Nederlandse veldnamen, TO 4)
export const fullName = (v) => [v?.voornaam, v?.tussenvoegsel, v?.achternaam].filter(Boolean).join(" ");

export const formatPostcode = (postcode) => (postcode && postcode.length === 6 ? `${postcode.slice(0, 4)} ${postcode.slice(4)}` : postcode || "");

export const formatAddress = (v) => (v ? `${v.straat} ${v.huisnummer}, ${formatPostcode(v.postcode)} ${v.woonplaats}`.trim() : "");
