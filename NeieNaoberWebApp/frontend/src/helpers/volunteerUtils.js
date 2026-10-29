export const fullName = (v) => `${v.firstName} ${v.lastName}`;

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