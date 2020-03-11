import _ from 'lodash';
import Link from 'next/link'
import { logout,isLogin } from '../utils/auth'
import { withRouter } from 'next/router'
const Header = (props) => {
    let router = props.router
    return (
        <header className="sticky-top">
            <nav className="navbar navbar-expand-sm navbar-light justify-content-between">
                <Link href="/">
                    <a className="navbar-brand head_typo">OTOG<span> - One Tambon One Grader</span></a>
                </Link>
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <Link href="/">
                            <a className={"nav-link head_typo" + (router.pathname === '/' && " active")}>
                                <i className="fa fa-home"></i> <span>Main</span>
                            </a>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link href="/problem">
                            <a className={"nav-link head_typo" + (router.pathname === '/problem' && " active")}>
                                <i className="fa fa-puzzle-piece"></i> <span>Problems</span>
                            </a>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link href="/contest">
                            <a className={"nav-link head_typo" + (router.pathname === '/contest' && " active")}>
                                <i className="fa fa-trophy"></i> <span>Contest</span>
                            </a>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link href="/rating">
                            <a className={"nav-link head_typo" + (router.pathname === '/rating' && " active")}>
                                <i className="fa fa-bar-chart"></i> <span>Ratings</span>
                            </a>
                        </Link>
                    </li>
                    <li className="nav-item">
                        {!isLogin(props.userData) ? <Link href="/login">
                            <a className="nav-link head_typo">
                                <i className="fa fa-sign-in"></i> <span>Login</span>
                            </a>
                        </Link> : <a id='logoutBot' className="nav-link head_typo" onClick={logout}>
                            <i className="fa fa-sign-in"></i> <span>Logout</span>
                        </a>}
                    </li>
                </ul>
                <style jsx>{`
                    nav {
                        background-color: #F1F1F1
                    }
                    #logoutBot {
                        color: red
                    }
                    `}</style>
            </nav>
        </header>
    )
}
export default withRouter(Header)