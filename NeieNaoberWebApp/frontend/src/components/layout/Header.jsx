import { NavLink } from "react-router-dom";
import Logo from "./Logo";
import UserMenu from "./UserMenu";
import { useAuth } from "../../context/AuthContext";
import { ROLES } from "../../data/constants";

export default function Header() {
    const { user } = useAuth();
    const home = user?.role === ROLES.ADMIN ? "/admin" : "/organisatie";

    return (
        <header className="header">
            <div className="header__top">
                <Logo />
                {user && <UserMenu />}
            </div>
            {user && (
                <nav className="header__nav">
                    <NavLink to={home} end>Dashboard</NavLink>
                    <NavLink to="/privacy">Privacyverklaring</NavLink>
                </nav>
            )}
        </header>
    );
}