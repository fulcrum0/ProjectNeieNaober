import { useState } from "react";

function MobileNav() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="d-md-none">

            <div className="mobile-controls">
                <button
                    className="navbar-toggler"
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-expanded={isOpen}
                >
                    ☰
                </button>
            </div>

            {isOpen && (
                <div className="navbar-mobile">
                    <div className="container">
                        <nav className="navlist">
                            <ul className="list-unstyled navlist-nav">

                                <li className="nav-item">
                                    <a className="nav-link active" href="/">
                                        <span className="nav-title">
                                            Home
                                        </span>
                                    </a>
                                </li>

                                <li className="nav-item">
                                    <a className="nav-link" href="/over-ons/">
                                        <span className="nav-title">
                                            Over ons
                                        </span>
                                    </a>
                                </li>

                                <li className="nav-item">
                                    <a className="nav-link" href="/agenda/">
                                        <span className="nav-title">
                                            Agenda
                                        </span>
                                    </a>
                                </li>

                                <li className="nav-item">
                                    <a className="nav-link" href="/nieuws/">
                                        <span className="nav-title">
                                            Nieuws
                                        </span>
                                    </a>
                                </li>

                                <li className="nav-item">
                                    <a className="nav-link" href="/werken-bij/">
                                        <span className="nav-title">
                                            Werken bij
                                        </span>
                                    </a>
                                </li>

                                <li className="nav-item">
                                    <a className="nav-link" href="/contact/">
                                        <span className="nav-title">
                                            Contact
                                        </span>
                                    </a>
                                </li>

                            </ul>
                        </nav>
                    </div>
                </div>
            )}

        </div>
    );
}

export default MobileNav;