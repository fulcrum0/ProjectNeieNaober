import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import OrganisationDashboard from "./pages/OrganisationDashboard";
import OrganisationListPage from "./pages/OrganisationListPage";
import OrganisationDetailPage from "./pages/OrganisationDetailPage.jsx";
import VolunteerListPage from "./pages/VolunteerListPage";
import VolunteerDetailPage from "./pages/VolunteerDetailPage";
import VolunteerRegisterPage from "./pages/VolunteerRegisterPage";
import PrivacyPage from "./pages/PrivacyPage";
import { useAuth } from "./context/AuthContext";
import { ROLES } from "./data/constants";

function Home() {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" replace />;
    return <Navigate to={user.role === ROLES.ADMIN ? "/admin" : "/organisatie"} replace />;
}

export default function App() {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />

                <Route element={<ProtectedRoute role={ROLES.ADMIN} />}>
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/organisaties" element={<OrganisationListPage />} />
                    <Route path="/admin/organisaties/:id" element={<OrganisationDetailPage />} />
                    <Route path="/admin/vrijwilligers" element={<VolunteerListPage />} />
                    <Route path="/admin/vrijwilligers/:id" element={<VolunteerDetailPage />} />
                </Route>

                <Route element={<ProtectedRoute role={ROLES.ORG} />}>
                    <Route path="/organisatie" element={<OrganisationDashboard />} />
                    <Route path="/organisatie/vrijwilligers/nieuw" element={<VolunteerRegisterPage />} />
                    <Route path="/organisatie/vrijwilligers/:id" element={<VolunteerDetailPage />} />
                </Route>
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}