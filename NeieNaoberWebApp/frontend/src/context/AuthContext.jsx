import { createContext, useContext, useEffect, useState } from "react";
import { api, setUnauthorizedHandler } from "../services/ApiClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Na verversen van de pagina is de sessie-cookie er nog; vraag Laravel wie er ingelogd is
    useEffect(() => {
        setUnauthorizedHandler(() => setUser(null));

        api.get("/api/ik")
            .then((response) => setUser(response.data))
            .catch(() => setUser(null))
            .finally(() => setLoading(false));
    }, []);

    const login = async (email, wachtwoord) => {
        const response = await api.post("/api/login", { email, wachtwoord });
        setUser(response.data);
        return response.data;
    };

    const logout = async () => {
        try {
            await api.post("/api/logout");
        } finally {
            setUser(null);
        }
    };

    return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
