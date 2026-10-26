import Header from '../components/Header'
import Footer from '../components/Footer';
import useNavHandler from '../hooks/useNavHandler';

import './Login.css'

import { useState } from 'react';

function Login() {

    const handleNav = useNavHandler();
    const [email, SetEmail] = useState("");

    return (
        <div className="page-layout">
            <Header showAvatar={false} />
            <main className="login-card">
                <h1>Welkom</h1>
                <p>Log in met je account.</p>
                <form>
                    <label htmlFor="email">E-mailadred</label>
                    <input id="email" type="email" required value={email} onChange={(e) => SetEmail(e.target.value)} />

                    <label htmlFor="password">Wachtwoord</label>
                    <input id="password" type="password" required />

                    <button data-to="/dashboard" onClick={handleNav} className="submit" type="submit">
                        <i class="fa-solid fa-arrow-right-to-bracket" />
                        Veilig inloggen
                    </button>
                </form>
            </main>
            <Footer />
        </div>
    );
}

export default Login;