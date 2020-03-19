import { logout } from '../utils/auth'
import { withRouter } from 'next/router'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'

import { Nav, Navbar } from 'react-bootstrap'

import vars from '../styles/vars'
import styled from 'styled-components'
import { down } from 'styled-breakpoints'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faPuzzlePiece, faTrophy, faChartBar, faSignInAlt } from '@fortawesome/free-solid-svg-icons'

const RowNav = styled(Nav)`
    flex-direction: row;
`
const StyledNavbar = styled(Navbar)`
    top: ${props => props.hide && '-68px'};
    transition: top 0.2s;
`
const StyledNavLink = styled(Nav.Link)`
    font-size: 1.1rem;
    color: ${vars.gray};
    span, svg {
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
    ${down('xl')} {
        margin: 0 10px;
    }
`
const HeaderSpace = styled.div`
    display: block;
    margin-bottom: 68px;
`

const NavLink = (props) => {
    const { name, icon, path, ...rest } = props
    return (path ? (
            <Link href={path} passHref>
                <StyledNavLink {...rest}>
                    <Icon {...{icon}}></Icon>
                    <span> {name}</span>
                </StyledNavLink>
            </Link>
        ) : (
            <StyledNavLink {...rest}>
                <Icon {...{icon}}></Icon>
                <span> {name}</span>
            </StyledNavLink>
        )
    )
}

const ScrollNavbar = ({ children, ...props }) => {
    const [hidden, setHidden] = useState(0)
    const prevScroll = useRef(0)
    const onScroll = () => {
        var curScroll = window.pageYOffset || window.scrollY
        if (curScroll < 68) {
            setHidden(0)
        } else if (prevScroll.current < curScroll) {
            if (!hidden) {
                setHidden(1)
            }
        } else if (hidden) {
            setHidden(0)
        }
        prevScroll.current = curScroll
    }
    useEffect(() => {
        window.addEventListener('scroll', onScroll)
        return () => {
            window.removeEventListener('scroll', onScroll)
        }
    })
    return (
        <StyledNavbar {...props} hide={hidden}>
            {children}
        </StyledNavbar>
    )
}

const Header = (props) => {
    const { router, login } = props
    const navLinks = [
        //name,     favicon,       paths
        ['Main',    faHome,        ['/'],                       ],
        ['Problems',faPuzzlePiece, ['/problem', '/submission',],],
        ['Contest', faTrophy,      ['/contest',],               ],
        ['Ratings', faChartBar,    ['/rating',],                ],
    ]
    console.log('->', router.pathname)
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