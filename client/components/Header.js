import { logout } from '../utils/auth'
import { withRouter } from 'next/router'

import { Navbar } from 'react-bootstrap'
import { StyledNavLink, ScrollNavbar, HeaderSpace, RowNav, NavLink } from './CustomNavbar'
import { faHome, faPuzzlePiece, faTrophy, faChartBar, faSignInAlt } from '@fortawesome/free-solid-svg-icons'

const Header = (props) => {
    const { router, login } = props
    const navLinks = [
        //name,     favicon,       paths
        ['Main',    faHome,        ['/'],                       ],
        ['Problems',faPuzzlePiece, ['/problem', '/submission',],],
        ['Contest', faTrophy,      ['/contest',],               ],
        ['Ratings', faChartBar,    ['/rating',],                ],
    ]
    return (router.pathname != '/login' && router.pathname.slice(0, 6) != '/admin' &&
        <>
            <HeaderSpace/>
            <ScrollNavbar bg='light' expand='sm' fixed='top'>
                <Navbar.Brand className='mr-auto'>
                    <StyledNavLink href='/'>
                        OTOG<span> - One Tambon One Grader</span>
                    </StyledNavLink>
                </Navbar.Brand>
                <RowNav>
                {navLinks.map(([ name, icon, paths ]) => (
                    <NavLink 
                        {...{name, icon}}
                        path={paths[0]} key={name}
                        active={paths.some(path => path === router.pathname)}
                    />
                ))}
                {login ? (
                    <NavLink name='Logout' icon={faSignInAlt} onClick={logout} red='true'/>
                ) : (
                    <NavLink name='Login' icon={faSignInAlt} path='/login'/>
                )}
                </RowNav>
            </ScrollNavbar>
        </>
    )
}
export default withRouter(Header)