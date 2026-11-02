import { NavLink } from "react-router-dom";
import Logo from "./Logo";
import UserMenu from "./UserMenu";
import { useAuth } from "../../context/AuthContext";
import { homePath, isBeheerder, isVip } from "../../data/constants";

export default function Header() {
    const { user } = useAuth();

    return (
        <header className="header">
            <div className="header__top">
                <Logo />
                {user && <UserMenu />}
            </div>
            <nav className="header__nav">
                {!user && (
                    <>
                        <NavLink to="/login">Inloggen</NavLink>
                        <NavLink to="/ben-ik-aangemeld">Ben ik al aangemeld?</NavLink>
                        <NavLink to="/zelf-aanmelden">Zelf aanmelden</NavLink>
                    </>
                )}
                {user && <NavLink to={homePath(user)} end>Dashboard</NavLink>}
                {isVip(user) && (
                    <>
                        <NavLink to="/admin/vrijwilligers">Aanmeldingen</NavLink>
                        <NavLink to="/admin/organisaties">Organisaties</NavLink>
                        <NavLink to="/admin/export">Export</NavLink>
                    </>
                )}
                {isBeheerder(user) && <NavLink to="/admin/beheer">Beheer</NavLink>}
                <NavLink to="/privacy">Privacyverklaring</NavLink>
            </nav>
        </header>
    );
}
