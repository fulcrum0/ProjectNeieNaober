import { Link } from "react-router-dom";

export default function NavTile({ to, icon: Icon, label }) {
    return (
        <Link to={to} className="nav-tile">
            <Icon size={28} />
            <span>{label}</span>
        </Link>
    );
}