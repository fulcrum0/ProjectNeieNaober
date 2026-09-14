import image from '../assets/image.webp'
import Header from '../components/layout/Header/Header'
import Footer from '../components/layout/Footer'

function Index() {
    return (
        <>
            <Header />
            <section class="header">
                <div data-partial="image-carousel" data-ride="carousel" id="id-ed1453d0e74fa2d29939d76db9b65b51" class="carousel slide">
                    <div class="carousel-inner">
                        <div class="carousel-item active">
                            <img class="img-fluid" src={image} alt="" width="1440" height="350" loading="eager" fetchpriority="high" />
                        </div>
                    </div>
                </div>
            </section>
            <section className="content-template-default nopad wave-white">
                <div className="container">
                    <div className="row">
                        <div className="col-12">

                            <div className="menublokken">

                                <nav className="navlist">

                                    <ul className="list-unstyled navlist-nav">

                                        {/* Buurt / dorp */}
                                        <li className="nav-item">
                                            <button
                                                aria-expanded="false"
                                                aria-controls="dropdown-id-buurt"
                                                type="button"
                                            >
                                                <span className="nav-icon" aria-hidden="true">
                                                    <i className="fa-solid fa-house" aria-hidden="true"></i>
                                                </span>

                                                <span className="nav-indentation">
                                                    &nbsp;
                                                </span>

                                                <span className="nav-title">
                                                    Buurt / dorp
                                                </span>
                                            </button>

                                            <ul
                                                id="dropdown-id-buurt"
                                                aria-hidden="true"
                                            >
                                                <li className="nav-item">
                                                    <a className="nav-link" href="idee-voor-mijn-buurt/">
                                                        <span className="nav-title">
                                                            Idee voor mijn buurt
                                                        </span>
                                                    </a>
                                                </li>

                                                <li className="nav-item">
                                                    <a className="nav-link" href="naoberhulp/">
                                                        <span className="nav-title">
                                                            Naoberhulp
                                                        </span>
                                                    </a>
                                                </li>

                                                <li className="nav-item">
                                                    <a className="nav-link" href="leefbaarheid/">
                                                        <span className="nav-title">
                                                            Leefbaarheid
                                                        </span>
                                                    </a>
                                                </li>

                                                <li className="nav-item">
                                                    <a className="nav-link" href="ondersteuning-dorpsinitiatieven/">
                                                        <span className="nav-title">
                                                            Ondersteuning dorpsinitiatieven
                                                        </span>
                                                    </a>
                                                </li>

                                                <li className="nav-item">
                                                    <a className="nav-link" href="buurtbemiddeling/">
                                                        <span className="nav-title">
                                                            Buurtbemiddeling
                                                        </span>
                                                    </a>
                                                </li>
                                            </ul>
                                        </li>


                                        {/* Ontmoeten */}
                                        <li className="nav-item">
                                            <button
                                                aria-expanded="false"
                                                aria-controls="dropdown-id-ontmoeten"
                                                type="button"
                                            >
                                                <span className="nav-icon" aria-hidden="true">
                                                    <i className="fa fa-solid fa-people-group" aria-hidden="true"></i>
                                                </span>

                                                <span className="nav-indentation">
                                                    &nbsp;
                                                </span>

                                                <span className="nav-title">
                                                    Ontmoeten
                                                </span>
                                            </button>

                                            <ul
                                                id="dropdown-id-ontmoeten"
                                                aria-hidden="true"
                                            >
                                                <li className="nav-item">
                                                    <a className="nav-link" href="ontmoeten-2/">
                                                        <span className="nav-title">
                                                            Ouderen
                                                        </span>
                                                    </a>
                                                </li>

                                                <li className="nav-item">
                                                    <a className="nav-link" href="jongeren/">
                                                        <span className="nav-title">
                                                            Jongeren
                                                        </span>
                                                    </a>
                                                </li>

                                                <li className="nav-item">
                                                    <a className="nav-link" href="regenboogactiviteiten/">
                                                        <span className="nav-title">
                                                            🌈 Regenboogactiviteiten
                                                        </span>
                                                    </a>
                                                </li>
                                            </ul>
                                        </li>


                                        {/* Diensten voor elkaar */}
                                        <li className="nav-item">
                                            <button
                                                aria-expanded="false"
                                                aria-controls="dropdown-id-diensten"
                                                type="button"
                                            >
                                                <span className="nav-icon" aria-hidden="true">
                                                    <i class="fa-solid fa-people"></i>
                                                </span>

                                                <span className="nav-indentation">
                                                    &nbsp;
                                                </span>

                                                <span className="nav-title">
                                                    Diensten voor elkaar
                                                </span>
                                            </button>

                                            <ul
                                                id="dropdown-id-diensten"
                                                aria-hidden="true"
                                            >
                                                <li className="nav-item">
                                                    <a className="nav-link" href="kleding-en-speelgoedbeurs/">
                                                        <span className="nav-title">
                                                            Kleding- en speelgoedbeurs
                                                        </span>
                                                    </a>
                                                </li>

                                                <li className="nav-item">
                                                    <a className="nav-link" href="klussendienst/">
                                                        <span className="nav-title">
                                                            Klussendienst
                                                        </span>
                                                    </a>
                                                </li>

                                                <li className="nav-item">
                                                    <a className="nav-link" href="vrijwilligerswerk/">
                                                        <span className="nav-title">
                                                            Vrijwilligerswerk
                                                        </span>
                                                    </a>
                                                </li>
                                            </ul>
                                        </li>


                                        {/* Individuele ondersteuning */}
                                        <li className="nav-item">
                                            <button
                                                aria-expanded="false"
                                                aria-controls="dropdown-id-individuele"
                                                type="button"
                                            >
                                                <span className="nav-icon" aria-hidden="true">
                                                    <i className="fa fa-solid fa-head-side-heart" aria-hidden="true"></i>
                                                </span>

                                                <span className="nav-indentation">
                                                    &nbsp;
                                                </span>

                                                <span className="nav-title">
                                                    Individuele ondersteuning
                                                </span>
                                            </button>

                                            <ul
                                                id="dropdown-id-individuele"
                                                aria-hidden="true"
                                            >
                                                <li className="nav-item">
                                                    <a className="nav-link" href="welzijnsondersteuner-huisarts/">
                                                        <span className="nav-title">
                                                            Welzijnsondersteuner huisarts
                                                        </span>
                                                    </a>
                                                </li>

                                                <li className="nav-item">
                                                    <a className="nav-link" href="inburgering/">
                                                        <span className="nav-title">
                                                            Inburgering
                                                        </span>
                                                    </a>
                                                </li>
                                            </ul>
                                        </li>


                                        {/* Ons team */}
                                        <li className="nav-item">
                                            <a className="nav-link" href="ons-team/">
                                                <span className="nav-icon" aria-hidden="true">
                                                    <i className="fa fa-solid fa-people-group" aria-hidden="true"></i>
                                                </span>

                                                <span className="nav-indentation">
                                                    &nbsp;
                                                </span>

                                                <span className="nav-title">
                                                    Ons team
                                                </span>
                                            </a>
                                        </li>


                                        {/* Ontmoeten jongeren */}
                                        <li className="nav-item">
                                            <button
                                                aria-expanded="false"
                                                aria-controls="dropdown-id-jongeren"
                                                type="button"
                                            >
                                                <span className="nav-icon" aria-hidden="true">
                                                    <i className="fa fa-solid fa-photo-film-music" aria-hidden="true"></i>
                                                </span>

                                                <span className="nav-indentation">
                                                    &nbsp;
                                                </span>

                                                <span className="nav-title">
                                                    Ontmoeten jongeren
                                                </span>
                                            </button>

                                            <ul
                                                id="dropdown-id-jongeren"
                                                aria-hidden="true"
                                            >
                                                <li className="nav-item">
                                                    <a
                                                        className="nav-link"
                                                        href="waar-kan-een-jongerenwerker-mij-bij-helpen/"
                                                    >
                                                        <span className="nav-title">
                                                            Waar kan een jongerenwerker mij bij helpen?
                                                        </span>
                                                    </a>
                                                </li>

                                                <li className="nav-item">
                                                    <a className="nav-link" href="make-your-move/">
                                                        <span className="nav-title">
                                                            Make your move
                                                        </span>
                                                    </a>
                                                </li>

                                                <li className="nav-item">
                                                    <a className="nav-link" href="keet-van-tynaarlo/">
                                                        <span className="nav-title">
                                                            Keet van Tynaarlo
                                                        </span>
                                                    </a>
                                                </li>

                                                <li className="nav-item">
                                                    <a className="nav-link" href="jongtynaarlo/">
                                                        <span className="nav-title">
                                                            JongTynaarlo
                                                        </span>
                                                    </a>
                                                </li>
                                            </ul>
                                        </li>


                                        {/* Ondersteuning jongeren */}
                                        <li className="nav-item">
                                            <button
                                                aria-expanded="false"
                                                aria-controls="dropdown-id-ondersteuning-jongeren"
                                                type="button"
                                            >
                                                <span className="nav-icon" aria-hidden="true">
                                                    <i className="fa fa-solid fa-child-reaching" aria-hidden="true"></i>
                                                </span>

                                                <span className="nav-indentation">
                                                    &nbsp;
                                                </span>

                                                <span className="nav-title">
                                                    Ondersteuning jongeren
                                                </span>
                                            </button>

                                            <ul
                                                id="dropdown-id-ondersteuning-jongeren"
                                                aria-hidden="true"
                                            >
                                                <li className="nav-item">
                                                    <a
                                                        className="nav-link"
                                                        href="waar-kan-een-jongerenwerker-mij-bij-helpen-2/"
                                                    >
                                                        <span className="nav-title">
                                                            Waar kan een jongerenwerker mij bij helpen?
                                                        </span>
                                                    </a>
                                                </li>

                                                <li className="nav-item">
                                                    <a className="nav-link" href="mentor4you/">
                                                        <span className="nav-title">
                                                            Mentor4You
                                                        </span>
                                                    </a>
                                                </li>

                                                <li className="nav-item">
                                                    <a className="nav-link" href="jonge-mantelzorgers-2/">
                                                        <span className="nav-title">
                                                            Jonge mantelzorgers
                                                        </span>
                                                    </a>
                                                </li>

                                                <li className="nav-item">
                                                    <a className="nav-link" href="voorlichting-en-trainingen/">
                                                        <span className="nav-title">
                                                            Voorlichting en trainingen
                                                        </span>
                                                    </a>
                                                </li>

                                                <li className="nav-item">
                                                    <a
                                                        className="nav-link"
                                                        href="ondersteuning-jongeren/jongerenwerk-op-school/"
                                                    >
                                                        <span className="nav-title">
                                                            Jongerenwerk op school
                                                        </span>
                                                    </a>
                                                </li>
                                            </ul>
                                        </li>


                                        {/* Ouderen */}
                                        <li className="nav-item">
                                            <button
                                                aria-expanded="false"
                                                aria-controls="dropdown-id-ouderen"
                                                type="button"
                                            >
                                                <span className="nav-icon" aria-hidden="true">
                                                    <i className="fa fa-solid fa-person-cane" aria-hidden="true"></i>
                                                </span>

                                                <span className="nav-indentation">
                                                    &nbsp;
                                                </span>

                                                <span className="nav-title">
                                                    Ouderen
                                                </span>
                                            </button>

                                            <ul
                                                id="dropdown-id-ouderen"
                                                aria-hidden="true"
                                            >
                                                <li className="nav-item">
                                                    <a className="nav-link" href="bewegen/">
                                                        <span className="nav-title">
                                                            Bewegen
                                                        </span>
                                                    </a>
                                                </li>

                                                <li className="nav-item">
                                                    <a className="nav-link" href="ontmoeten-2/">
                                                        <span className="nav-title">
                                                            Ontmoeten
                                                        </span>
                                                    </a>
                                                </li>

                                                <li className="nav-item">
                                                    <a className="nav-link" href="voorlichting-en-preventie/">
                                                        <span className="nav-title">
                                                            Voorlichting en preventie
                                                        </span>
                                                    </a>
                                                </li>
                                            </ul>
                                        </li>


                                        {/* Vrijwilligerswerk */}
                                        <li className="nav-item">
                                            <a className="nav-link" href="vrijwilligerswerk/">
                                                <span className="nav-icon" aria-hidden="true">
                                                    <i className="fa fa-solid fa-handshake-simple" aria-hidden="true"></i>
                                                </span>

                                                <span className="nav-indentation">
                                                    &nbsp;
                                                </span>

                                                <span className="nav-title">
                                                    Vrijwilligerswerk
                                                </span>
                                            </a>
                                        </li>


                                        {/* Mantelzorg */}
                                        <li className="nav-item">
                                            <button
                                                aria-expanded="false"
                                                aria-controls="dropdown-id-mantelzorg"
                                                type="button"
                                            >
                                                <span className="nav-icon" aria-hidden="true">
                                                    <i className="fa fa-solid fa-hands-holding-heart" aria-hidden="true"></i>
                                                </span>

                                                <span className="nav-indentation">
                                                    &nbsp;
                                                </span>

                                                <span className="nav-title">
                                                    Mantelzorg
                                                </span>
                                            </button>

                                            <ul
                                                id="dropdown-id-mantelzorg"
                                                aria-hidden="true"
                                            >
                                                <li className="nav-item">
                                                    <a className="nav-link" href="volwassen-mantelzorgers/">
                                                        <span className="nav-title">
                                                            Volwassen mantelzorgers
                                                        </span>
                                                    </a>
                                                </li>

                                                <li className="nav-item">
                                                    <a className="nav-link" href="jonge-mantelzorgers-2/">
                                                        <span className="nav-title">
                                                            Jonge mantelzorgers
                                                        </span>
                                                    </a>
                                                </li>
                                            </ul>
                                        </li>


                                        {/* Meedoen */}
                                        <li className="nav-item">
                                            <button
                                                aria-expanded="false"
                                                aria-controls="dropdown-id-meedoen"
                                                type="button"
                                            >
                                                <span className="nav-icon" aria-hidden="true">
                                                    <i className="fa fa-solid fa-people-line" aria-hidden="true"></i>
                                                </span>

                                                <span className="nav-indentation">
                                                    &nbsp;
                                                </span>

                                                <span className="nav-title">
                                                    Meedoen
                                                </span>
                                            </button>

                                            <ul
                                                id="dropdown-id-meedoen"
                                                aria-hidden="true"
                                            >
                                                <li className="nav-item">
                                                    <a className="nav-link" href="vrijwilligerswerk-2/">
                                                        <span className="nav-title">
                                                            Vrijwilligerswerk
                                                        </span>
                                                    </a>
                                                </li>

                                                <li className="nav-item">
                                                    <a className="nav-link" href="inburgering-2/">
                                                        <span className="nav-title">
                                                            Inburgering
                                                        </span>
                                                    </a>
                                                </li>

                                                <li className="nav-item">
                                                    <a className="nav-link" href="participatie/">
                                                        <span className="nav-title">
                                                            Participatie
                                                        </span>
                                                    </a>
                                                </li>

                                                <li className="nav-item">
                                                    <a className="nav-link" href="trainingen/">
                                                        <span className="nav-title">
                                                            Trainingen
                                                        </span>
                                                    </a>
                                                </li>
                                            </ul>
                                        </li>


                                        {/* Contact */}
                                        <li className="nav-item">
                                            <a className="nav-link" href="contact/">
                                                <span className="nav-icon" aria-hidden="true">
                                                    <i className="fa fa-solid fa-circle-info" aria-hidden="true"></i>
                                                </span>

                                                <span className="nav-indentation">
                                                    &nbsp;
                                                </span>

                                                <span className="nav-title">
                                                    Contact
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

            <Footer />
        </>
    );

}
export default Index