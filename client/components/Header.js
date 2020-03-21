import { logout, useAuthContext } from '../utils/auth'
import { useRouter } from 'next/router'

import { Navbar } from 'react-bootstrap'
import { StyledNavLink, ScrollNavbar, HeaderSpace, RowNav, NavLink } from './CustomNavbar'
import { faHome, faPuzzlePiece, faTrophy, faChartBar, faSignInAlt } from '@fortawesome/free-solid-svg-icons'

const Header = () => {
    const userData = useAuthContext()
    const router = useRouter()
    const navLinks = [
        //name,     favicon,       paths
        ['Main',    faHome,        ['/'],                       ],
        ['Problems',faPuzzlePiece, ['/problem', '/submission',],],
        ['Contest', faTrophy,      ['/contest',],               ],
        ['Ratings', faChartBar,    ['/rating',],                ],
    ]
    return (
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
                {userData ? (
                    <NavLink name='Logout' icon={faSignInAlt} onClick={logout} red='true'/>
                ) : (
                    <NavLink name='Login' icon={faSignInAlt} path='/login'/>
                )}
                </RowNav>
            </ScrollNavbar>
        </>
    )
}
export default Header