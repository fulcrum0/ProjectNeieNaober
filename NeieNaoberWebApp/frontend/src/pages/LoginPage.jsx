import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import TextField from "../components/ui/TextField";
import Button from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";
import { homePath } from "../data/constants";

export default function LoginPage() {
    const { user, login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [busy, setBusy] = useState(false);

    if (user) return <Navigate to={homePath(user)} replace />;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setBusy(true);
        setError("");
        try {
            const ingelogd = await login(email.trim(), password);
            // De rol uit de database bepaalt het startscherm (TO 3.5)
            navigate(location.state?.from || homePath(ingelogd), { replace: true });
        } catch (err) {
            setError(err.field("email") || err.message);
        } finally {
            setBusy(false);
        }
    };

    return (
        <>
            <div className="login-wrap">
                <form className="card login-card" onSubmit={handleSubmit}>
                    <h1 className="login-card__title">Welkom terug</h1>
                    <p className="muted">Log in met je organisatie- of VIP!-account.</p>
                    <TextField id="email" label="E-mailadres" type="email" required autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <TextField id="password" label="Wachtwoord" type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    {error && <p className="error" role="alert">{error}</p>}
                    <Button type="submit" icon={LogIn} disabled={busy}>{busy ? "Bezig..." : "Veilig inloggen"}</Button>
                    <Link to="/wachtwoord-vergeten" className="ext-link">Wachtwoord vergeten?</Link>
                </form>
            </div>
            <div className="public-links">
                <span className="muted">Bent u vrijwilliger?</span>
                <Link to="/ben-ik-aangemeld">Kijk of u al bent aangemeld</Link>
                <Link to="/zelf-aanmelden">Zelf aanmelden (vrijwilligerswerk buiten de gemeente Tynaarlo)</Link>
            </div>
        </>
    );
}
