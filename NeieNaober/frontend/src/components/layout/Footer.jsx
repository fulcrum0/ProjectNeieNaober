import logoTinten from '../../assets/logo-tinten.svg'
import logoFooter from '../../assets/logo-footer.png'

function Footer() {
    return (
        <footer className="nav-footer">
            <div className="top">
                <div className="container">

                    {/* Logo */}
                    <div className="logo-footer">
                        <img
                            className="img-fluid logo min-h-1em"
                            loading="lazy"
                            alt="Logo Neie Naober"
                            src={logoFooter}
                            height="90"
                            width="90"
                        />
                    </div>

                    <div className="row">

                        {/* Thema's */}
                        <div className="col-12 col-sm-12 col-md-4 col-lg-4">
                            <span className="title" role="heading" aria-level="2">
                                Thema's
                            </span>

                            <div className="py-2"></div>

                            <nav className="navlist">
                                <ul className="list-unstyled navlist-nav">
                                    <li className="nav-item">
                                        <a className="nav-link" href="/buurt-dorp/">
                                            <span className="nav-title">Buurt / dorp</span>
                                        </a>
                                    </li>

                                    <li className="nav-item">
                                        <a className="nav-link" href="/ontmoeten/">
                                            <span className="nav-title">Ontmoeten</span>
                                        </a>
                                    </li>

                                    <li className="nav-item">
                                        <a className="nav-link" href="/diensten-voor-elkaar/">
                                            <span className="nav-title">Diensten voor elkaar</span>
                                        </a>
                                    </li>

                                    <li className="nav-item">
                                        <a className="nav-link" href="/tegel-individuele-ondersteuning/">
                                            <span className="nav-title">Individuele ondersteuning</span>
                                        </a>
                                    </li>

                                    <li className="nav-item">
                                        <a className="nav-link" href="/jongerenwerk-ontmoeten/">
                                            <span className="nav-title">Jongerenwerk ontmoeten</span>
                                        </a>
                                    </li>

                                    <li className="nav-item">
                                        <a className="nav-link" href="/ouderen-2/">
                                            <span className="nav-title">Ouderen</span>
                                        </a>
                                    </li>

                                    <li className="nav-item">
                                        <a className="nav-link" href="/jongerenwerk-ondersteunen/">
                                            <span className="nav-title">Jongerenwerk ondersteunen</span>
                                        </a>
                                    </li>

                                    <li className="nav-item">
                                        <a className="nav-link" href="/vrijwilligerswerk/">
                                            <span className="nav-title">Vrijwilligerswerk</span>
                                        </a>
                                    </li>

                                    <li className="nav-item">
                                        <a className="nav-link" href="/mantelzorg/">
                                            <span className="nav-title">Mantelzorg</span>
                                        </a>
                                    </li>

                                    <li className="nav-item">
                                        <a className="nav-link" href="/meedoen/">
                                            <span className="nav-title">Meedoen</span>
                                        </a>
                                    </li>
                                </ul>
                            </nav>
                        </div>

                        {/* Over ons */}
                        <div className="col-12 col-sm-12 col-md-4 col-lg-4">

                            <div className="py-3 d-block d-md-none"></div>

                            <span className="title" role="heading" aria-level="2">
                                Over ons
                            </span>

                            <div className="py-2"></div>

                            <nav className="navlist">
                                <ul className="list-unstyled navlist-nav">
                                    <li className="nav-item">
                                        <a className="nav-link" href="/jouw-mening-telt/">
                                            <span className="nav-title">Jouw mening telt</span>
                                        </a>
                                    </li>

                                    <li className="nav-item">
                                        <a className="nav-link" href="/visie-en-missie/">
                                            <span className="nav-title">Visie en missie</span>
                                        </a>
                                    </li>

                                    <li className="nav-item">
                                        <a className="nav-link" href="/onze-werkwijze/">
                                            <span className="nav-title">Onze werkwijze</span>
                                        </a>
                                    </li>

                                    <li className="nav-item">
                                        <a className="nav-link" href="/adviesraad/">
                                            <span className="nav-title">Adviesraad</span>
                                        </a>
                                    </li>

                                    <li className="nav-item">
                                        <a className="nav-link" href="/anbi-status/">
                                            <span className="nav-title">ANBI-status</span>
                                        </a>
                                    </li>

                                    <li className="nav-item">
                                        <a className="nav-link" href="/privacyverklaring-en-cookiebeleid/">
                                            <span className="nav-title">Privacy-statement</span>
                                        </a>
                                    </li>

                                    <li className="nav-item">
                                        <a className="nav-link" href="/jouw-rechten-onze-plichten/">
                                            <span className="nav-title">Jouw rechten, onze plichten</span>
                                        </a>
                                    </li>

                                    <li className="nav-item">
                                        <a className="nav-link" href="/aannamebeleid/">
                                            <span className="nav-title">Aannamebeleid</span>
                                        </a>
                                    </li>

                                    <li className="nav-item">
                                        <a className="nav-link" href="/sociale-veiligheid/">
                                            <span className="nav-title">Sociale veiligheid</span>
                                        </a>
                                    </li>

                                    <li className="nav-item">
                                        <a className="nav-link" href="/vrijwilligersbeleid/">
                                            <span className="nav-title">Vrijwilligersbeleid</span>
                                        </a>
                                    </li>

                                    <li className="nav-item">
                                        <a className="nav-link" href="/ons-team/">
                                            <span className="nav-title">Ons team</span>
                                        </a>
                                    </li>

                                    <li className="nav-item">
                                        <a className="nav-link" href="/certificering/">
                                            <span className="nav-title">Certificering</span>
                                        </a>
                                    </li>
                                </ul>
                            </nav>
                        </div>

                        {/* Contact */}
                        <div className="col-12 col-sm-12 col-md-4 col-lg-4">

                            <div className="py-3 d-block d-md-none"></div>

                            <span className="title" role="heading" aria-level="2">
                                Contact opnemen
                            </span>

                            <div className="py-2"></div>

                            {/* Socials */}
                            <ul className="socials">
                                <li>
                                    <a
                                        href="https://www.facebook.com/NeieNaober/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="Facebook van Neie Naober"
                                    >
                                        <i className="fa-brands fa-fw fa-lg fa-facebook"></i>
                                    </a>
                                </li>

                                <li>
                                    <a
                                        href="https://www.instagram.com/jongerenwerk_tynaarlo"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="Instagram van Neie Naober"
                                    >
                                        <i className="fa-brands fa-fw fa-lg fa-instagram"></i>
                                    </a>
                                </li>

                                <li>
                                    <a
                                        href="https://www.tiktok.com/@jongerenwerk_tynaarlo"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="Tiktok van Neie Naober"
                                    >
                                        <i className="fa-brands fa-fw fa-lg fa-tiktok"></i>
                                    </a>
                                </li>
                            </ul>

                            <div className="py-3"></div>

                            {/* Phone */}
                            <ul className="contact">
                                <li>
                                    <i className="fa fa-solid fa-phone"></i>
                                    <a href="tel:0592749332">
                                        0592 - 74 93 32
                                    </a>
                                </li>
                            </ul>

                            <div className="py-3"></div>

                            {/* Email */}
                            <ul className="contact">
                                <li>
                                    <i className="fa fa-solid fa-at"></i>
                                    <a href="mailto:info@neienaober.nl">
                                        info@neienaober.nl
                                    </a>
                                </li>
                            </ul>

                            <div className="py-3"></div>

                            {/* Address */}
                            <div className="contact-addresses">
                                <ul className="contact">
                                    <li>
                                        <i className="fa-location-dot fa-solid"></i>

                                        <a
                                            href="https://www.google.com/maps/dir//Middenstraat%201%2C%209471%20GC%20Zuidlaren%20Nederland/"
                                            className="contact-address-link"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <address className="d-inline-block">
                                                <span className="contact-address-street">
                                                    Middenstraat 1
                                                </span>

                                                <span className="contact-address-separator">
                                                    ,{" "}
                                                </span>

                                                <span className="contact-address-postal-code">
                                                    9471 GC
                                                </span>

                                                <span className="contact-address-locality">
                                                    Zuidlaren
                                                </span>
                                            </address>
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            <div className="py-3"></div>

                            {/* Tinten */}
                            <div className="onderdeel">
                                <div className="logo-onderdeel">
                                    <a
                                        href="https://www.tintengroep.nl/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="Logo Tinten, bezoek website."
                                    >
                                        <img
                                            className="img-fluid logo min-h-1em"
                                            loading="lazy"
                                            alt="Tinten"
                                            src={logoTinten}
                                            height="54"
                                            width="160"
                                        />
                                    </a>
                                </div>

                                <div className="py-1"></div>

                                <span className="desc">
                                    Neie Naober is onderdeel van Tintengroep
                                </span>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom */}
            <div className="bottom">
                <div className="container d-flex flex-row flex-wrap justify-content-between">

                    <div className="flex-grow-1 d-flex flex-row">
                        <a
                            className="nav-link"
                            href="/privacyverklaring-en-cookiebeleid/"
                        >
                            <small>Privacyverklaring en cookiebeleid</small>
                        </a>

                        <span className="d-md-none flex-grow-1"></span>

                        <a
                            className="nav-link"
                            href="/algemene-voorwaarden/"
                        >
                            <small>Algemene voorwaarden</small>
                        </a>

                        <span className="d-none d-md-block flex-grow-1"></span>
                    </div>

                    <div className="flex-grow-1 d-flex flex-row">

                        <span className="d-none d-md-block flex-grow-1"></span>

                        <a
                            className="nav-link logo-nc_websites"
                            href="https://www.nc-websites.nl/webdesign-gieten/"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Logo NC-Websites, bezoek website."
                        >
                            <small>NC-Websites</small>
                        </a>

                        <span className="d-md-none flex-grow-1"></span>

                        <a
                            className="nav-link"
                            href="/inloggen/"
                            title="Inloggen"
                        >
                            <small>Inloggen</small>
                        </a>

                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
