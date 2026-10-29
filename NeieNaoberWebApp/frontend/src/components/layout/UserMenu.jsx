import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function UserMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="user-menu">
      <button className="user-menu__trigger" onClick={() => setOpen((o) => !o)}>
        <span className="user-menu__avatar">{user.initials}</span>
        <span>{user.name}</span>
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