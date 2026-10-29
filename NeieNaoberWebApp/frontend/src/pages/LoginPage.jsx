import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import TextField from "../components/ui/TextField";
import Button from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";
import { ROLES } from "../data/constants";

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        const user = login(email, password);
        if (!user) return setError("Onjuiste inloggegevens.");
        navigate(user.role === ROLES.ADMIN ? "/admin" : "/organisatie");
    };

    return (
        <div className="login-wrap">
            <form className="card login-card" onSubmit={handleSubmit}>
                <h1 className="login-card__title">Welkom terug</h1>
                <p className="muted">Log in met je organisatie- of beheerdersaccount.</p>
                <TextField id="email" label="E-mailadres" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                <TextField id="password" label="Wachtwoord" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                {error && <p className="error">{error}</p>}
                <Button type="submit" icon={LogIn}>Veilig inloggen</Button>
            </form>
        </div>
    );
}