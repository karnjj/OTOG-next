import { Nav, Navbar } from 'react-bootstrap'
import { logout, isLogin } from '../utils/auth'
import { withRouter } from 'next/router'

const NavLink = (props) => {
    const { name, icon, path, active, onClick, red, } = props
    const className = `head_typo ${active && 'active'} ${red && 'font_red'}`
    return (
        <Nav.Link href={path} onClick={onClick} className={className}>
            <i className={`fa fa-${icon}`}></i>
            <span> {name}</span>
        </Nav.Link>
    )
}

const Header = (props) => {
    const { router, userData } = props
    const navLinks = [
        // name,    favicon,        path
        ['Main',    'home',         '/',],
        ['Problems','puzzle-piece', '/problem',],
        ['Contest', 'trophy',       '/contest',],
        ['Ratings', 'bar-chart',    '/rating',],
    ]
    return (
        <Navbar bg='light' expand='sm'>
            <Navbar.Brand className="mr-auto">
                <Nav.Link href='/' className="head_typo">
                    OTOG<span> - One Tambon One Grader</span>
                </Nav.Link>
            </Navbar.Brand>
            <Nav>
            {navLinks.map(([ name, icon, path ]) => (
                <NavLink 
                    name={name} icon={icon} path={path} key={name}
                    active={router.pathname === path}
                ></NavLink>
            ))}
            {isLogin(userData) ? (
                <NavLink name='Logout' icon='sign-in' onClick={logout} red></NavLink>
            ) : (
                <NavLink name='Login' icon='sign-in' path='/login'></NavLink>
            )}
            </Nav>
        </Navbar>
    )
}
export default withRouter(Header)