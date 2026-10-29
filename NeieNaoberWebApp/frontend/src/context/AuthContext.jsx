import { createContext, useContext, useState } from "react";
import { users } from "../data/mockData";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    const login = (email, password) => {
        const found = users.find((u) => u.email === email.trim() && u.password === password);
        if (!found) return null;
        setUser(found);
        return found;
    };

    const logout = () => setUser(null);

    return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);