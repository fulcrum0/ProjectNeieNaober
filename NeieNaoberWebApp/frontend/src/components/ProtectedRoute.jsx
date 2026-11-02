import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { homePath } from "../data/constants";
import Loading from "./ui/Loading";

// React verbergt alleen schermen; de echte controle doet Laravel bij elk verzoek (TO 6)
export default function ProtectedRoute({ roles }) {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) return <Loading />;
    if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
    if (!roles.includes(user.rol)) return <Navigate to={homePath(user)} replace />;
    return <Outlet />;
}
