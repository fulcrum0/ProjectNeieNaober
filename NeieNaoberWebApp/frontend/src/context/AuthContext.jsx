import { createContext, useContext, useEffect, useState } from "react";
import { api, setUnauthorizedHandler } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        setUnauthorizedHandler(() => setUser(null));
        api.get("/api/user")
            .then(setUser)
            .catch(() => setUser(null))
            .finally(() => setChecking(false));
    }, []);

    const login = async (email, password) => {
        try {
            const found = await api.post("/api/login", { email: email.trim(), password });
            setUser(found);
            return found;
        } catch (err) {
            if (err.status === 422) return null;
            throw err;
        }
    };

    const logout = () => {
        setUser(null);
        api.post("/api/logout").catch(() => {});
    };

    if (checking) return null;

    return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
