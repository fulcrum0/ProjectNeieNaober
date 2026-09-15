import login from '../assets/login.webp'
import Header from '../components/layout/Header/Header'
import Footer from '../components/layout/Footer'

function Login() {
    return (
        <>
            <Header />
            <main id="content" tabIndex="-1">
                <section className="header">
                    <div
                        data-partial="image-carousel"
                        data-ride="carousel"
                        className="carousel slide"
                        id="image-carousel"
                    >
                        <div className="carousel-inner">
                            <div className="carousel-item active">
                                <picture >
                                    <img
                                        className="img-fluid"
                                        src={login}
                                        alt="Rennende jongeren"
                                        width="1440"
                                        height="350"
                                        loading="eager"
                                        fetchPriority="high"
                                    />
                                </picture>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="content-template-default bot-nopad wave-white">
                    <div className="container">
                        <div className="row">
                            <div className="col-12 col-sm-12 col-md-4 col-lg-4">
                                <span className="title-block is-empty" />
                            </div>

                            <div className="col-12 col-sm-12 offset-md-4 col-md-4 offset-lg-4 col-lg-4">
                                <span className="title-block right is-empty" />
                            </div>
                        </div>
                    </div>
                </section>

                <section className="content-template-default content-subtemplate-content">
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                <div className="kruimelpad">
                                    <nav
                                        className="navlist"
                                        aria-label="Broodkruimelnavigatie"
                                    >
                                        <ol className="breadcrumb">
                                            <li className="breadcrumb-item">
                                                <a className="breadcrumb-item" href="./" title="Home">
                                                    <span className="breadcrumb-title">Home</span>
                                                </a>
                                            </li>

                                            <li
                                                className="breadcrumb-item active"
                                                aria-current="location"
                                            >
                                                <span
                                                    className="breadcrumb-icon"
                                                    aria-hidden="true"
                                                >
                                                    <i className="fa fa-solid fa-user-lock" />
                                                </span>

                                                <span className="breadcrumb-indentation">
                                                    &nbsp;&nbsp;
                                                </span>

                                                <span className="breadcrumb-title">
                                                    Klantenportaal
                                                </span>
                                            </li>
                                        </ol>
                                    </nav>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            {/* Main content */}
                            <div className="col-12 col-md-6">
                                <h1
                                    className="content-item-title title"
                                    id="content-klantportaal"
                                >
                                    Klantportaal
                                </h1>

                                <div className="content-item-content content">
                                    <p>
                                        De sociaal werker met wie je contact hebt legt gegevens en
                                        informatie vast in een klantdossier. Wanneer er een
                                        klantdossier wordt gemaakt dan wordt dit met jou besproken.
                                        Het klantdossier gaat over jou. Dat betekent dat je recht
                                        hebt om deze informatie in te zien.
                                    </p>

                                    <h2 id="content-online-klantdossier">
                                        Online klantdossier
                                    </h2>

                                    <p>
                                        Van de medewerker met wie jij contact hebt ontvang je via
                                        de mail een uitnodiging voor het klantportaal. Via dit
                                        online klantportaal kun je inloggen en je eigen dossier
                                        bekijken.
                                    </p>
                                </div>

                                <div className="partial-list">
                                    <a
                                        className="btn btn-light btn-download"
                                        href="dynamic/download/d59784533d7d39511c53b5fcef1e59456e21441378bc9462c0d3f4f8af09d62e.pdf?name=Bekijk+hier+de+instructie+klantportaal"
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <i className="fa fa-solid fa-file-pdf fa-fw" />
                                        <span className="sr-only">
                                            PDF Bestand
                                        </span>
                                        Bekijk hier de instructie klantportaal
                                    </a>
                                </div>
                            </div>

                            {/* Right content */}
                            <div className="col-12 col-md-6">
                                <div className="title-spacer" />

                                <p>
                                    <a
                                        className="btn btn-secondary"
                                        href="https://mijn.regas.nl/login/client/tinten"
                                        target="_blank"
                                        rel="noreferrer noopener"
                                    >
                                        Klik hier voor het klantenportaal
                                    </a>
                                </p>

                                <h2 id="content-klantdossier">
                                    Klantdossier
                                </h2>

                                <p>
                                    Wil je liever een papieren afschrift van jouw klantdossier?
                                    Dat kan natuurlijk ook. De medewerker met wie je contact hebt
                                    kan dit uitdraaien en overhandigen.
                                </p>

                                <h2 id="content-meer-informatie">
                                    Meer informatie
                                </h2>

                                <p>
                                    Heb je vragen over het klantdossier? Dan kan jouw
                                    contactpersoon bij Neie Naober je verder helpen.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="content-template-default nopad">
                    <div className="container">
                        <h2 className="hide-when-empty pb-3">
                            Toch op zoek naar iets anders?
                        </h2>

                        <div className="row">
                            <div className="col-12">
                                <div className="menublokken sub">
                                    <nav className="navlist">
                                        <ul className="list-unstyled navlist-nav">
                                            <li className="nav-item">
                                                <a
                                                    className="nav-link"
                                                    href="jouw-mening-telt/"
                                                >
                                                    <span className="nav-icon" aria-hidden="true">
                                                        <i className="fa fa-solid fa-comments-question" />
                                                    </span>
                                                    <span className="nav-indentation">&nbsp;</span>
                                                    <span className="nav-title">
                                                        Jouw mening telt
                                                    </span>
                                                </a>
                                            </li>

                                            <li className="nav-item">
                                                <a
                                                    className="nav-link"
                                                    href="visie-en-missie/"
                                                >
                                                    <span className="nav-icon" aria-hidden="true">
                                                        <i className="fa fa-solid fa-globe" />
                                                    </span>
                                                    <span className="nav-indentation">&nbsp;</span>
                                                    <span className="nav-title">
                                                        Visie en missie
                                                    </span>
                                                </a>
                                            </li>

                                            <li className="nav-item">
                                                <a
                                                    className="nav-link"
                                                    href="onze-werkwijze/"
                                                >
                                                    <span className="nav-icon" aria-hidden="true">
                                                        <i className="fa fa-solid fa-briefcase" />
                                                    </span>
                                                    <span className="nav-indentation">&nbsp;</span>
                                                    <span className="nav-title">
                                                        Onze werkwijze
                                                    </span>
                                                </a>
                                            </li>

                                            <li className="nav-item">
                                                <a
                                                    className="nav-link"
                                                    href="adviesraad/"
                                                >
                                                    <span className="nav-icon" aria-hidden="true">
                                                        <i className="fa fa-solid fa-handshake" />
                                                    </span>
                                                    <span className="nav-indentation">&nbsp;</span>
                                                    <span className="nav-title">
                                                        Adviesraad
                                                    </span>
                                                </a>
                                            </li>

                                            <li className="nav-item">
                                                <a
                                                    className="nav-link"
                                                    href="anbi-status/"
                                                >
                                                    <span className="nav-icon" aria-hidden="true">
                                                        <i className="fa fa-solid fa-circle-info" />
                                                    </span>
                                                    <span className="nav-indentation">&nbsp;</span>
                                                    <span className="nav-title">
                                                        ANBI-status
                                                    </span>
                                                </a>
                                            </li>

                                            <li className="nav-item">
                                                <a
                                                    className="nav-link"
                                                    href="privacyverklaring-en-cookiebeleid/"
                                                >
                                                    <span className="nav-icon" aria-hidden="true">
                                                        <i className="fa fa-solid fa-shield-halved" />
                                                    </span>
                                                    <span className="nav-indentation">&nbsp;</span>
                                                    <span className="nav-title">
                                                        Privacy-statement
                                                    </span>
                                                </a>
                                            </li>

                                            <li className="nav-item">
                                                <a
                                                    className="nav-link"
                                                    href="jouw-rechten-onze-plichten/"
                                                >
                                                    <span className="nav-icon" aria-hidden="true">
                                                        <i className="fa fa-solid fa-book-open-lines" />
                                                    </span>
                                                    <span className="nav-indentation">&nbsp;</span>
                                                    <span className="nav-title">
                                                        Jouw rechten, onze plichten
                                                    </span>
                                                </a>
                                            </li>

                                            <li className="nav-item">
                                                <a
                                                    className="nav-link"
                                                    href="aannamebeleid/"
                                                >
                                                    <span className="nav-icon" aria-hidden="true">
                                                        <i className="fa fa-solid fa-bookmark" />
                                                    </span>
                                                    <span className="nav-indentation">&nbsp;</span>
                                                    <span className="nav-title">
                                                        Aannamebeleid
                                                    </span>
                                                </a>
                                            </li>

                                            <li className="nav-item">
                                                <a
                                                    className="nav-link"
                                                    href="sociale-veiligheid/"
                                                >
                                                    <span className="nav-icon" aria-hidden="true">
                                                        <i className="fa fa-solid fa-shield-heart" />
                                                    </span>
                                                    <span className="nav-indentation">&nbsp;</span>
                                                    <span className="nav-title">
                                                        Sociale veiligheid
                                                    </span>
                                                </a>
                                            </li>

                                            <li className="nav-item">
                                                <a
                                                    className="nav-link"
                                                    href="vrijwilligersbeleid/"
                                                >
                                                    <span className="nav-icon" aria-hidden="true">
                                                        <i className="fa fa-solid fa-memo-circle-info" />
                                                    </span>
                                                    <span className="nav-indentation">&nbsp;</span>
                                                    <span className="nav-title">
                                                        Vrijwilligersbeleid
                                                    </span>
                                                </a>
                                            </li>

                                            <li className="nav-item">
                                                <a
                                                    className="nav-link"
                                                    href="ons-team/"
                                                >
                                                    <span className="nav-icon" aria-hidden="true">
                                                        <i className="fa fa-solid fa-people-group" />
                                                    </span>
                                                    <span className="nav-indentation">&nbsp;</span>
                                                    <span className="nav-title">
                                                        Ons team
                                                    </span>
                                                </a>
                                            </li>

                                            <li className="nav-item">
                                                <a
                                                    className="nav-link"
                                                    href="certificering/"
                                                >
                                                    <span className="nav-icon" aria-hidden="true">
                                                        <i className="fa fa-solid fa-shield-check" />
                                                    </span>
                                                    <span className="nav-indentation">&nbsp;</span>
                                                    <span className="nav-title">
                                                        Certificering
                                                    </span>
                                                </a>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="py-3 d-block d-md-none" />
                <div className="py-5 d-none d-md-block" />
            </main>
            <Footer />
        </>
    );
}

export default Login;