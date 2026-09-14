import TopBar from "./TopBar";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";

function Header() {
    return (
        <header className="nav-header">
            <TopBar />
            <DesktopNav />
            <MobileNav />
        </header>
    );
}

export default Header;
