import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'

import { Nav, Navbar } from 'react-bootstrap'

import vars from '../styles/vars'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const NavbarHeight = 60

export const StyledNavbar = styled(Navbar)`
  min-height: ${NavbarHeight}px;
  top: ${(props) => props.hide && `-${NavbarHeight}px`};
  transition: top 0.2s;
`
export const StyledNavTitle = styled.div.attrs({ className: 'mx-2 mx-lg-0' })`
  display: inline-block;
  font-size: 1.1rem;
  a {
    text-decoration: none !important;
  }
  span,
  svg {
    color: ${(props) => props.red && vars.red};
  }
`
export const HeaderSpace = styled.div`
  display: block;
  padding-top: ${NavbarHeight}px;
`

export const NavTitle = ({ name, icon, children, shrink = true, ...rest }) => (
  <StyledNavTitle {...rest}>
    {icon && <FontAwesomeIcon {...{ icon }} />}
    <NavText shrink={shrink}> {name}</NavText>
    {children}
  </StyledNavTitle>
)
export const NavText = ({ shrink, ...rest }) => (
  <span
    className={shrink ? 'd-inline d-md-none d-lg-inline' : undefined}
    {...rest}
  />
)

export const NavLink = ({ path, target, active, ...rest }) => {
  return path ? (
    <Link href={path} passHref>
      <Nav.Link active={active}>
        <NavTitle {...rest} />
      </Nav.Link>
    </Link>
  ) : (
    <Nav.Link>
      <NavTitle {...rest} />
    </Nav.Link>
  )
}

export const ScrollNavbar = (props) => {
  const [hidden, setHidden] = useState(false)
  const prevScroll = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      var curScroll = window.pageYOffset || window.scrollY
      if (curScroll < NavbarHeight) {
        setHidden(false)
      } else {
        setHidden(prevScroll.current < curScroll)
      }
      prevScroll.current = curScroll
    }
    window.addEventListener('scroll', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return <StyledNavbar {...props} hide={hidden ? true : undefined} />
}
