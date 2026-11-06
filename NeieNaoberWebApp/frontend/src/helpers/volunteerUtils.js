export const fullName = (v) => [v.firstName, v.infix, v.lastName].filter(Boolean).join(" ");

export const isConcept = (v) => !v.sentAt;

export function findDuplicateField(form, existing) {
    const same = (a, b) => a.trim().toLowerCase() === (b ?? "").trim().toLowerCase();
    if (form.email.trim() && existing.some((v) => same(form.email, v.email))) return "email";
    if (
        form.lastName.trim() && form.birthDate &&
        existing.some((v) => same(form.firstName, v.firstName) && same(form.infix ?? "", v.infix) && same(form.lastName, v.lastName) && form.birthDate === v.birthDate)
    ) return "birthDate";
    return null;
}

export const DUPLICATE_MESSAGES = {
    email: "Deze vrijwilliger is al geregistreerd bij deze organisatie (zelfde e-mailadres).",
    birthDate: "Deze vrijwilliger is al geregistreerd bij deze organisatie (zelfde naam en geboortedatum).",
};

export const formatAddress = (v) =>
    `${v.street} ${v.houseNumber}${v.addition || ""} ${v.postcode}`.trim();

export function calcAge(iso) {
    const b = new Date(iso);
    const n = new Date();
    let age = n.getFullYear() - b.getFullYear();
    const m = n.getMonth() - b.getMonth();
    if (m < 0 || (m === 0 && n.getDate() < b.getDate())) age--;
    return age;
}