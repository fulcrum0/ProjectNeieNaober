import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { ROLE_LABELS } from "../../data/constants";

const initialsOf = (name) =>
    name
        .split(/\s+/)
        .filter((part) => /^[A-Za-z0-9]/.test(part))
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join("");

export default function UserMenu() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    return (
        <div className="user-menu">
            <button className="user-menu__trigger" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
                <span className="user-menu__avatar">{initialsOf(user.naam)}</span>
                <span>
                    {user.naam}
                    {user.naam !== ROLE_LABELS[user.rol] && <span className="muted small"> · {ROLE_LABELS[user.rol]}</span>}
                </span>
                <ChevronDown size={14} />
            </button>
            {open && (
                <div className="user-menu__dropdown">
                    <button onClick={handleLogout}>
                        <LogOut size={14} /> Uitloggen
                    </button>
                </div>
            )}
        </div>
    );
}
