import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="footer">
            <Link to="/privacy">Privacyverklaring</Link>
        </footer>
    );
}