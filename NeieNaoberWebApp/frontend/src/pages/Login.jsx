import Header from '../components/Header'
import Footer from '../components/Footer';

import './Login.css'

function Login() {
    return (
        <>
            <div className='page-layout'>
                <Header showAvatar={true} />
                <div className='login-container'></div>
                <Footer />
            </div>
        </>
    )
}

export default Login;