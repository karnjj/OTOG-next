import styled from 'styled-components'
import { Nav, Navbar } from 'react-bootstrap'
import { logout } from '../utils/auth'
import { withRouter } from 'next/router'
import { down } from 'styled-breakpoints'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faPuzzlePiece, faTrophy, faChartBar, faSignInAlt } from '@fortawesome/free-solid-svg-icons'
import vars from '../styles/vars'

const RowNav = styled(Nav)`
    flex-direction: row;
`
const StyledNavLink = styled(Nav.Link)`
    font-size: 1.1rem;
    color: ${vars.gray};
    span, i {
        color : ${props => props.red && vars.red};
    }
    &:hover {
        color: ${vars.gray};
    }
    ${down('xl')} {
        & > span {
            display: none;
        }
    }
`
const Icon = styled(FontAwesomeIcon)`
    font-size: 1.3rem;
    ${down('xl')} {
        padding: 0 10px;
    }
`
const HeadSpace = styled(Navbar)`
    margin: 0 auto 52px;
`

const NavLink = (props) => {
    const { name, icon, path, ...rest } = props
    return (
        <StyledNavLink href={path} {...rest}>
            <Icon icon={icon}></Icon>
            <span> {name}</span>
        </StyledNavLink>
    )
}

const Header = (props) => {
    const { router, login } = props
    const navLinks = [
        //name,     favicon,        path
        ['Main',    faHome,         '/',],
        ['Problems',faPuzzlePiece, '/problem',],
        ['Contest', faTrophy,       '/contest',],
        ['Ratings', faChartBar,    '/rating',],
    ]
    if (router.pathname != '/problem/[name]') {
        return (
            <Navbar bg='light' expand='sm'>
                <Navbar.Brand className='mr-auto'>
                    <StyledNavLink href='/'>
                        OTOG<span> - One Tambon One Grader</span>
                    </StyledNavLink>
                </Navbar.Brand>
                <RowNav>
                {navLinks.map(([ name, icon, path ]) => (
                    <NavLink 
                        {...{name, icon, path}} key={name}
                        active={router.pathname === path}
                    ></NavLink>
                ))}
                {login ? (
                    <NavLink name='Logout' icon={faSignInAlt} onClick={logout} red='true'></NavLink>
                ) : (
                    <NavLink name='Login' icon={faSignInAlt} path='/login'></NavLink>
                )}
                </RowNav>
            </Navbar>
        )
    } else return <></>
}
export default withRouter(Header)