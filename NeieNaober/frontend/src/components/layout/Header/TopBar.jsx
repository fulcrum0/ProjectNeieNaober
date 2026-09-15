import { Link } from "react-router-dom";

function TopBar() {
    return (
        <div className="top">
            <div className="container">
                <div className="row">

                    <div className="d-none d-md-block col-md-5 col-lg-5">
                        <ul className="top-list">
                            <li>
                                <span>Stel je vraag</span>
                            </li>

                            <li>
                                <a href="tel:0592749332">
                                    <i className="fa fa-solid fa-phone"></i>
                                    {" "}0592 - 74 93 32
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div className="d-none d-md-block col-md-7 col-lg-7">
                        <div className="wrap">

                            <ul className="top-list align-right">
                                <li>
                                    <Link
                                        to="/klantportaal"
                                        title="Inloggen op ons klantenportaal"
                                    >
                                        <i className="fa fa-solid fa-user-lock"></i>
                                        {" "}Inloggen klantportaal
                                    </Link>
                                </li>
                            </ul>

                            <ul className="toegankelijkheid">
                                <li>
                                    <button
                                        className="btn btn-link btn-sm"
                                        type="button"
                                    >
                                        <i className="fa fa-solid fa-circle-half-stroke fa-fw"></i>
                                    </button>
                                </li>

                                <li>
                                    <div className="btn-group">
                                        <button className="btn btn-link btn-sm">
                                            A+
                                        </button>

                                        <button className="btn btn-link btn-sm">
                                            A-
                                        </button>
                                    </div>
                                </li>

                                <li>
                                    <a href="/zoeken/" title="Ga naar zoeken">
                                        <i className="fa fa-solid fa-magnifying-glass"></i>
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

export default TopBar;