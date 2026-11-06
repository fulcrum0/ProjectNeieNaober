export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

// Letters (ook met accenten), spaties, apostrof, punt en streepje: "van 't Hof", "Anne-Marie"
export const isName = (v) => /^[\p{L}][\p{L}\s'.-]*$/u.test(v.trim());

// 10 tot 15 cijfers, eventueel met + vooraan en spaties of streepjes ertussen: "06 1234 5678", "+31 6 12345678"
export const isPhone = (v) => /^\+?[0-9 -]+$/.test(v) && /^\d{10,15}$/.test(v.replace(/\D/g, ""));

// Nederlandse postcode: "9481 AB" of "9481AB"
export const isPostcode = (v) => /^[1-9][0-9]{3} ?[A-Z]{2}$/i.test(v.trim());

export const isBirthDate = (v) => v >= "1900-01-01" && v <= new Date().toISOString().slice(0, 10);

// Tussenvoegsel: mag met een apostrof beginnen, zoals "van der", "'t" of "in 't"
export const isInfix = (v) => /^[\p{L}\s'.-]+$/u.test(v.trim());
