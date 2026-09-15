import aboutus from '../assets/aboutus.webp'
import Header from '../components/layout/Header/Header'
import Footer from '../components/layout/Footer'

function AboutUs() {
    return (
        <>
            <Header />
            <main id="content" tabIndex="-1">
                <section className="header">
                    <div
                        data-partial="image-carousel"
                        data-ride="carousel"
                        id="id-76522cc48e6e9ba54c947ad17e9c5ae9"
                        className="carousel slide"
                    >
                        <div className="carousel-inner">
                            <div className="carousel-item active">
                                <picture data-image-id="298">
                                    <img
                                        className="img-fluid"
                                        src={aboutus}
                                        alt=""
                                        width="1440"
                                        height="350"
                                        loading="eager"
                                    />
                                </picture>
                            </div>
                        </div>
                    </div>
                </section>

                <div data-partial="preset-list" data-preset-count="1">
                    <section className="content-template-default content-subtemplate-content nopad wave-white">
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
                                                    <a
                                                        className="breadcrumb-item"
                                                        href="./"
                                                        title="Home"
                                                    >
                                                        <span className="breadcrumb-title">
                                                            Home
                                                        </span>
                                                    </a>
                                                </li>

                                                <li
                                                    className="breadcrumb-item active"
                                                    aria-current="location"
                                                >
                                                    <span className="breadcrumb-title">
                                                        Over ons
                                                    </span>
                                                </li>
                                            </ol>
                                        </nav>
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-12 col-sm-12 col-md-12 col-lg-12">
                                    <h1
                                        className="content-item-title title"
                                        id="content-over-ons"
                                    >
                                        Over ons
                                    </h1>

                                    <div className="content-item-content content">
                                        <p>
                                            Neie Naober is er voor iedereen. Als een
                                            goede buur zetten we ons actief in om de
                                            eigen kracht en talenten van de inwoners
                                            te versterken. Met elkaar werken we aan
                                            de leefbaarheid in een dorp of buurt.
                                            Dit doen we in nauwe samenwerking met
                                            het Sociaal Team van de gemeente Tynaarlo
                                            in Zuidlaren, Eelde-Paterswolde en
                                            Vries. We maken de verbinding tussen
                                            informele en professionele zorg. Onze
                                            medewerkers bieden zowel organisaties
                                            als inwoners hulp en ondersteuning.
                                            Denk aan vrijwilligerswerk, mantelzorg,
                                            bewonersinitiatieven en trainingen.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                <section className="content-template-default nopad">
                    <div className="container">
                        <div className="row">
                            <div className="col-12 col-sm-9 col-md-6 autohide">
                                <div className="py-3"></div>

                                <div data-partial="text">
                                    <h3 id="content-benieuwd-wie-er-werken-bij-neie-naober">
                                        Benieuwd wie er werken bij Neie Naober?
                                    </h3>

                                    <p>
                                        Ontdek het{' '}
                                        <a href="/ons-team">
                                            hier
                                        </a>
                                    </p>
                                </div>

                                <div className="py-3"></div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-12 autohide">
                                <div className="py-3"></div>

                                <div
                                    className="team-members"
                                    data-partial="preset-list"
                                    data-preset-count="0"
                                >
                                    <div className="row"></div>
                                </div>

                                <div className="py-3"></div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="content-template-default top-nopad">
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                <h2
                                    data-partial="element"
                                    id="content-toch-op-zoek-naar-iets-anders"
                                >
                                    Toch op zoek naar iets anders?
                                </h2>

                                <div className="py-2"></div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-12">
                                <div className="menublokken sub">
                                    <nav className="navlist">
                                        <ul className="list-unstyled navlist-nav">

                                            <li className="nav-item">
                                                <a
                                                    className="nav-link"
                                                    href="/jouw-mening-telt"
                                                >
                                                    <span
                                                        className="nav-icon"
                                                        aria-hidden="true"
                                                    >
                                                        <i className="fa fa-solid fa-comments-question"></i>
                                                    </span>

                                                    <span className="nav-indentation">
                                                        &nbsp;
                                                    </span>

                                                    <span className="nav-title">
                                                        Jouw mening telt
                                                    </span>
                                                </a>
                                            </li>

                                            <li className="nav-item">
                                                <a
                                                    className="nav-link"
                                                    href="/visie-en-missie"
                                                >
                                                    <span
                                                        className="nav-icon"
                                                        aria-hidden="true"
                                                    >
                                                        <i className="fa fa-solid fa-globe"></i>
                                                    </span>

                                                    <span className="nav-indentation">
                                                        &nbsp;
                                                    </span>

                                                    <span className="nav-title">
                                                        Visie en missie
                                                    </span>
                                                </a>
                                            </li>

                                            <li className="nav-item">
                                                <a
                                                    className="nav-link"
                                                    href="/onze-werkwijze"
                                                >
                                                    <span
                                                        className="nav-icon"
                                                        aria-hidden="true"
                                                    >
                                                        <i className="fa fa-solid fa-briefcase"></i>
                                                    </span>

                                                    <span className="nav-indentation">
                                                        &nbsp;
                                                    </span>

                                                    <span className="nav-title">
                                                        Onze werkwijze
                                                    </span>
                                                </a>
                                            </li>

                                            <li className="nav-item">
                                                <a
                                                    className="nav-link"
                                                    href="/adviesraad"
                                                >
                                                    <span
                                                        className="nav-icon"
                                                        aria-hidden="true"
                                                    >
                                                        <i className="fa fa-solid fa-handshake"></i>
                                                    </span>

                                                    <span className="nav-indentation">
                                                        &nbsp;
                                                    </span>

                                                    <span className="nav-title">
                                                        Adviesraad
                                                    </span>
                                                </a>
                                            </li>

                                            <li className="nav-item">
                                                <a
                                                    className="nav-link"
                                                    href="/anbi-status"
                                                >
                                                    <span
                                                        className="nav-icon"
                                                        aria-hidden="true"
                                                    >
                                                        <i className="fa fa-solid fa-circle-info"></i>
                                                    </span>

                                                    <span className="nav-indentation">
                                                        &nbsp;
                                                    </span>

                                                    <span className="nav-title">
                                                        ANBI-status
                                                    </span>
                                                </a>
                                            </li>

                                            <li className="nav-item">
                                                <a
                                                    className="nav-link"
                                                    href="/privacyverklaring-en-cookiebeleid"
                                                >
                                                    <span
                                                        className="nav-icon"
                                                        aria-hidden="true"
                                                    >
                                                        <i className="fa fa-solid fa-shield-halved"></i>
                                                    </span>

                                                    <span className="nav-indentation">
                                                        &nbsp;
                                                    </span>

                                                    <span className="nav-title">
                                                        Privacy-statement
                                                    </span>
                                                </a>
                                            </li>

                                            <li className="nav-item">
                                                <a
                                                    className="nav-link"
                                                    href="/jouw-rechten-onze-plichten"
                                                >
                                                    <span
                                                        className="nav-icon"
                                                        aria-hidden="true"
                                                    >
                                                        <i className="fa fa-solid fa-book-open-lines"></i>
                                                    </span>

                                                    <span className="nav-indentation">
                                                        &nbsp;
                                                    </span>

                                                    <span className="nav-title">
                                                        Jouw rechten, onze plichten
                                                    </span>
                                                </a>
                                            </li>

                                            <li className="nav-item">
                                                <a
                                                    className="nav-link"
                                                    href="/aannamebeleid"
                                                >
                                                    <span
                                                        className="nav-icon"
                                                        aria-hidden="true"
                                                    >
                                                        <i className="fa fa-solid fa-bookmark"></i>
                                                    </span>

                                                    <span className="nav-indentation">
                                                        &nbsp;
                                                    </span>

                                                    <span className="nav-title">
                                                        Aannamebeleid
                                                    </span>
                                                </a>
                                            </li>

                                            <li className="nav-item">
                                                <a
                                                    className="nav-link"
                                                    href="/sociale-veiligheid"
                                                >
                                                    <span
                                                        className="nav-icon"
                                                        aria-hidden="true"
                                                    >
                                                        <i className="fa fa-solid fa-shield-heart"></i>
                                                    </span>

                                                    <span className="nav-indentation">
                                                        &nbsp;
                                                    </span>

                                                    <span className="nav-title">
                                                        Sociale veiligheid
                                                    </span>
                                                </a>
                                            </li>

                                            <li className="nav-item">
                                                <a
                                                    className="nav-link"
                                                    href="/vrijwilligersbeleid"
                                                >
                                                    <span
                                                        className="nav-icon"
                                                        aria-hidden="true"
                                                    >
                                                        <i className="fa fa-solid fa-memo-circle-info"></i>
                                                    </span>

                                                    <span className="nav-indentation">
                                                        &nbsp;
                                                    </span>

                                                    <span className="nav-title">
                                                        Vrijwilligersbeleid
                                                    </span>
                                                </a>
                                            </li>

                                            <li className="nav-item">
                                                <a
                                                    className="nav-link"
                                                    href="/ons-team"
                                                >
                                                    <span
                                                        className="nav-icon"
                                                        aria-hidden="true"
                                                    >
                                                        <i className="fa fa-solid fa-people-group"></i>
                                                    </span>

                                                    <span className="nav-indentation">
                                                        &nbsp;
                                                    </span>

                                                    <span className="nav-title">
                                                        Ons team
                                                    </span>
                                                </a>
                                            </li>

                                            <li className="nav-item">
                                                <a
                                                    className="nav-link"
                                                    href="/certificering"
                                                >
                                                    <span
                                                        className="nav-icon"
                                                        aria-hidden="true"
                                                    >
                                                        <i className="fa fa-solid fa-shield-check"></i>
                                                    </span>

                                                    <span className="nav-indentation">
                                                        &nbsp;
                                                    </span>

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

                <div className="py-3 d-block d-md-none"></div>
                <div className="py-5 d-none d-md-block"></div>
            </main>
            <Footer />
        </>
    );
}

export default AboutUs;