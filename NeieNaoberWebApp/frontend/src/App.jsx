import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Loading from "./components/ui/Loading";
import LoginPage from "./pages/LoginPage";
import WachtwoordMakenPage from "./pages/WachtwoordMakenPage";
import WachtwoordVergetenPage from "./pages/WachtwoordVergetenPage";
import BenIkAangemeldPage from "./pages/BenIkAangemeldPage";
import ZelfAanmeldenPage from "./pages/ZelfAanmeldenPage";
import AdminDashboard from "./pages/AdminDashboard";
import OrganisationDashboard from "./pages/OrganisationDashboard";
import OrganisationListPage from "./pages/OrganisationListPage";
import OrganisationDetailPage from "./pages/OrganisationDetailPage.jsx";
import VolunteerListPage from "./pages/VolunteerListPage";
import VolunteerDetailPage from "./pages/VolunteerDetailPage";
import VolunteerRegisterPage from "./pages/VolunteerRegisterPage";
import ExportPage from "./pages/ExportPage";
import BeheerPage from "./pages/BeheerPage";
import PrivacyPage from "./pages/PrivacyPage";
import { useAuth } from "./context/AuthContext";
import { ROLES, VIP_ROLES, homePath } from "./data/constants";

function Home() {
    const { user, loading } = useAuth();
    if (loading) return <Loading />;
    return <Navigate to={homePath(user)} replace />;
}

export default function App() {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/wachtwoord-maken" element={<WachtwoordMakenPage />} />
                <Route path="/wachtwoord-vergeten" element={<WachtwoordVergetenPage />} />
                <Route path="/ben-ik-aangemeld" element={<BenIkAangemeldPage />} />
                <Route path="/zelf-aanmelden" element={<ZelfAanmeldenPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />

                <Route element={<ProtectedRoute roles={VIP_ROLES} />}>
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/organisaties" element={<OrganisationListPage />} />
                    <Route path="/admin/organisaties/:id" element={<OrganisationDetailPage />} />
                    <Route path="/admin/vrijwilligers" element={<VolunteerListPage />} />
                    <Route path="/admin/vrijwilligers/:id" element={<VolunteerDetailPage />} />
                    <Route path="/admin/export" element={<ExportPage />} />
                </Route>

                <Route element={<ProtectedRoute roles={[ROLES.BEHEERDER]} />}>
                    <Route path="/admin/beheer" element={<BeheerPage />} />
                </Route>

                <Route element={<ProtectedRoute roles={[ROLES.ORG]} />}>
                    <Route path="/organisatie" element={<OrganisationDashboard />} />
                    <Route path="/organisatie/vrijwilligers/nieuw" element={<VolunteerRegisterPage />} />
                    <Route path="/organisatie/vrijwilligers/:id" element={<VolunteerDetailPage />} />
                </Route>
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
