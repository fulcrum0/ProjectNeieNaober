let onUnauthorized = () => {};

export const setUnauthorizedHandler = (handler) => {
    onUnauthorized = handler;
};

export class ApiError extends Error {
    constructor(status, data) {
        super(data?.message || (status ? "Er ging iets mis op de server." : "Geen verbinding met de server."));
        this.status = status;
        this.errors = data?.errors || {};
    }
}

const readCookie = (name) => {
    const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
    return match ? decodeURIComponent(match[1]) : null;
};

async function ensureCsrfCookie(force = false) {
    if (force || !readCookie("XSRF-TOKEN")) await fetch("/sanctum/csrf-cookie", { credentials: "same-origin" });
}

async function request(method, path, body, retry = true) {
    if (method !== "GET") await ensureCsrfCookie();

    const headers = { Accept: "application/json" };
    const token = readCookie("XSRF-TOKEN");
    if (token) headers["X-XSRF-TOKEN"] = token;
    if (body) headers["Content-Type"] = "application/json";

    let response;
    try {
        response = await fetch(path, { method, headers, body: body && JSON.stringify(body), credentials: "same-origin" });
    } catch {
        throw new ApiError(0);
    }

    if (response.status === 419 && retry) {
        await ensureCsrfCookie(true);
        return request(method, path, body, false);
    }

    if (response.status === 401 && path !== "/api/user") onUnauthorized();

    const data = response.status === 204 ? null : await response.json().catch(() => null);
    if (!response.ok) throw new ApiError(response.status, data);
    return data;
}

export const api = {
    get: (path) => request("GET", path),
    post: (path, body) => request("POST", path, body),
    delete: (path, body) => request("DELETE", path, body),
};
