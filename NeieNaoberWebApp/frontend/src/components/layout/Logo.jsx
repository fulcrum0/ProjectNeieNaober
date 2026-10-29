import { Link } from "react-router-dom";
import logo from "../../assets/logo.svg";

export default function Logo() {
    return (
        <Link to="/" className="logo">
            <img src={logo} alt="VIP! Tynaarlo - Vrijwilligers Informatie Punt" />
        </Link>
    );
}