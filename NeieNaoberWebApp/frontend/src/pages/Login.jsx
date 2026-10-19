import Header from '../components/Header'
import Footer from '../components/Footer';

import './Login.css'

import { useState } from 'react';

function Login() {
    const [type, setType] = useState('org');

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <div className="page-layout">
            <Header showAvatar={false} />
            <main className="card">
                <h1>Welkom</h1>
                <p>Log in met je account.</p>

                <div className="tabs" role="tablist">
                    <button
                        type="button"
                        className={`tab ${type === 'org' ? 'active' : ''}`}
                        role="tab"
                        aria-selected={type === 'org'}
                        onClick={() => setType('org')}
                    >
                        Organisatie
                    </button>
                    <button
                        type="button"
                        className={`tab ${type === 'admin' ? 'active' : ''}`}
                        role="tab"
                        aria-selected={type === 'admin'}
                        onClick={() => setType('admin')}
                    >
                        VIP! beheerder
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <label htmlFor="email">E-mailadred</label>
                    <input id="email" type="email" required />

                    <label htmlFor="password">Wachtwoord</label>
                    <input id="password" type="password" required />

                    <button className="submit" type="submit">
                        <i class="fa-solid fa-arrow-right-to-bracket"></i>
                        Veilig inloggen
                    </button>
                </form>
            </main>
            <Footer />
        </div>
    );
}

export default Login;