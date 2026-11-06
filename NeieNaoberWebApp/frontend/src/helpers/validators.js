export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export const isName = (v) => /^[\p{L}][\p{L}\s'.-]*$/u.test(v.trim());

export const isPhone = (v) => /^\+?[0-9 -]+$/.test(v) && /^\d{10,15}$/.test(v.replace(/\D/g, ""));

export const isPostcode = (v) => /^[1-9][0-9]{3} ?[A-Z]{2}$/i.test(v.trim());

export const isBirthDate = (v) => v >= "1900-01-01" && v <= new Date().toISOString().slice(0, 10);

export const isInfix = (v) => /^[\p{L}\s'.-]+$/u.test(v.trim());
