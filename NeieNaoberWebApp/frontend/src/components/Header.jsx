import { Link } from 'react-router-dom'

import './Header.css'

import logo from '../assets/VIPtynaarlo.svg'

function Header({ showAvatar = true }) {
    return (
        <>
            <div className="header-container">
                <img className='header-logo-container' src={logo} />

                {showAvatar && (
                    <>
                        <div className="header-profile-container">
                            <div className="header-profile-avatar">JD</div>
                            <p className="header-profile-name">Organisatie A</p>
                            <button className="header-profile-dropdown" aria-label='Open Menu'>
                                <i className="fa-solid fa-angle-down fa-2x"></i>
                            </button>
                        </div>
                        <div className='header-navbar'>
                            <div className="header-navbar-nav">
                                <Link className='link' to="/dashboard">Dashboard</Link>
                                <Link className='link' to="/privacy">Privacyverklaring</Link>
                            </div>
                            <div className="header-navbar-rol"></div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

export default Header;