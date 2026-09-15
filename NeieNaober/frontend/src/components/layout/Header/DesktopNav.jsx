import { Link } from 'react-router-dom';

import logo from '../../../assets/logo.svg'

function DesktopNav() {
    return (
        <div className="bottom">
            <div className="container">
                <div className="row">

                    {/* Logo */}
                    <div className="col-4 col-sm-5 col-md-3 col-lg-2">
                        <div className="logo">
                            <a href="/">
                                <img
                                    className="img-fluid logo min-h-1em"
                                    src={logo}
                                    alt="Neie Naober logo"
                                    height="34"
                                    width="160"
                                />
                            </a>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="col-8 col-sm-7 col-md-9 col-lg-10">
                        <div className="d-none d-md-block width-100 height-100">
                            <ul className="navbar">

                                <li className="nav-item">
                                    <Link className="nav-link active" to="/">
                                        <span className="nav-icon">
                                            <i className="fa fa-solid fa-house"></i>
                                        </span>

                                        <span className="nav-indentation">
                                            &nbsp;
                                        </span>

                                        <span className="nav-title">
                                            Home
                                        </span>
                                    </Link>
                                </li>

                                <li className="nav-item">
                                    <Link className="nav-link" to="/over-ons">
                                        <span className="nav-title">
                                            Over ons
                                        </span>
                                    </Link>
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
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default DesktopNav;