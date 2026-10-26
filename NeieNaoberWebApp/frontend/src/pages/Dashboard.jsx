import Header from "../components/Header";
import Footer from "../components/Footer";
import useNavHandler from "../hooks/useNavHandler";

import './Dashboard.css'

import { useLocation } from "react-router-dom";

function Dashboard() {
    const { state } = useLocation();
    const email = state?.email || "Guest";

    return (
        <div className="page-layout">
            <Header showAvatar={true} email={email} />
            <main className="dashboard-card">
                <h2 className="title">Dashboard</h2>
                <div className="dashboard-info-cards">
                    <div className="welcome-card dashboard-info-card">
                        <p className="welcome-text">Welkom</p>
                        <p className="username-text">{email}</p>
                    </div>
                    <div className="app-info-cards dashboard-info-card">
                        <div className="total-organizations-card app-info-card">
                            <p className="info-title">Totaal geregistreerd organisaties</p>
                            <p className="quantity">0</p>
                        </div>
                        <div className="total-volunteers-card app-info-card">
                            <p className="info-title">Totaal geregistreerd vrijwilligers</p>
                            <p className="quantity">0</p>
                        </div>
                    </div>
                </div>
                <div className="list-cards">
                    <button className="list-card" data-to="/org-list">
                        <i className="fa-solid fa-building" />
                        ORGANISATIELIJST
                    </button>
                    <button className="list-card" data-to="/vrij-list">
                        <i className="fa-solid fa-user-group" />
                        VRIJWILLIGERSLIJST
                    </button>
                </div>
            </main>
            <Footer />
        </div >
    )
}

export default Dashboard;