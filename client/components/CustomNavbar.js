import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'

import { Nav, Navbar } from 'react-bootstrap'

import vars from '../styles/vars'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export const StyledNavbar = styled(Navbar)`
	top: ${(props) => props.hide && '-56px'};
	transition: top 0.2s;
`
export const StyledNavTitle = styled.div`
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
	padding-top: 56px;
`

export const NavTitle = ({ name, icon, children, ...rest }) => (
	<StyledNavTitle {...rest}>
		{icon && <FontAwesomeIcon {...{ icon }} />}
		<NavText> {name}</NavText>
		{children}
	</StyledNavTitle>
)
export const NavText = (props) => (
	<span className='d-inline d-sm-none d-lg-inline' {...props} />
)

export const NavLink = ({ path, target, active, ...rest }) => {
	return path ? (
		<Link href={path} passHref>
			<Nav.Link {...{ active }}>
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
	return <StyledNavbar {...props} hide={hidden} />
}
