import Header from "../components/Header";
import Footer from "../components/Footer";

import './Dashboard.css'

import { useState } from "react";
import { useLocation } from "react-router-dom";

function Dashboard() {
    const { state } = useLocation();
    const email = state?.email || "Guest";
    return (
        <div className="page-layout">
            <Header showAvatar={true} email={email} />
            <main className="card">

            </main>
            <Footer></Footer>
        </div >
    )
}

export default Dashboard;