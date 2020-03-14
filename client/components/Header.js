import styled from 'styled-components'
import { Nav, Navbar } from 'react-bootstrap'
import { logout, isLogin } from '../utils/auth'
import { withRouter } from 'next/router'
import { down } from 'styled-breakpoints'
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
const Icon = styled.i`
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
            <Icon className={`fa fa-${icon}`}></Icon>
            <span> {name}</span>
        </StyledNavLink>
    )
}

const Header = (props) => {
    const { router, userData } = props
    const navLinks = [
        //name,     favicon,        path
        ['Main',    'home',         '/',],
        ['Problems','puzzle-piece', '/problem',],
        ['Contest', 'trophy',       '/contest',],
        ['Ratings', 'bar-chart',    '/rating',],
    ]
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
            {isLogin(userData) ? (
                <NavLink name='Logout' icon='sign-in' onClick={logout} red='true'></NavLink>
            ) : (
                <NavLink name='Login' icon='sign-in' path='/login'></NavLink>
            )}
            </RowNav>
        </Navbar>
    )
}
export default withRouter(Header)