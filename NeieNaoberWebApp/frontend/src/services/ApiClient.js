// Eén plek voor alle verzoeken naar de Laravel-API (TO 3.4: ApiClient.js).
// Stuurt de sessie-cookie en het XSRF-token mee en maakt van elke fout een ApiError,
// zodat elk scherm fouten op dezelfde manier kan tonen.

const STANDAARD_MELDINGEN = {
    0: "Geen verbinding met de server. Controleer je internet en probeer het opnieuw.",
    401: "U bent niet ingelogd.",
    403: "U mag dit niet doen.",
    404: "Dit record bestaat niet.",
    419: "Uw sessie is verlopen. Probeer het opnieuw.",
    422: "Niet alle velden zijn goed ingevuld.",
    429: "Te vaak geprobeerd. Wacht even en probeer het opnieuw.",
    500: "Er ging iets mis op de server. Probeer het later opnieuw.",
};

export class ApiError extends Error {
    constructor(status, data) {
        super(data?.message || STANDAARD_MELDINGEN[status] || STANDAARD_MELDINGEN[500]);
        this.status = status;
        this.errors = data?.errors || {};
        this.data = data || {};
    }

    // Eerste melding van één veld, direct bruikbaar als error bij een TextField
    field(name) {
        return this.errors[name]?.[0] || "";
    }
}

let onUnauthorized = () => {};

// AuthContext zet hier een functie neer: bij 401 is de sessie weg en moet de gebruiker opnieuw inloggen
export function setUnauthorizedHandler(handler) {
    onUnauthorized = handler;
}

function readCookie(name) {
    const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
    return match ? decodeURIComponent(match[1]) : null;
}

function toQuery(params) {
    if (!params) return "";
    const filled = Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== "" && value !== false);
    return filled.length ? `?${new URLSearchParams(filled)}` : "";
}

// Laravel zet het XSRF-token in een cookie; zonder dat token weigert hij elke POST/PUT/DELETE (TO 3.5)
async function ensureCsrfCookie(force = false) {
    if (force || !readCookie("XSRF-TOKEN")) {
        await fetch("/sanctum/csrf-cookie", { credentials: "same-origin" });
    }
}

async function send(method, path, { body, params, retry = true } = {}) {
    if (method !== "GET") await ensureCsrfCookie();

    const headers = { Accept: "application/json" };
    const token = readCookie("XSRF-TOKEN");
    if (token) headers["X-XSRF-TOKEN"] = token;

    let payload = body;
    if (body && !(body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
        payload = JSON.stringify(body);
    }

    let response;
    try {
        response = await fetch(path + toQuery(params), { method, headers, body: payload, credentials: "same-origin" });
    } catch {
        throw new ApiError(0);
    }

    // 419: token verlopen. Eén keer een nieuw token halen en opnieuw proberen (TO 5.2)
    if (response.status === 419 && retry) {
        await ensureCsrfCookie(true);
        return send(method, path, { body, params, retry: false });
    }

    if (response.status === 401 && path !== "/api/login") onUnauthorized();

    return response;
}

async function sendJson(method, path, options) {
    const response = await send(method, path, options);
    const data = response.status === 204 ? null : await response.json().catch(() => null);
    if (!response.ok) throw new ApiError(response.status, data);
    return data;
}

function fileNameFrom(disposition) {
    const match = disposition?.match(/filename\*?=(?:UTF-8'')?"?([^";]+)"?/i);
    return match ? decodeURIComponent(match[1]) : null;
}

export const api = {
    get: (path, params) => sendJson("GET", path, { params }),
    post: (path, body) => sendJson("POST", path, { body }),
    put: (path, body) => sendJson("PUT", path, { body }),
    patch: (path, body) => sendJson("PATCH", path, { body }),
    delete: (path, body) => sendJson("DELETE", path, { body }),

    // Excel-bestanden maakt Laravel (TO 3.2); de browser downloadt ze hier.
    // Via fetch in plaats van een link, zodat een 422 (bijv. "nog niet gecontroleerd") netjes terugkomt.
    async download(path, params, fallbackName) {
        const response = await send("GET", path, { params });
        if (!response.ok) throw new ApiError(response.status, await response.json().catch(() => null));

        const url = URL.createObjectURL(await response.blob());
        const link = document.createElement("a");
        link.href = url;
        link.download = fileNameFrom(response.headers.get("Content-Disposition")) || fallbackName;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
    },
};
