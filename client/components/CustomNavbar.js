import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'

import { Nav, Navbar } from 'react-bootstrap'

import vars from '../styles/vars'
import styled from 'styled-components'
import { down } from 'styled-breakpoints'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export const RowNav = styled(Nav)`
	flex-direction: row;
`
export const StyledNavbar = styled(Navbar)`
	top: ${props => props.hide && '-68px'};
	transition: top 0.2s;
`
export const StyledNavLink = styled(Nav.Link)`
	font-size: 1.1rem};
	color: ${vars.gray};
	span,
	svg {
		color: ${props => props.red && vars.red};
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
export const Icon = styled(FontAwesomeIcon)`
	${down('xl')} {
		margin: 0 10px;
	}
`
export const HeaderSpace = styled.div`
	display: block;
	margin-bottom: 68px;
`

export const NavLink = props => {
	const { name, icon, path, ...rest } = props
	return path ? (
		<Link href={path} passHref>
			<StyledNavLink {...rest}>
				<Icon {...{ icon }}></Icon>
				<span> {name}</span>
			</StyledNavLink>
		</Link>
	) : (
		<StyledNavLink {...rest}>
			<Icon {...{ icon }}></Icon>
			<span> {name}</span>
		</StyledNavLink>
	)
}

export const ScrollNavbar = props => {
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
